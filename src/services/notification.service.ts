import {Message} from 'firebase-admin/messaging';
import * as admin from 'firebase-admin';
import 'dotenv/config';

const serviceAccount = require(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH as string
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const getRegistrationTokens = async (): Promise<string[]> => {
  const db = admin.firestore();
  const tokensSnapshot = await db.collection('fcmTokens').get();
  const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
  return tokens;
};

async function sendNotification(content: Message): Promise<void> {
  const {title, body} = JSON.parse(content.toString());
  const tokens = await getRegistrationTokens();
  const message = {
    notification: {
      title,
      body,
    },
    tokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log('Multicast notification sent:', response);
  } catch (error) {
    console.error('Error sending multicast notification:', error);
  }
}

export {sendNotification};
