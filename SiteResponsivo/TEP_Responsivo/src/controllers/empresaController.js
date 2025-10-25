var empresaModel = require("../models/empresaModel");

// Função para sanitizar strings e evitar SQL injection
function sanitizarString(str) {
  if (typeof str !== 'string') {
    return str;
  }
  
  // Remove caracteres perigosos para SQL
  return str.replace(/'/g, "''").replace(/;/g, '').replace(/--/g, '').replace(/\/\*/g, '').replace(/\*\//g, '');
}

// Função para validar se é um número inteiro positivo
function validarNumeroInteiro(valor) {
  var numero = Number(valor);
  return Number.isInteger(numero) && numero > 0;
}

function buscarPorCnpj(req, res) {
  var cnpj = req.query.cnpj;

  if (!cnpj) {
    return res.status(400).json({ message: "CNPJ é obrigatório" });
  }

  var cnpjSanitizado = sanitizarString(cnpj);

  empresaModel.buscarPorCnpj(cnpjSanitizado).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao buscar por CNPJ:", erro);
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao listar empresas:", erro);
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function listarMunicipios(req, res) {
  empresaModel.listarMunicipios().then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao listar municípios:", erro);
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

function buscarPorId(req, res) {
  var id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "ID é obrigatório" });
  }

  if (!validarNumeroInteiro(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  empresaModel.buscarPorId(id).then((resultado) => {
    if (resultado.length === 0) {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao buscar por id:", erro);
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
  });
}

// Função para validar CNPJ (versão simples sem regex)
function validarCNPJ(cnpj) {
  // Remove pontos, barras e traços
  var cnpjLimpo = '';
  for (var i = 0; i < cnpj.length; i++) {
    var char = cnpj[i];
    if (char >= '0' && char <= '9') {
      cnpjLimpo += char;
    }
  }
  
  // Verifica se tem exatamente 14 dígitos
  if (cnpjLimpo.length !== 14) {
    return false;
  }
  
  // Verifica se não são todos números iguais
  var todosIguais = true;
  for (var i = 1; i < cnpjLimpo.length; i++) {
    if (cnpjLimpo[i] !== cnpjLimpo[0]) {
      todosIguais = false;
      break;
    }
  }
  
  return !todosIguais;
}

// Função para validar email (versão simples)
function validarEmail(email) {
  var temArroba = false;
  var temPonto = false;
  var posicaoArroba = -1;
  
  for (var i = 0; i < email.length; i++) {
    if (email[i] === '@') {
      if (temArroba) return false; // Mais de um @
      temArroba = true;
      posicaoArroba = i;
    }
    if (email[i] === '.' && posicaoArroba > -1 && i > posicaoArroba) {
      temPonto = true;
    }
  }
  
  return temArroba && temPonto && posicaoArroba > 0 && posicaoArroba < email.length - 1;
}

// Função para validar senha (versão simples)
function validarSenha(senha) {
  // Verifica se tem pelo menos 8 caracteres
  if (senha.length < 8) {
    return { valida: false, erro: "Senha deve ter pelo menos 8 caracteres" };
  }
  
  // Verifica se tem pelo menos uma letra minúscula
  var temMinuscula = false;
  for (var i = 0; i < senha.length; i++) {
    if (senha[i] >= 'a' && senha[i] <= 'z') {
      temMinuscula = true;
      break;
    }
  }
  if (!temMinuscula) {
    return { valida: false, erro: "Senha deve conter pelo menos uma letra minúscula" };
  }
  
  // Verifica se tem pelo menos uma letra maiúscula
  var temMaiuscula = false;
  for (var i = 0; i < senha.length; i++) {
    if (senha[i] >= 'A' && senha[i] <= 'Z') {
      temMaiuscula = true;
      break;
    }
  }
  if (!temMaiuscula) {
    return { valida: false, erro: "Senha deve conter pelo menos uma letra maiúscula" };
  }
  
  // Verifica se tem pelo menos um número
  var temNumero = false;
  for (var i = 0; i < senha.length; i++) {
    if (senha[i] >= '0' && senha[i] <= '9') {
      temNumero = true;
      break;
    }
  }
  if (!temNumero) {
    return { valida: false, erro: "Senha deve conter pelo menos um número" };
  }
  
  // Verifica se tem pelo menos um caractere especial
  var caracteresEspeciais = '@$!%*?&';
  var temEspecial = false;
  for (var i = 0; i < senha.length; i++) {
    for (var j = 0; j < caracteresEspeciais.length; j++) {
      if (senha[i] === caracteresEspeciais[j]) {
        temEspecial = true;
        break;
      }
    }
    if (temEspecial) {
      break;
    }
  }
  
  if (!temEspecial) {
    return { valida: false, erro: "Senha deve conter pelo menos um caractere especial (@$!%*?&)" };
  }
  
  return { valida: true };
}

function cadastrar(req, res) {
  var cnpj = req.body.cnpj;
  var nome = req.body.nome;
  var municipioId = req.body.municipio;
  var email = req.body.email;
  var senha = req.body.senha;

  console.log('Dados recebidos para cadastro:', { nome, cnpj, municipioId, email });

  // Validações básicas de campos obrigatórios
  if (!nome || nome.trim() === '') {
    return res.status(400).json({ message: "Razão social é obrigatória" });
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: "Email é obrigatório" });
  }

  if (!cnpj || cnpj.trim() === '') {
    return res.status(400).json({ message: "CNPJ é obrigatório" });
  }

  if (!senha || senha.trim() === '') {
    return res.status(400).json({ message: "Senha é obrigatória" });
  }

  if (!municipioId) {
    return res.status(400).json({ message: "Município é obrigatório" });
  }

  // Validação do email
  if (!validarEmail(email.trim())) {
    return res.status(400).json({ message: "Email inválido" });
  }

  // Validação do CNPJ
  if (!validarCNPJ(cnpj)) {
    return res.status(400).json({ message: "CNPJ inválido. Deve conter exatamente 14 dígitos" });
  }

  // Validação da senha
  var resultadoSenha = validarSenha(senha);
  if (!resultadoSenha.valida) {
    return res.status(400).json({ message: resultadoSenha.erro });
  }

  // Limpar o CNPJ (remover formatação)
  var cnpjLimpo = '';
  for (var i = 0; i < cnpj.length; i++) {
    var char = cnpj[i];
    if (char >= '0' && char <= '9') {
      cnpjLimpo += char;
    }
  }

  // Sanitizar os dados antes de usar nas queries
  var nomeSanitizado = sanitizarString(nome.trim());
  var emailSanitizado = sanitizarString(email.trim());
  var cnpjSanitizado = sanitizarString(cnpjLimpo);

  // Validar municipioId
  if (!validarNumeroInteiro(municipioId)) {
    return res.status(400).json({ message: 'ID do município inválido' });
  }

  // Verificar se CNPJ já existe
  empresaModel.buscarPorCnpj(cnpjSanitizado).then((resultado) => {
    if (resultado.length > 0) {
      res.status(409).json({ 
        message: `Empresa com CNPJ ${cnpj} já está cadastrada` 
      });
    } else {
      // Cadastrar a empresa
      empresaModel.cadastrar(nomeSanitizado, cnpjSanitizado, emailSanitizado, senha, municipioId)
        .then((resultado) => {
          console.log('Empresa cadastrada com sucesso:', resultado.insertId);
          res.status(201).json({ 
            message: "Empresa cadastrada com sucesso!",
            id: resultado.insertId 
          });
        })
        .catch((erro) => {
          console.log("Erro ao cadastrar empresa:", erro);
          res.status(500).json({ 
            message: "Erro interno do servidor ao cadastrar empresa",
            erro: erro.sqlMessage 
          });
        });
    }
  }).catch((erro) => {
    console.log("Erro ao verificar CNPJ:", erro);
    res.status(500).json({ 
      message: "Erro interno do servidor ao verificar CNPJ",
      erro: erro.sqlMessage 
    });
  });
}

function buscarDadosDashboard(req, res) {
  var municipioId = req.params.municipioId;

  if (!municipioId) {
    return res.status(400).json({ message: "ID do município é obrigatório" });
  }

  if (!validarNumeroInteiro(municipioId)) {
    return res.status(400).json({ message: "ID do município inválido" });
  }

  empresaModel.buscarDadosDashboard(municipioId).then((resultado) => {
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

  empresaModel.buscarIndicadoresPorAno(municipioId, ano).then((resultado) => {
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

  empresaModel.buscarAnosDisponiveis(municipioId).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao buscar anos disponíveis:", erro);
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

  empresaModel.buscarHistoricoCompleto(municipioId).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("Erro ao buscar histórico completo:", erro);
    res.status(500).json({ message: "Erro interno do servidor", erro: erro.sqlMessage });
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
