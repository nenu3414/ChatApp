var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var mongoose = require("mongoose");
var port = process.env.PORT;

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("dotenv").config();
var dbUrl = process.env.DbUrl;

var Message = mongoose.model("Message", {
  name: String,
  message: String,
});

// var messages = [
//   { name: "John", message: "Hello" },
//   { name: "Jane", message: "World" },
// ];

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", (req, res) => {
  var message = new Message(req.body);
  message.save((err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      //messages.push(req.body);
      io.emit("message", req.body);
      res.sendStatus(200);
    }
  });
});

io.on("connection", (socket) => {
  console.log("User connected");
});

// mongoose.connect(dbUrl, (err) => {
//   console.log("mongodb connection successful");
// });

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    () => {
      console.log("MongoDB connection successful");
    },
    (err) => {
      console.log(err);
    }
  );

var server = http.listen(port, () => {
  console.log("Server is listening on port %d", port);
});
