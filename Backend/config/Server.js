const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    // Configure your email transport using the default SMTP transport and a Gmail account
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ramcharan25062001@gmail.com',
            pass: 'Ramcharan@2506'
        }
    });

    try {
        for (const email of to) {
            let mailOptions = {
                from: 'your-email@gmail.com',
                to: email,
                subject: subject,
                text: text
            };

            await transporter.sendMail(mailOptions);
        }
        res.status(200).send('Emails sent successfully');
    } catch (error) {
        console.error('Error sending emails: ', error);
        res.status(500).send('Error sending emails');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
