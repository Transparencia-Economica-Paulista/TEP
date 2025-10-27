
var express = require("express");
var router = express.Router();
var dashboardController = require("../controllers/dashboardController");

router.get("/crescimento/:municipioId", dashboardController.buscarCrescimentoAnual);
router.get("/grafico/:municipioId", dashboardController.buscarHistoricoCompleto);
router.get("/setores/:municipioId/:ano", dashboardController.buscarArrecadacaoPorSetor);
router.get("/:municipioId/anos", dashboardController.buscarAnosDisponiveis);
router.get("/:municipioId/:ano", dashboardController.buscarDadosConsolidados);
router.get("/:municipioId", dashboardController.buscarDadosDashboard);

module.exports = router;
