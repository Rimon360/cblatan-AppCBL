require("dotenv").config();
const cron = require("node-cron");
const axios = require("axios");
const rootURL = process.env.API_URL;
const resetUrl = rootURL + `/s/api/users/rrrrresetfactivity45453643rFD6533FFd653`;
// console.log("Started cron job...", resetUrl);
// Run a task every 30 seconds
// */5 * * * * * means every 5 seconds
// 0 22 * * * // every day at 10 pm
cron.schedule("0 22 * * *", () => {
  axios
    .post(resetUrl)
    .then((response) => {
      // console.log(response.data.message);

    })
    .catch((error) => {
      console.error(error.response.data);
    });
});