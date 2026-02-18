const dbConfig = {
  url: process.env.DB_URL || "mongodb://127.0.0.1:27017/appcbldb",
};

module.exports = dbConfig;
