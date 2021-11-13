require('dotenv').config();
const jwt = require('jsonwebtoken');
const {User} = require('../models');

module.exports = {
  async signUp({body: {password, email}}, res) {
      try {
          const findUser = await User.findOne({email});

          if (findUser) {
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
              message: 'User or password does not match'
          });
      }
  },
  async login({body: {password, email}}, res) {
      try {

      } catch (e) {

      }
  }


};