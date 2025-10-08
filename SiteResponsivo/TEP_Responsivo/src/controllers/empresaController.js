var empresaModel = require("../models/empresaModel");

function buscarPorCnpj(req, res) {
  var cnpj = req.query.cnpj;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao buscar por CNPJ:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao listar empresas:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function listarMunicipios(req, res) {
  empresaModel.listarMunicipios().then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao listar municípios:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function buscarPorId(req, res) {
  var id = req.params.id;

  empresaModel.buscarPorId(id).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao buscar por id:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function cadastrar(req, res) {
  var cnpj = req.body.cnpj;
  var nome = req.body.nome;
  var municipioId = req.body.municipio; // Deve ser o ID do município
  var email = req.body.email;
  var senha = req.body.senha;

  // Validações básicas
  if (!cnpj || !nome || !municipioId || !email || !senha) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
  }

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    if (resultado.length > 0) {
      res
        .status(401)
        .json({ mensagem: `A empresa com o CNPJ ${cnpj} já existe` });
    } else {
      empresaModel.cadastrar(nome, cnpj, email, senha, municipioId).then((resultado) => {
        // Retornar o insertId para o frontend usar como FK ao cadastrar o usuário
        res.status(201).json({ insertId: resultado.insertId, resultado });
      }).catch((erro) => {
        console.log("Erro ao cadastrar empresa:", erro);
        res.status(500).json({ mensagem: "Erro interno do servidor", erro: erro.sqlMessage });
      });
    }
  }).catch((erro) => {
    console.log("Erro ao buscar empresa por CNPJ:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrar,
  listar,
  listarMunicipios,
};
