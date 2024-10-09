const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
const { consumeFromQueue } = require("./queue");
require("dotenv").config();

async function sendEmail(content) {
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILER_SEND_API_KEY,
  });
  const { to, subject, body } = JSON.parse(content.toString());

  const sentFrom = new Sender(
    process.env.EMAIL_ADDRESS,
    process.env.EMAIL_SENDER
  );

  const recipients = [new Recipient(to)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setText(body);

  await mailerSend.email.send(emailParams);
}

async function startEmailConsumer() {
  await consumeFromQueue(process.env.EMAIL_QUEUE || "email", sendEmail);
  console.log("Email consumer started");
}

modules.export = { startEmailConsumer };
