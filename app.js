const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const postgres = require("./services/postgres");

const port = 3001;

var corsOptions = {
  origin: "http://localhost:8080",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

const apiRouter = require("./routes/api.js");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", cors(corsOptions), apiRouter);

postgres.setupTable();

app.listen(port, () => {
  console.log(`
App runs on port ${port}
You can test at http://localhost:${port}`);
});
