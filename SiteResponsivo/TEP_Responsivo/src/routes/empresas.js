var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");


router.post("/cadastrar", function (req, res) {
    empresaController.cadastrar(req, res);
})

router.get("/buscar", function (req, res) {
    empresaController.buscarPorCnpj(req, res);
});

router.get("/buscar/:id", function (req, res) {
  empresaController.buscarPorId(req, res);
});

router.get("/listar", function (req, res) {
  empresaController.listar(req, res);
});

router.get("/municipios", function (req, res) {
  empresaController.listarMunicipios(req, res);
});

router.get("/dashboard/:municipioId", function (req, res) {
  empresaController.buscarDadosDashboard(req, res);
});

router.get("/dashboard/:municipioId/indicadores/:ano", function (req, res) {
  empresaController.buscarIndicadoresPorAno(req, res);
});

router.get("/dashboard/:municipioId/anos", function (req, res) {
  empresaController.buscarAnosDisponiveis(req, res);
});

router.get("/dashboard/:municipioId/historico", function (req, res) {
  empresaController.buscarHistoricoCompleto(req, res);
});

module.exports = router;