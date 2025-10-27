var dashboardModel = require("../models/dashboardModel");

function limparString(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str.replace(/'/g, "''").replace(/;/g, '').replace(/--/g, '').replace(/\/\*/g, '').replace(/\*\//g, '');
}

function validarNumeroInteiro(valor) {
  console.log('Validando valor:', valor, 'Tipo:', typeof valor);
  
  const numero = Number(valor);
  console.log('Valor convertido:', numero);
  
  const isValid = Number.isInteger(numero) && numero > 0;
  console.log('É válido?', isValid);
  
  return isValid;
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
    console.log("Erro ao buscar dados do dashboard:", erro);
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
    console.log("Erro ao buscar indicadores por ano:", erro);
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
    console.log("Erro ao buscar anos disponíveis:", erro);
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function buscarHistoricoCompleto(req, res) {
  var municipioId = req.params.municipioId;

  console.log('=== CONTROLLER HISTÓRICO COMPLETO ===');
  console.log('municipioId recebido:', municipioId, 'Tipo:', typeof municipioId);

  if (!municipioId) {
    console.log('Erro: ID do município não fornecido');
    return res.status(400).json({ message: "ID do município é obrigatório" });
  }

  if (!validarNumeroInteiro(municipioId)) {
    console.log('Erro: ID do município inválido:', municipioId);
    return res.status(400).json({ message: "ID do município inválido" });
  }

  console.log('Validação passou, chamando model...');
  dashboardModel.buscarHistoricoCompleto(municipioId).then((resultado) => {
    console.log('Resultado do histórico:', resultado.length, 'registros');
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao buscar histórico completo:", erro);
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
    console.log("Erro ao buscar dados consolidados:", erro);
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
    console.log("Erro ao buscar arrecadação por setor:", erro);
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function buscarCrescimentoAnual(req, res) {
  var municipioId = req.params.municipioId;

  console.log('municipioId recebido:', municipioId, 'Tipo:', typeof municipioId);

  if (!municipioId) {
    console.log('Erro: ID do município não fornecido');
    return res.status(400).json({ message: "ID do município é obrigatório" });
  }

  if (!validarNumeroInteiro(municipioId)) {
    console.log('Erro: ID do município inválido:', municipioId);
    return res.status(400).json({ message: "ID do município inválido" });
  }

  console.log('Validação passou, chamando model...');
  dashboardModel.buscarCrescimentoAnual(municipioId).then((resultado) => {
    console.log('Resultado do crescimento:', resultado);
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao buscar crescimento anual:", erro);
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