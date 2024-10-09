require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);
const consumeFromQueue = require("./queue");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const getRegistrationTokens = async () => {
  const db = admin.firestore();
  const tokensSnapshot = await db.collection("fcmTokens").get();
  const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);
  return tokens;
};

async function sendNotification(content) {
  const { title, body } = JSON.parse(content.toString());
  const message = {
    notification: {
      title,
      body,
    },
    tokens: getRegistrationTokens,
  };

  admin
    .messaging()
    .sendEachForMulticast(message)
    .then((response) => {
      console.log("Multicast notification sent:", response);
    })
    .catch((error) => {
      console.error("Error sending multicast notification:", error);
    });
}

async function startNotificationConsumer() {
  await consumeFromQueue(
    process.env.NOTIFICATION_QUEUE || "notification",
    sendNotification
  );
  console.log("Notification consumer started");
}

modules.export = { startNotificationConsumer };
