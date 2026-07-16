const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");

const router = express.Router();

// Store uploaded file in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4.5 * 1024 * 1024 // 4.5 MB
  }
});

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const { name, email, phone, position } = req.body;

    if (!name || !email || !phone || !position || !req.file) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Job Application - ${position}`,
      html: `
        <h2>New Career Application</h2>

        <p><b>Name:</b> ${name}</p>

        <p><b>Email:</b> ${email}</p>

        <p><b>Phone:</b> ${phone}</p>

        <p><b>Position:</b> ${position}</p>
      `,
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer
        }
      ]
    });

    res.json({
      success: true,
      message: "Application submitted successfully."
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

module.exports = router;