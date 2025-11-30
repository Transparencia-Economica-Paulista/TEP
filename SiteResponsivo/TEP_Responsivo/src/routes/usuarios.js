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

// Rota para listar usuários por empresa
// GET /usuarios/listar/:idEmpresa
router.get("/listar/:idEmpresa", function (req, res) {
    console.log('Rota GET /usuarios/listar/:idEmpresa chamada');
    usuarioController.listar(req, res);
});

// Rota para deletar usuário
// DELETE /usuarios/deletar/:id
router.delete("/deletar/:id", function (req, res) {
    console.log('Rota DELETE /usuarios/deletar/:id chamada');
    usuarioController.deletar(req, res);
});

// Rota para atualizar cargo do usuário
// PUT /usuarios/atualizarCargo/:id
router.put("/atualizarCargo/:id", function (req, res) {
    console.log('Rota PUT /usuarios/atualizarCargo/:id chamada');
    usuarioController.atualizarCargo(req, res);
});

// Exporta as rotas para serem usadas no app principal
module.exports = router;