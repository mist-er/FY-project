const { getFirebaseAdmin } = require('../config/firebase');

const verifyFirebaseIdToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  // If no auth header, continue without Firebase user (optional auth)
  if (!authHeader.startsWith('Bearer ')) {
    req.firebaseUser = null;
    return next();
  }

  const idToken = authHeader.split(' ')[1];

  try {
    // Check if Firebase is available before trying to use it
    let admin;
    try {
      admin = getFirebaseAdmin();
    } catch (firebaseError) {
      // If Firebase is not configured, continue without auth
      req.firebaseUser = null;
      return next();
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decodedToken;
    return next();
  } catch (error) {
    // If token is invalid, continue without Firebase user (optional auth)
    req.firebaseUser = null;
    return next();
  }
};

module.exports = verifyFirebaseIdToken;

