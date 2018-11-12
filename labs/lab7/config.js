let config = {
    port : process.env["PORT"] || 3015,
    //mongo_url: "mongodb://etojemiha:admin123@ds147033.mlab.com:47033/heroku_ggxqz9r1"
    mongo_url: process.env["MONGODB_URI"] || "mongodb://localhost:27017/myzaga",
    cloudinary: {
        cloud_name: "doulmg780",
        api_key: "698981441516159",
        api_secret: "C5Ls75nQCs14NQNdQ8ycqQmcpQY"
    },
    salt : "mYzAg@@@S@/\T=)",
    secret : "=)))"
}

module.exports = config;