/* eslint-disable @typescript-eslint/no-unused-vars */
import functions from "firebase-functions"
import admin from "firebase-admin"

admin.initializeApp();

exports.sendPaymentReminder = functions.pubsub
    //The below statement runs a cron job scheduled for  everyday
    .schedule('every 24 hours').onRun(async (context) => {
        const database = admin.firestore();
        const now = admin.firestore.Timestamp.now();
        const unpaidPaymentsQuery = database.collection('payments')
            .where('paymentStatus', '==', 'unpaid')
            .where('dueDate', '<=', now);

        const unpaidPaymentsSnapshot = await unpaidPaymentsQuery.get();

        unpaidPaymentsSnapshot.forEach(async (doc) => {
            const paymentData = doc.data();
            const userId = paymentData.userId; // Assume each payment has a userId field
            const userDoc = await database.collection('users').doc(userId).get();
            const userData = userDoc.data();

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
    });
