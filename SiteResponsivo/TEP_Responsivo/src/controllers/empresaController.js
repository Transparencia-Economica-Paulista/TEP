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

  console.log('Recebendo cadastro de empresa:', { nome, cnpj, municipioId, email });

  // Garantir que o municipioId seja um número inteiro válido
  municipioId = Number(municipioId);
  if (!Number.isInteger(municipioId) || municipioId <= 0) {
    return res.status(400).json({ mensagem: 'ID do município inválido' });
  }

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    if (resultado.length > 0) {
      res
        .status(409)
        .send(`A empresa com o CNPJ ${cnpj} já existe`);
    } else {
      empresaModel.cadastrar(nome, cnpj, email, senha, municipioId).then((resultado) => {
      
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

function buscarDadosDashboard(req, res) {
  var municipioId = req.params.municipioId;

  empresaModel.buscarDadosDashboard(municipioId).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao buscar dados do dashboard:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function buscarIndicadoresPorAno(req, res) {
  var municipioId = req.params.municipioId;
  var ano = req.params.ano;

  empresaModel.buscarIndicadoresPorAno(municipioId, ano).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao buscar indicadores por ano:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function buscarAnosDisponiveis(req, res) {
  var municipioId = req.params.municipioId;

  empresaModel.buscarAnosDisponiveis(municipioId).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao buscar anos disponíveis:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function buscarHistoricoCompleto(req, res) {
  var municipioId = req.params.municipioId;

  empresaModel.buscarHistoricoCompleto(municipioId).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao buscar histórico completo:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrar,
  listar,
  listarMunicipios,
  buscarDadosDashboard,
  buscarIndicadoresPorAno,
  buscarAnosDisponiveis,
  buscarHistoricoCompleto,
};
