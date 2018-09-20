let {Storage} = require("./models/user.js");
let {ServerApp} = require('webprogbase-console-view');
let {ConsoleBrowser} = require('webprogbase-console-view');
let {InputForm} = require('webprogbase-console-view');


let app = new ServerApp();
let browser = new ConsoleBrowser();
let storage = new Storage('data/users.json');

app.use("/", function (req, res) {
  let links = {
    "users": "Show user interaction menu"
  };
  res.send("You are in main menu", links);
});

app.use("users", function (req, res) {
  let links = {
    "allUsers": "Show all users",
    "getUser": "Get user by id"
  };
  res.send("You are in main menu", links);
})

app.use("allUsers", function (req, res) {
  let users = storage.getAll();
  let respStr = '';
  users.forEach(function(user) {
    respStr += 'id: '+ user.id + ' | fullname: ' + user.fullname + '\n';
  }, this);
  res.send(respStr);
})



app.use("getUser", function (req, res) {
  let nextState = "showUser";
  let fields = {
      "id": "Enter student id:"
  };
  let form = new InputForm(nextState, fields);
  res.send("Get user by id", form);
})

app.use("showUser", function (req, res) {
  let user = storage.getById(req.data.id);
  if(!user) {
    res.redirect("getUser");
    return;
  }
  let respStr = 'id: '+ user.id + ' | fullname: ' + user.fullname + '\n';
  res.send(respStr);
})




app.listen(3000);
browser.open(3000);