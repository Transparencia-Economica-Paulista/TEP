var dashboardModel = require("../models/dashboardModel");

function limparString(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str.replace(/'/g, "''").replace(/;/g, '').replace(/--/g, '').replace(/\/\*/g, '').replace(/\*\//g, '');
}

function validarNumeroInteiro(valor) {
  const numero = Number(valor);
  
  const ehValido = Number.isInteger(numero) && numero > 0;
  
  return ehValido;
}

function buscarDadosDashboard(req, res) {
  var municipioId = req.params.municipioId;

  if (!municipioId) {
    return res.status(400).json({ message: "ID do município é obrigatório" });
  }

  if (!validarNumeroInteiro(municipioId)) {
    return res.status(400).json({ message: "ID do município inválido" });
  }

  dashboardModel.buscarDadosDashboard(municipioId).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function buscarIndicadoresPorAno(req, res) {
  var municipioId = req.params.municipioId;
  var ano = req.params.ano;

  if (!municipioId || !ano) {
    return res.status(400).json({ message: "ID do município e ano são obrigatórios" });
  }

  if (!validarNumeroInteiro(municipioId) || !validarNumeroInteiro(ano)) {
    return res.status(400).json({ message: "ID do município e ano devem ser números válidos" });
  }

  dashboardModel.buscarIndicadoresPorAno(municipioId, ano).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function buscarAnosDisponiveis(req, res) {
  var municipioId = req.params.municipioId;

  if (!municipioId) {
    return res.status(400).json({ message: "ID do município é obrigatório" });
  }

  if (!validarNumeroInteiro(municipioId)) {
    return res.status(400).json({ message: "ID do município inválido" });
  }

  dashboardModel.buscarAnosDisponiveis(municipioId).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function buscarHistoricoCompleto(req, res) {
  var municipioId = req.params.municipioId;

  if (!municipioId) {
    return res.status(400).json({ message: "ID do município é obrigatório" });
  }

  if (!validarNumeroInteiro(municipioId)) {
    return res.status(400).json({ message: "ID do município inválido" });
  }

  dashboardModel.buscarHistoricoCompleto(municipioId).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}
function buscarDadosConsolidados(req, res) {
  var municipioId = req.params.municipioId;
  var ano = req.params.ano;

  if (!municipioId || !ano) {
    return res.status(400).json({ message: "ID do município e ano são obrigatórios" });
  }

  if (!validarNumeroInteiro(municipioId) || !validarNumeroInteiro(ano)) {
    return res.status(400).json({ message: "ID do município e ano devem ser números válidos" });
  }

  dashboardModel.buscarDadosConsolidados(municipioId, ano).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function buscarArrecadacaoPorSetor(req, res) {
  var municipioId = req.params.municipioId;
  var ano = req.params.ano;

  if (!municipioId || !ano) {
    return res.status(400).json({ message: "ID do município e ano são obrigatórios" });
  }

  if (!validarNumeroInteiro(municipioId) || !validarNumeroInteiro(ano)) {
    return res.status(400).json({ message: "ID do município e ano devem ser números válidos" });
  }

  dashboardModel.buscarArrecadacaoPorSetor(municipioId, ano).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function buscarCrescimentoAnual(req, res) {
  var municipioId = req.params.municipioId;

  if (!municipioId) {
    return res.status(400).json({ message: "ID do município é obrigatório" });
  }

  if (!validarNumeroInteiro(municipioId)) {
    return res.status(400).json({ message: "ID do município inválido" });
  }

  dashboardModel.buscarCrescimentoAnual(municipioId).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}


module.exports = {
  buscarDadosDashboard,
  buscarIndicadoresPorAno,
  buscarAnosDisponiveis,
  buscarHistoricoCompleto,
  buscarDadosConsolidados,
  buscarArrecadacaoPorSetor,
  buscarCrescimentoAnual,
};