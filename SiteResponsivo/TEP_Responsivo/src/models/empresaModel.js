var database = require("../database/config");

function buscarPorId(id) {
  var instrucaoSql = `SELECT * FROM Empresas WHERE idEmpresas = '${id}'`;
  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `
    SELECT e.idEmpresas as id, e.razao_social, e.cnpj, 
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
  
  var instrucaoSql = `
    INSERT INTO Empresas (razao_social, cnpj, email, senha, Municipios_idMunicipios)
    VALUES ('${razaoSocial}', '${cnpj}', '${email}', SHA2('${senha}', 256), ${municipioId})
  `;
  
  console.log("SQL para cadastro de empresa:", instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarDadosDashboard(municipioId) {
  var instrucaoSql = `
    SELECT 
      m.nome_municipio,
      r.sigla_regiao,
      COALESCE(mp.pib_per_capita, 0) as pib_per_capita,
      COALESCE(mp.pib, 0) as pib_total,
      COALESCE(mp.impostos, 0) as impostos,
      (SELECT s.nome_setor 
       FROM Indicadores i2 
       JOIN Setores s ON i2.Setores_idSetores = s.idSetores 
       WHERE i2.Municipios_idMunicipios = ${municipioId} 
       AND i2.ano = YEAR(CURDATE())
       GROUP BY s.nome_setor 
       ORDER BY SUM(i2.valor_adicionado) DESC 
       LIMIT 1) as setor_destaque,
      COALESCE(
        (SELECT SUM(i3.valor_adicionado) 
         FROM Indicadores i3 
         WHERE i3.Municipios_idMunicipios = ${municipioId} 
         AND i3.ano = YEAR(CURDATE())), 0
      ) as participacao_pib_total
    FROM Municipios m
    JOIN Regioes r ON m.Regioes_idRegioes = r.idRegioes
    LEFT JOIN Metricas_do_pib mp ON m.idMunicipios = mp.Municipios_idMunicipios 
      AND mp.ano = YEAR(CURDATE())
    WHERE m.idMunicipios = ${municipioId}
    LIMIT 1
  `;
  return database.executar(instrucaoSql);
}

function buscarIndicadoresPorAno(municipioId, ano) {
  var instrucaoSql = `
    SELECT 
      s.nome_setor,
      i.valor_adicionado,
      i.ano,
      mp.pib_per_capita,
      mp.impostos,
      mp.pib as pib_total
    FROM Indicadores i
    JOIN Setores s ON i.Setores_idSetores = s.idSetores
    LEFT JOIN Metricas_do_pib mp ON i.Municipios_idMunicipios = mp.Municipios_idMunicipios 
      AND i.ano = mp.ano
    WHERE i.Municipios_idMunicipios = ${municipioId} 
    AND i.ano = ${ano}
    ORDER BY i.valor_adicionado DESC
  `;
  return database.executar(instrucaoSql);
}

function buscarAnosDisponiveis(municipioId) {
  var instrucaoSql = `
    SELECT DISTINCT ano
    FROM Indicadores 
    WHERE Municipios_idMunicipios = ${municipioId}
    ORDER BY ano DESC
  `;
  return database.executar(instrucaoSql);
}

function buscarHistoricoCompleto(municipioId) {
  var instrucaoSql = `
    SELECT 
      i.ano,
      s.nome_setor,
      i.valor_adicionado,
      mp.pib_per_capita,
      mp.pib as pib_total,
      mp.impostos
    FROM Indicadores i
    JOIN Setores s ON i.Setores_idSetores = s.idSetores
    LEFT JOIN Metricas_do_pib mp ON i.Municipios_idMunicipios = mp.Municipios_idMunicipios 
      AND i.ano = mp.ano
    WHERE i.Municipios_idMunicipios = ${municipioId}
    ORDER BY i.ano DESC, i.valor_adicionado DESC
  `;
  return database.executar(instrucaoSql);
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
  buscarHistoricoCompleto
};