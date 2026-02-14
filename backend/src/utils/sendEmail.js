const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (email, name) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const motivationalThoughts = [
        "The farmer is the only man in our economy who buys everything at retail, sells everything at wholesale, and pays the freight both ways. 🌱",
        "Water is the driving force of all nature. Proper water management today ensures a green tomorrow. 💧"
    ];

    const mailOptions = {
        from: `"Aqua AgriLink Owner" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Aqua AgriLink 🌱',
        text: `Hi ${name},\n\nWelcome to Aqua AgriLink 🌱\n\nHere are some farming motivational thoughts for you:\n1. ${motivationalThoughts[0]}\n2. ${motivationalThoughts[1]}\n\nBest Regards,\nAqua AgriLink Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

module.exports = { sendWelcomeEmail };
