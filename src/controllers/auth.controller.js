require('dotenv').config();
const jwt = require('jsonwebtoken');
const {User, Token} = require('../models');

module.exports = {
  async signUp({body: {password, email}}, res) {
      try {
          const isEmailCorrect = /(?:[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
          const findUser = await User.findOne({email});

          if (findUser || !isEmailCorrect) {
              return res.status(403).send({
                  message: 'Sorry, this email is not available'
              });
          }

          const createUser = await new User({email, password});
          await createUser.save()

          return res.status(200).send({
              message: 'User is created'
          })
      } catch (e) {
          return res.status(403).send({
              message: "Sorry, but user or email doesn't match"
          });
      }
  },
  async login({body: {password, email}}, res) {
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
          }, process.env.JWT_SECRET, {expiresIn: '5m'})

          const refreshToken = jwt.sign({
              userId: findUser._id,
              email: findUser.email
          }, process.env.JWT_SECRET, {expiresIn: '30day'})

          const foundToken = await Token.findOne({
              user: findUser._id
          })

          if (foundToken) {
              await Token.findByIdAndUpdate(findUser._id, {token: refreshToken}, {useFindAndModify: false})
              return res.status(200).send({
                  accessToken,
                  refreshToken,
                  id: findUser._id,
                  username: findUser.username,
                  email: findUser.email,
                  exercises: findUser.exercises
              })
          }

          const item = await new Token({token: refreshToken, user: findUser._id})
          item.save()

          return res.status(200).send({
              accessToken,
              refreshToken,
              id: findUser._id,
              username: findUser.username,
              email: findUser.email,
              exercises: findUser.exercises
          })
      } catch (e) {
          return res.status(403).send({
              message: 'User or password does not match'
          });
      }
  }


};