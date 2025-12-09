var express = require("express");
var router = express.Router();

var logController = require("../controllers/logController");

router.get("/listar", function (req, res) {
    logController.listarLogs(req, res);
});

module.exports = router;
