const { getFirebaseAdmin } = require('../config/firebase');

let firebaseAvailable = null;

const isFirebaseAvailable = () => {
  if (firebaseAvailable !== null) {
    return firebaseAvailable;
  }

  try {
    getFirebaseAdmin();
    firebaseAvailable = true;
    return true;
  } catch (error) {
    firebaseAvailable = false;
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firebase is not configured. Push notifications will be disabled.');
      console.warn('To enable notifications, set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your .env file.');
    }
    return false;
  }
};

const sendPushNotification = async ({ token, title, body, data = {} }) => {
  if (!token) {
    throw new Error('FCM device token is required to send a notification.');
  }

  if (!isFirebaseAvailable()) {
    console.warn('Push notification skipped: Firebase is not configured.');
    return null;
  }

  try {
    const admin = getFirebaseAdmin();

    const message = {
      token,
      notification: {
        title,
        body,
      },
      data,
    };

    return await admin.messaging().send(message);
  } catch (error) {
    console.error('Error sending push notification:', error.message);
    // Don't throw - allow the app to continue even if notification fails
    return null;
  }
};

const sendBookingConfirmationNotification = async ({ token, venueName, eventDateTime }) => {
  const title = 'Booking Confirmed';
  const body = eventDateTime
    ? `Your booking for ${venueName} is confirmed on ${eventDateTime}.`
    : `Your booking for ${venueName} is confirmed.`;

  return sendPushNotification({
    token,
    title,
    body,
    data: { type: 'BOOKING_CONFIRMATION' },
  });
};

module.exports = {
  sendPushNotification,
  sendBookingConfirmationNotification,
};

