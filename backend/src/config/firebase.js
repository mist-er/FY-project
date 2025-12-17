const admin = require('firebase-admin');

let firebaseApp;
let initializationError = null;

const getFirebaseAdmin = () => {
  if (firebaseApp) {
    return admin;
  }

  if (initializationError) {
    throw initializationError;
  }

  const {
    FIREBASE_PROJECT_ID: projectId,
    FIREBASE_CLIENT_EMAIL: clientEmail,
    FIREBASE_PRIVATE_KEY: privateKey,
  } = process.env;

  // Validate that all required credentials are present and not empty
  if (!projectId || typeof projectId !== 'string' || projectId.trim() === '') {
    initializationError = new Error(
      'FIREBASE_PROJECT_ID is missing or empty. Please set it in your .env file.'
    );
    throw initializationError;
  }

  if (!clientEmail || typeof clientEmail !== 'string' || clientEmail.trim() === '') {
    initializationError = new Error(
      'FIREBASE_CLIENT_EMAIL is missing or empty. Please set it in your .env file.'
    );
    throw initializationError;
  }

  if (!privateKey || typeof privateKey !== 'string' || privateKey.trim() === '') {
    initializationError = new Error(
      'FIREBASE_PRIVATE_KEY is missing or empty. Please set it in your .env file.'
    );
    throw initializationError;
  }

  try {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId.trim(),
        clientEmail: clientEmail.trim(),
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });

    return admin;
  } catch (error) {
    initializationError = new Error(
      `Failed to initialize Firebase Admin: ${error.message}. Please check your Firebase credentials.`
    );
    throw initializationError;
  }
};

module.exports = { getFirebaseAdmin };

