const express = require("express");
const router = express.Router();

const transporter = require("../services/email");

router.post("/", async (req, res) => {

    try {

        const { name, email, project, message } = req.body;

        if (!name || !email || !message) {

            return res.status(400).json({
                success: false,
                message: "All required fields must be filled."
            });

        }

        await transporter.sendMail({

            from: `"SA Solutions Website" <${process.env.SMTP_USER}>`,

            to: process.env.ADMIN_EMAIL,

            subject: "📩 New Contact Form Submission",

            html: `
                <h2>New Client Inquiry</h2>

                <hr>

                <p><strong>Name:</strong> ${name}</p>

                <p><strong>Email:</strong> ${email}</p>

                <p><strong>Project:</strong> ${project || "Not Provided"}</p>

                <p><strong>Message:</strong></p>

                <p>${message}</p>

                <hr>

                <p>This email was sent from your website Contact Form.</p>
            `
        });

        res.json({
            success: true,
            message: "Message sent successfully."
        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Unable to send email."
        });

    }

});

module.exports = router;