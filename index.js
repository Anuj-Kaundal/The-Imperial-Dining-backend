const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require('nodemailer');
const userdata = require('./model/user');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cors = require("cors");

app.use(cors({
  origin: "https://imperial-dining.vercel.app",
  credentials: true
}));

app.options("*", cors());

console.log(process.env.FRONTEND_URL);
const PORT = process.env.PORT

// book table

app.post('/book', async (req, res) => {
    try {
        const { person, date, time, name, email, phone, subject } = req.body;

        console.log(person, date, time, name, email, phone, subject); // optional

        const book = await userdata.create({
            person,
            date,
            time,
            name,
            email,
            phone,
            subject
        });

        res.status(200).json({ message: "Book done", data: book });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// contact us

app.post("/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log(name, email, subject, message);
    const contactUs = await userdata.create({
        name,
        email,
        subject,
        message
    });
    res.status(200).json({ message: "contact done" });
})

// book by place 

app.post('/place', async (req, res) => {
    const { place, person, date, time } = req.body
    const addplace = await userdata.create({
        place,
        person,
        date,
        time
    });
    res.status(200).json({ message: "contact done" });
});

// book a table

app.post('/tablebook', async (req, res) => {
    const { name, email, phone, date, time, adults, children } = req.body;
    const booktable = await userdata.create({
        name,
        email,
        phone,
        date,
        time,
        adults,
        children
    });
    res.status(200).json({ message: "Book done", data: booktable });
})

// sending email notofication

// Route
app.post('/send', async (req, res) => {
    const { person, date, time, name, email, place, adults, children, phone, subject } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // ✅ 1. USER EMAIL
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Booking Confirmed 🎉",
            html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: #000000; color: white; padding: 25px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">🍽️ The Imperial Dining</h1>
                <p style="margin: 8px 0 0; font-size: 16px;">Welcome & Thank You for Your Reservation 🙏</p>
            </div>

            <!-- Body -->
            <div style="padding: 25px;">
                <h2 style="color: #333;">Hello ${name},</h2>
                <p style="color: #555; font-size: 16px;">
                    We’re delighted to confirm your booking at <b>The Imperial Dining</b>.  
                    We look forward to serving you a wonderful experience! 😊
                </p>

                <!-- Details Box -->
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><b>📅 Date:</b> ${date}</p>
                    <p><b>⏰ Time:</b> ${time}</p>
                    <p><b>🏠 Time:</b> ${place}</p>
                    <p><b>👨 Time:</b> ${adults}</p>
                    <p><b>👶 Time:</b> ${children}</p>
                    <p><b>👥 Number of People:</b> ${person}</p>
                </div>

                <p style="color: #555;">
                    If you need any assistance or wish to modify your booking, feel free to reply to this email.
                </p>

                <p style="margin-top: 30px; color: #333;">
                    Warm Regards,<br/>
                    <b>Team The Imperial Dining ❤️</b>
                </p>
            </div>

            <!-- Footer -->
            <div style="background: #eeeeee; text-align: center; padding: 15px; font-size: 14px; color: #777;">
                <p>We can’t wait to host you 🍷</p>
            </div>

        </div>
    </div>
    `
        });

        // ✅ 2. ADMIN EMAIL
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // admin ka email
            subject: "New Booking 📩",
            html: `
                <h2>New Booking Received</h2>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Date:</b> ${date}</p>
                <p><b>Time:</b> ${time}</p>
                <p><b>People:</b> ${person}</p>
                <p><b>Subject:</b> ${subject}</p>
            `
        });

        res.status(200).json({
            success: true,
            message: "Booking + Emails sent ✅"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Error sending email ❌"
        });
    }
});


app.listen(PORT, () => {
    console.log('backend is running sucessfully');
})