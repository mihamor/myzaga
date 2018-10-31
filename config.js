let config = {

    port : process.env["PORT"] || 3015,
    //mongo_url: "mongodb://etojemiha:admin123@ds147033.mlab.com:47033/heroku_ggxqz9r1"
    mongo_url: provess.env["MONGODB_URI"] || "mongodb://localhost:27017/myzaga"
}

module.exports = config;