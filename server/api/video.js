const express = require("express");
const { Router, Request, Response } = express;

// const express = require("express");
// import { Router, Request, Response } from "express";
// const bodyParser = require("body-parser");
// const fileUpload = require("express-fileupload");
// const path = require("path");
const router = Router();

router.get("/", (req, res) => {
  res.send("video");
});

router.get("/:id", (req, res) => {
  res.send(`video ${req.params.id}`);
});

module.exports = router;
