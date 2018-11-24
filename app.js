require("dotenv").config();

const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

///////////////////////////////////
const app = express();
const port = process.env.PORT || 3000;

////////////////////////////////// GMAIL configure
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.PASS
  },
  tls: {
    rejectUnauthorized: true
  }
});

/////////////////////////////////// set VIEWS and VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/////////////////////////////////// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/////////////////////////////////// ROUTES
app.route("/").get((req, res) => {
  res.render("index");
});

app.post("/new-reservation", (req, res) => {
  const { name, email, seat, time, date, note, phone } = req.body;

  const option = {
    from: `RESERVATION ${name} <${email}`,
    to: process.env.TO_EMAIL,
    subject: name,
    html: `
        <p><b>Name: ${name}</b></p>  
        <p><b>Date: ${date}</b></p>
        <p><b>Time: ${time}</b></p>
        <p><b>Seats: ${seat}</b></p>
        <p><b>Phone: ${phone}</b></p>
        <p><b>Email: ${email}</b></p>
        <p><b>Note: ${note || "empty"}</b></p>
        `
  };

  transporter.sendMail(option, (err, info) => {
    if (err) {
      res.send({
        status: "ERROR",
        message: "Something went wrong. Your reservation failed."
      });
    } else {
      res.send({
        status: "OK",
        message: "Thank you for your reservation!"
      });
    }
  });
});

///////////////////////////////////  LISTEN TO PORT
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
