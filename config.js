let config = {

    port : process.env["PORT"] || 3015,
    mongo_login: "etojemiha",
    mongo_password: "admin123",
    mongo_url: "mongodb://etojemiha:admin123@ds147033.mlab.com:47033/heroku_ggxqz9r1"
}

module.exports = config;