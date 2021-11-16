const sgMail = require('@sendgrid/mail');

module.exports = async (email, token) => {
  sgMail.setApiKey(process.env.EMAIL_API_KEY);
    const msg = {
      to: email, 
      from: 'upbringohelp@gmail.com', 
      subject: 'RESET PASSWORD',
      html: `Here is your token for password rest<br><br>
            <strong>Token</strong>: ${token}`,
    }
    try {
      await sgMail.send(msg)
    } catch (err) {
      console.error(error.response.body)
    }
}
