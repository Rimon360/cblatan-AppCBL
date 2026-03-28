require("dotenv").config()
const cron = require("node-cron")
const axios = require("axios")
const rootURL = process.env.API_URL
const resetUrl = rootURL + `/api/users/rrrrresetfactivity45453643rFD6533FFd653`
const deleteOlderChat = rootURL + `/api/users/chat/private/delete/older`
// console.log("Started cron job...", resetUrl);
// Run a task every 30 seconds
// */5 * * * * * means every 5 seconds
// 0 22 * * * // every day at 10 pm

cron.schedule("0 22 * * *", async () => {
  try {
    let result1 = await axios.post(resetUrl)
    // console.log(result1.data, 1)
    let result2 = await axios.delete(deleteOlderChat)
    // console.log(result2.data, 2)
  } catch (error) {
    console.log(error?.response?.data?.message || error.message)
  }
})
