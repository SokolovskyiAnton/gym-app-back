require('dotenv').config();
const jwt = require('jsonwebtoken');
const {User, Token} = require('../models');
const {verify} = require("jsonwebtoken");
const {createUserConfirmationEmail} = require('./mail.controller')

module.exports = {
  async signUp({body: {username, password, email}}, res) {
      try {
          const isEmailCorrect = /(?:[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
          const findUser = await User.findOne({email});

          if (findUser || !isEmailCorrect) {
              return res.status(403).send({
                  message: 'Sorry, this email is not available'
              });
          }
          const token = jwt.sign({
              email: email
          }, process.env.JWT_SECRET, {})

          const createUser = await new User({username, email, password, token});
          const saveUser = await createUser.save();

          await createUserConfirmationEmail(saveUser);

          return res.status(200).send({
              message: 'User is created'
          })
      } catch (e) {
          return res.status(403).send({
              message: "Sorry, but user or email doesn't match"
          });
      }
  },
  async login(req, res) {
      const {email, password} = req.body
      try {
          const findUser = await User.findOne({email});

          if (!findUser) {
              return res.status(403).send({
                  message: "Sorry, but user or email doesn't match"
              })
          }
          const isPasswordCorrect = findUser.password === password;

          if (!isPasswordCorrect) {
              return res.status(403).send({
                  message: "Sorry, but user or email doesn't match"
              })
          }

          const accessToken = jwt.sign({
              userId: findUser._id,
              email: findUser.email
          }, process.env.JWT_SECRET, {expiresIn: '30m'})

          const refreshToken = jwt.sign({
              userId: findUser._id,
              email: findUser.email
          }, process.env.JWT_SECRET_REFRESH, {expiresIn: '30day'})
          const foundToken = await Token.findOne({
              user: findUser._id
          })

          if (foundToken) {
              await Token.findOneAndUpdate({user: findUser._id}, {token: accessToken}, {useFindAndModify: false})
              res.cookie('token', refreshToken, {maxAge: 3600 * 24 * 30})
              return res.status(200).send({
                  accessToken,
                  id: findUser._id,
                  username: findUser.username,
                  email: findUser.email,
                  verifyAt: findUser.verifyAt
              })
          }

          const item = await new Token({token: accessToken, user: findUser._id})
          item.save()
          res.cookie('token', refreshToken, {maxAge: 3600 * 24 * 30})
          return res.status(200).send({
              accessToken,
              id: findUser._id,
              username: findUser.username,
              email: findUser.email,
              verifyAt: findUser.verifyAt
          })
      } catch (e) {
          return res.status(403).send({
              message: 'User or password does not match'
          });
      }
  },
  async logout({headers: {authorization}}, res) {
      if (!authorization) {
          return res.status(403).send({
              message: "User isn't authorized"
          })
      }
      const token = authorization.split(' ')[1];
      const user = await jwt.decode(token, process.env.JWT_SECRET)

      const foundToken = await Token.findOne({user: user.userId})

      if (!foundToken) {
          return res.status(403).send({
              message: "User isn't authorized"
          })
      }

      await Token.findByIdAndDelete(foundToken._id)
      res.clearCookie('token')
      return res.status(200).send({
          message: "User is logged out"
      })

  },
  async refreshToken(req, res) {
      const refreshToken = req.cookies.token
      if (!refreshToken) {
          return res.status(403).send({
              message: 'Forbidden'
          })
      }
      const isRefreshTokenValid = verify(refreshToken, process.env.JWT_SECRET_REFRESH,(err) => {
          if (err) {
              return false;
          } else {
              return true;
          }
      })
      if (!isRefreshTokenValid) {
          return res.status(403).send({
              message: 'Forbidden'
          })
      }
      const decodeUser = await jwt.decode(refreshToken, process.env.JWT_SECRET_REFRESH)

      const currentToken = await Token.findOne({user: decodeUser.userId})

      if (!currentToken) {
          return res.status(403).send({
              message: 'Forbidden'
          })
      }

      const accessToken = jwt.sign({
          userId: decodeUser.userId,
          email: decodeUser.email
      }, process.env.JWT_SECRET, {expiresIn: '30m'})

      await Token.findOneAndUpdate({user: decodeUser.userId}, {token: accessToken}, {useFindAndModify: false})

      return res.status(200).send({
          accessToken
      })
  },
  async verifyEmail(req, res) {
      try {
          const token = req.params.token;
          const decodeUser = await jwt.decode(token, process.env.JWT_SECRET);
          const findUser = await User.findOne({email: decodeUser.email})

          if (findUser.verifyAt) {
              return res.redirect('https://lichess.org/')
          }

          await User.findOneAndUpdate({email: decodeUser.email}, {verifyAt: new Date()}, {useFindAndModify: false});
          res.redirect('https://lichess.org/');
      } catch (e) {
          res.status(404).send({
              massage: 'Forbidden'
          })
      }
  }


};
