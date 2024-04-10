const { require } = require('commonjs');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: '',
        pass: ''
    }
});

// Route to handle form submission
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Email content
    const mailOptions = {
        from: 'your_email@example.com',
        to: 'gabriel@amorim.pro',
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Sending email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
