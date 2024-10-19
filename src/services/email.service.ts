import 'dotenv/config';
import {MailerSend, EmailParams, Sender, Recipient} from 'mailersend';
import {Message} from '../types/message';

async function sendEmail(content: Message): Promise<void> {
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILER_SEND_API_KEY!,
  });
  const {to, subject, body} = content;

  const sentFrom = new Sender(
    process.env.EMAIL_ADDRESS!,
    process.env.EMAIL_SENDER!
  );

  const recipients = [new Recipient(to)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject?.length ? subject : 'No subject')
    .setText(body);

  await mailerSend.email.send(emailParams);
}

export {sendEmail};
