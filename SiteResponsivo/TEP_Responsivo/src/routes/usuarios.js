// Importa o Express para criar rotas
var express = require("express");
var router = express.Router();

// Importa o controller que tem as funções de usuário
var usuarioController = require("../controllers/usuarioController");

// Rota para cadastrar usuário
// POST /usuarios/cadastrar
router.post("/cadastrar", function (req, res) {
    console.log('Rota POST /usuarios/cadastrar chamada');
    usuarioController.cadastrar(req, res);
});

// Rota para fazer login
// POST /usuarios/autenticar
router.post("/autenticar", function (req, res) {
    console.log('Rota POST /usuarios/autenticar chamada');
    usuarioController.autenticar(req, res);
});

// Exporta as rotas para serem usadas no app principal
module.exports = router;