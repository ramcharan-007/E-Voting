// emailSenderFunction.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ramcharan25062001@gmail.com',
    pass: 'Ram@25062001'
  }
});

exports.sendElectionEmail = functions.database.ref('/election/state/status')
  .onUpdate(async (change, context) => {
    const newValue = change.after.val();
    if (newValue === 'ongoing') {
      const votersSnapshot = await admin.database().ref('/election/voters').once('value');
      const voters = votersSnapshot.val();
      
      // Send email to each voter
      Object.values(voters).forEach(async (voter) => {
        const mailOptions = {
          from: 'ramcharan25062001@gmail.com',
          to: voter.email,
          subject: 'Election Notification',
          text: 'Dear voter, the election has started. Please cast your vote.'
        };
        
        try {
          await transporter.sendMail(mailOptions);
          console.log(`Email sent to ${voter.email}`);
        } catch (error) {
          console.error(`Error sending email to ${voter.email}: ${error}`);
        }
      });
    }
  });



//   const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp();

// exports.checkElectionEnd = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
//   const db = admin.database();
//   const electionStateSnapshot = await db.ref('election/state').once('value');
//   const electionState = electionStateSnapshot.val();

//   if (electionState && electionState.status === 'ongoing') {
//     const currentTime = Date.now();
//     const electionEndTime = electionState.endTime;

//     if (currentTime >= electionEndTime) {
//       // End the election
//       // (Include the logic from handleEndElection here)
//     }
//   }
// });