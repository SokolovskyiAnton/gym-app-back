const {AuthService} = require('../services/authService')
const Auth = new AuthService()

module.exports = {
  async getProfile(req, res) {
      await Auth.getProfile(req, res)
  },
  async signUp(req, res) {
      await Auth.signUp(req, res)
  },
  async login(req, res) {
      await Auth.login(req, res)
  },
  async logout(req, res) {
     await Auth.logout(req, res)
  },
  async refreshToken(req, res) {
      await Auth.refreshToken(req, res)
  },
  async verifyEmail(req, res) {
      await Auth.verifyEmail(req, res)
  },
  async forgotPassword(req, res) {
      await Auth.forgotPassword(req, res)
  },
  async resetPassword(req, res) {
      await Auth.resetPassword(req, res)
  }
};
