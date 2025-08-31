// utils/mailer.js
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import dotenv from "dotenv";

dotenv.config();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

// Mailgen instance with ORVN branding
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "ORVN",
    link: "https://orvn.io",
    logo: "https://orvn.io/logo.png",
  },
});

// Subject line options (rotates randomly)
const subjectLines = [
  "Africa’s Next Growth System Starts Here 🚀",
  "Welcome to ORVN — Where Data Meets Growth",
  "Smarter Growth, Built in Africa 🌍",
];

/**
 * Sends a complimentary welcome email
 * @param {string} email
 */
export const sendComplimentaryEmail = async (email) => {
  const firstName = "Builder"; // fallback since no signup yet
  const subject =
    subjectLines[Math.floor(Math.random() * subjectLines.length)];

  const emailBody = mailGenerator.generate({
    body: {
      name: firstName,
      greeting: `Hi ${firstName},`,
      intro: "What if your growth wasn’t guesswork — but a system?",
      signature: "💜 The ORVN Team",

      table: {
        data: [
          {
            "✨ At ORVN (Oracle Renaissance Vision Network)":
              "We believe Africa’s transformation will be powered by **Data, AI, and Branding.**",
          },
          {
            "🚀 Why we built the Automated Growth System (AGS)":
              "A framework where analytics + automation + storytelling work together to help businesses, creators, freelancers, and students grow smarter, faster, and stronger.",
          },
          {
            "📊 Here’s how we do it":
              "🔹 We analyze your data to uncover what’s working and what’s not.\n🔹 We build AI-powered automations that save time and cut costs.\n🔹 We craft branding strategies that make your business unforgettable.\n🔹 We connect you with a community of builders (HOOB: House of Builders) to learn, share, and grow.",
          },
        ],
      },

      action: {
        instructions: "Start your journey with ORVN here:",
        button: {
          color: "#3a0088",
          text: "Explore ORVN 🌍",
          link: "https://orvn.io",
        },
      },

      outro:
        "This isn’t just about services. It’s about creating Africa’s next wave of builders, innovators, and leaders.\n\n👉 Stay tuned for resources, opportunities, and updates from ORVN.\n\n-Live it. Create it. Become it.",
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject,
    html: emailBody,
  };

  await transporter.sendMail(mailOptions);
};
