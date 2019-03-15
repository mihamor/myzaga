# Myzaga
Myzaga is a social sound platform.
Backend is written in node.js using express.js.
Frontend is written with usage of React, Redux, socket.io.


### Starting
To start server you need to setup your config.js in folowing format:
```js
let config = {
    port : ""
    mongo_url: ""
    cloudinary: {
        cloud_name: ""
        api_key: "",
        api_secret: ""
    },
    salt : "",
    secret : "",
    jwt_secret: ""
}

module.exports = config;
```

Starting server: 
```
npm start
```
Building client app:
```
cd client
npm run build
```

Live app:
https://myzaga.herokuapp.com/
