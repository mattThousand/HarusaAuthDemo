import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.onSignUp = functions.auth.user().onCreate(async (user) => {
  const customClaims = {
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': 'user',
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-user-id': user.uid,
    },
  };

  try {
    await admin.auth().setCustomUserClaims(user.uid, customClaims);
    const metadataRef = admin.database().ref('/metadata/' + user.uid);

    return metadataRef.set({ refreshTime: new Date().getTime() });
  } catch (error) {
    console.error({ error });
  }
});
