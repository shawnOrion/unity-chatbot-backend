var express = require("express");
var router = express.Router();
const { createUser, getUser } = require("../controllers/user");

router.post("/user", createUser);

router.get("/user", getUser);

module.exports = router;
