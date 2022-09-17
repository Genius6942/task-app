/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { doc } = require("firebase/firestore");

admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

exports.startPushNofication = functions.https.onRequest((request, response) => {
  const uid = request.body.uid;
  if (!request.body.uid || !request.body.data) {
    response.status(400).send("Bad Request");
    console.log("Bad Request");
    return;
  }
  const data = JSON.parse(request.body.data);
  admin
    .firestore()
    .collection("users")
    .where("uid", "==", uid)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.docs.length < 0) {
        response.json({ success: false, message: "User not found with uid " + uid });
      } else {
        const doc = querySnapshot.docs[0];
        doc.ref
          .get()
          .then(doc => {
            const FCMToken = doc.data().FCMToken;
            const payload = {
              token: FCMToken,
              notification: {
                ...data,
              },
            };
            if (!FCMToken) {
              response.json({
                success: false,
                message: "User does not have a registered FCM token",
              });
            }
            admin
              .messaging()
              .send(payload)
              .then(res => {
                response.json({
                  success: true,
                  message: "Notification sent successfully",
                });
              })
              .catch(err => {
                response.json({ success: false, message: err.message });
              });
          })
          .catch(err => {
            response.json({ success: false, message: err.message });
          });
      }
    })
    .catch(err => {
      response.json({ success: false, message: err.message });
    });
});
