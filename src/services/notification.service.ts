import * as admin from 'firebase-admin';
import 'dotenv/config';

export async function sendNotification(content: {
  title: string;
  body: string;
}): Promise<void> {
  try {
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

    const {title, body} = content;
    const tokens = await getRegistrationTokens();
    const message = {
      notification: {
        title,
        body,
      },
      tokens,
    };
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log('Multicast notification sent:', response);
  } catch (error) {
    console.error('Error sending multicast notification:', error);
  }
}
