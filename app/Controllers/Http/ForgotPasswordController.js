'use strict'

const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      // retrieving email sent in request
      const email = request.input('email')

      // finding user with the informed email
      const user = await User.findByOrFail('email', email)

      // registering the token
      user.token = crypto.randomBytes(10).toString('hex') // random token
      user.token_created_at = new Date() // date of when token was created

      await user.save()

      await Mail.send('emails.forgotpass',
        { email, link: `https://google.com/token=${user.token}` },
        (message) => {
          message.from('me@danmiranda.io')
          message.to(email)
        })
    } catch (err) {
      return response
        .status(err.status)
        .send(
          { error:
            { message: 'Something went wrong. This email does not seem to be from a valid user' }
          }
        )
    }
  }
}

module.exports = ForgotPasswordController