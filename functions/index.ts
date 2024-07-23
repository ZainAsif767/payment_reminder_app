/* eslint-disable no-undef */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendPaymentReminder = functions.pubsub
    //The below statement runs a cron job scheduled for  everyday
    .schedule('every 24 hours').onRun(async () => {
        const database = admin.firestore();
        const now = admin.firestore.Timestamp.now();
        const unpaidPaymentsQuery = database.collection('payments')
            .where('paymentStatus', '==', false)
            .where('dueDate', '<=', now);

        const unpaidPaymentsSnapshot = await unpaidPaymentsQuery.get();
        const userIds = unpaidPaymentsSnapshot.docs.map(doc => doc.data().userId);

        const userDocs = await database.collection('users').where('userId', 'in', userIds).get();
        const userDataMap = userDocs.docs.reduce((map, doc) => {
            map[doc.id] = doc.data();
            return map;
        }, {});
        const promises = unpaidPaymentsSnapshot.docs.map(async (doc) => {
            const paymentData = doc.data();
            const userId = paymentData.userId;
            const userData = userDataMap[userId];

            if (userData && userData.fcmToken) {
                const message = {
                    notification: {
                        title: 'Payment Reminder',
                        body: `Your payment for ${paymentData.title} is overdue.`,
                    },
                    token: userData.fcmToken,
                };

                try {
                    await admin.messaging().send(message);
                    console.log('Notification sent to user:', userId);
                } catch (error) {
                    console.error('Error sending notification:', error);
                }
            }
        });

        await Promise.all(promises);
    });
