require("dotenv").config();
const cron = require("node-cron");
const axios = require("axios");
const path = require("path");
const ipv4 = require("ip4");
const fs = require("fs");
const { sendEmail, prependToFile } = require("./src/utils/util");

const resetUrl = `http://${ipv4}:8000/api/products/reset_wastage`;
const reportUrl = `http://${ipv4}:8000/api/products/get_report`;
const fileSaveDir = "../reports/";
console.log("Started cron job...", reportUrl);

// Run a task every 30 seconds
// */5 * * * * * means every 5 seconds
// 0 22 * * *
cron.schedule("*/5 * * * * *", () => {
  axios
    .get(reportUrl)
    .then((response) => {
      if (!fs.existsSync(fileSaveDir)) {
        fs.mkdirSync(fileSaveDir, { recursive: true });
      }
      let csvData = "Shop name,Product Name,Goods baked,Wastage, Date \n";
      response.data.products.forEach((product) => {
        let shopName = product.shop_name;

        product.products.forEach((p) => {
          csvData += `${shopName},${p.product_name},${p.baked},${p.wastage},${p.createdAt.split("T")[0]} \n`;
        });
      });

      const formattedDate = new Date().toISOString().split("T")[0]; //+ "_" + Date.now();
      let dir = fileSaveDir + formattedDate + ".csv";
      fs.writeFile(dir, csvData, async (err) => {
        if (err) {
          console.error("Error saving the file:", err);
        } else {
          // download the activity log file

          const source = "track.csv";
          const destinationDir = "../activity/";
          if (!fs.existsSync(destinationDir)) {
            fs.mkdirSync(destinationDir, { recursive: true });
          }

          if (fs.existsSync(source)) {
            const newFileName = new Date().toISOString().split("T")[0] + ".csv";
            fs.copyFileSync(source, path.join(destinationDir, newFileName));
            fs.unlinkSync(source);
          }

          // send the email
          const subject = "Wastage " + new Date().toISOString().split("T")[0];
          const text = "Please find the attached report for today.";
          const attachmentPath = dir; // Path to the file you want to attach
          await sendEmail(subject, text, attachmentPath);
          console.log("Email sent successfully with attachment:", attachmentPath);
          // reset the wastage
          axios
            .get(resetUrl)
            .then((response) => {
              console.log("Wastage reset successfully:", response.data);
            })
            .catch((error) => {
              console.error("Error resetting wastage:", error);
            });
        }
      });

      // end fetching data
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

// Run a task every evening at 10:00 PM
// cron.schedule("0 22 * * *", () => {
//   console.log("running a task every evening at 7:00 PM");
// });
