const express = require("express");
const startEmailConsumer = require("./src/email");
const startNotificationConsumer = require("./src/offlineNotification");

const app = express();

startEmailConsumer();

app.listen(process.env.PORT || 3003, () => {
  console.log("Server is running on port 3000");
});
