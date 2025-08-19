require("dotenv").config();
const fs = require("fs");
const nodemailer = require("nodemailer");

let seq = (min = 10000000, max = 99999999) => Math.floor(Math.random() * (max - min + 1)) + min;

let prependToFile = (filePath, data) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    const logFile = filePath.endsWith("/") ? filePath + "track.csv" : filePath + "/track.csv";
    const existingData = fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8") : "";
    const newData = data + existingData;
    fs.writeFileSync(logFile, newData, "utf8");
  } catch (error) {
    console.error("Error prepending to file:", error);
  }
};

module.exports.getDate = () => {
  return new Date().toISOString().replace(/T/, "; ").replace(/:/g, "-").split(".")[0];
};

const sendEmail = async (subject, text, attachmentPath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject,
    text,
    attachments: [
      {
        path: attachmentPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
exports.getPeruTime = () => new Date().toLocaleString('en-US', { timeZone: 'America/Lima' });
module.exports.sendEmail = sendEmail;
module.exports.prependToFile = prependToFile;
module.exports.seq = seq;
console.log(new Date().toISOString());
