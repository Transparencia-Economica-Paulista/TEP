var database = require("../database/config");

function buscarPorId(id) {
  var instrucaoSql = `SELECT * FROM Empresas WHERE idEmpresas = '${id}'`;
  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `
    SELECT e.idEmpresas as id, e.razao_social, e.cnpj, e.codigo_ativacao, 
           m.nome_municipio 
    FROM Empresas e 
    JOIN Municipios m ON e.Municipios_idMunicipios = m.idMunicipios
  `;
  return database.executar(instrucaoSql);
}

function listarMunicipios() {
  var instrucaoSql = `
    SELECT m.idMunicipios as id, m.nome_municipio, r.nome_regiao 
    FROM Municipios m 
    JOIN Regioes r ON m.Regioes_idRegioes = r.idRegioes
    ORDER BY m.nome_municipio
  `;
  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT * FROM Empresas WHERE cnpj = '${cnpj}'`;
  return database.executar(instrucaoSql);
}

function cadastrar(razaoSocial, cnpj, email, senha, municipioId) {
  console.log("EMPRESA MODEL - CADASTRO:", razaoSocial, cnpj, email, municipioId);
  
  var codigoAtivacao = 'TEP' + Date.now().toString().slice(-6);
  
  var instrucaoSql = `
    INSERT INTO Empresas (razao_social, cnpj, email, senha, codigo_ativacao, Municipios_idMunicipios)
    VALUES ('${razaoSocial}', '${cnpj}', '${email}', '${senha}', '${codigoAtivacao}', ${municipioId})
  `;
  
  console.log("SQL para cadastro de empresa:", instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = { 
  buscarPorCnpj, 
  buscarPorId, 
  cadastrar, 
  listar, 
  listarMunicipios 
};