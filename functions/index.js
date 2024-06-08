const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Use environment variables for sensitive information
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

exports.sendElectionEmail = functions.database.ref("/election/state/status")
    .onUpdate(async (change, context) => {
      const newValue = change.after.val();
      console.log("Election status updated:", newValue);

      if (newValue === "ongoing") {
        try {
          const votersSnapshot = await admin.database()
              .ref("/election/voters")
              .once("value");
          const voters = votersSnapshot.val();

          if (!voters) {
            console.log("No voters found.");
            return;
          }

          console.log("Voters fetched:", voters);

          // Send email to each voter
          for (const voterId in voters) {
            if (Object.prototype.hasOwnProperty.call(voters, voterId)) {
              const voter = voters[voterId];
              const mailOptions = {
                from: functions.config().gmail.email,
                to: voter.email,
                subject: "Election Notification",
                text: "Dear voter, the election has started."+
                "Please cast your vote.",
              };

              try {
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${voter.email}`);
              } catch (error) {
                console.error(`Error sending email to ${voter.email}:${error}`);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching voters:", error);
        }
      }
    });
