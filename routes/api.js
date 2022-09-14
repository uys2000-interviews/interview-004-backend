const express = require("express");
const router = express.Router();
const postgres = require("../services/postgres");

router.post("/login", (req, res) => {
  //if authentication fails return with 400 status code
  postgres.checkUser(req.body.username, req.body.password).then((re) => {
    const [status, response] = re[0] ? [200, re[1]] : [400, null];
    res.status(status).json({
      body: response,
    });
  });
});

router.get("/data", (req, res) => {
  postgres.getData().then((re) => {
    const [status, response] = re[0]
      ? [200, re[1]]
      : [503, "Database Not Responsed, Probably I am forgot to start service"];
    res.status(status).json({
      body: response,
    });
  });
});

router.post("/data", (req, res) => {
  postgres.addData(req.body).then((re) => {
    const status = re ? 200 : 406;
    res.status(status).json({
      body: re,
    });
  });
});

router.delete("/data/:index", (req, res) => {
  postgres.removeData(req.params.index).then((re) => {
    const status = re ? 200 : 406;
    res.status(status).json({
      body: re,
    });
  });
});

module.exports = router;
