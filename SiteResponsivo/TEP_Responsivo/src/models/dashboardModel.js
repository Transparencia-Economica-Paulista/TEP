var database = require("../database/config");

function buscarDadosDashboard(municipioId) {
  var instrucaoSql = `
    SELECT 
      m.nome_municipio,
      r.sigla_regiao,
      COALESCE(mp.pib_per_capita, 0) AS pib_per_capita,
      COALESCE(mp.pib, 0) AS pib_total,
      COALESCE(mp.impostos, 0) AS impostos,
      (
        SELECT s.nome_setor
        FROM Indicadores i2
        JOIN Setores s ON i2.Setores_idSetores = s.idSetores
        WHERE i2.Municipios_idMunicipios = ${municipioId}
          AND i2.ano = (SELECT MAX(ano) FROM Indicadores WHERE Municipios_idMunicipios = ${municipioId})
        GROUP BY s.nome_setor
        ORDER BY SUM(i2.valor_adicionado) DESC
        LIMIT 1
      ) AS setor_destaque,
      COALESCE((
        SELECT SUM(i3.valor_adicionado)
        FROM Indicadores i3
        WHERE i3.Municipios_idMunicipios = ${municipioId}
          AND i3.ano = (SELECT MAX(ano) FROM Indicadores WHERE Municipios_idMunicipios = ${municipioId})
      ), 0) AS participacao_pib_total
    FROM Municipios m
    JOIN Regioes r ON m.Regioes_idRegioes = r.idRegioes
    LEFT JOIN Metricas_do_pib mp ON m.idMunicipios = mp.Municipios_idMunicipios
      AND mp.ano = (SELECT MAX(ano) FROM Metricas_do_pib WHERE Municipios_idMunicipios = ${municipioId})
    WHERE m.idMunicipios = ${municipioId}
    LIMIT 1;
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
      mp.pib AS pib_total
    FROM Indicadores i
    JOIN Setores s ON i.Setores_idSetores = s.idSetores
    LEFT JOIN Metricas_do_pib mp 
      ON i.Municipios_idMunicipios = mp.Municipios_idMunicipios 
      AND i.ano = mp.ano
    WHERE i.Municipios_idMunicipios = ${municipioId}
      AND i.ano = ${ano}
    ORDER BY i.valor_adicionado DESC;
  `;
  return database.executar(instrucaoSql);
}


function buscarAnosDisponiveis(municipioId) {
  var instrucaoSql = `
    SELECT DISTINCT ano
    FROM Indicadores
    WHERE Municipios_idMunicipios = ${municipioId}
    ORDER BY ano DESC;
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
      mp.pib AS pib_total,
      mp.impostos
    FROM Indicadores i
    JOIN Setores s ON i.Setores_idSetores = s.idSetores
    LEFT JOIN Metricas_do_pib mp 
      ON i.Municipios_idMunicipios = mp.Municipios_idMunicipios 
      AND i.ano = mp.ano
    WHERE i.Municipios_idMunicipios = ${municipioId}
    ORDER BY i.ano DESC, i.valor_adicionado DESC;
  `;
  return database.executar(instrucaoSql);
}

function buscarDadosConsolidados(municipioId, ano) {
  var instrucaoSql = `
    SELECT 
      m.nome_municipio,
      r.sigla_regiao,
      COALESCE(mp.pib_per_capita, 0) AS pib_per_capita,
      COALESCE(mp.pib, 0) AS pib_total,
      COALESCE(mp.impostos, 0) AS impostos,
      (
        SELECT s.nome_setor
        FROM Indicadores i2
        JOIN Setores s ON i2.Setores_idSetores = s.idSetores
        WHERE i2.Municipios_idMunicipios = ${municipioId}
          AND i2.ano = ${ano}
        GROUP BY s.nome_setor
        ORDER BY SUM(i2.valor_adicionado) DESC
        LIMIT 1
      ) AS setor_destaque,
      COALESCE((
        SELECT SUM(i3.valor_adicionado)
        FROM Indicadores i3
        WHERE i3.Municipios_idMunicipios = ${municipioId}
          AND i3.ano = ${ano}
      ), 0) AS participacao_pib_total,
      (
        SELECT COALESCE(SUM(i4.valor_adicionado), 0)
        FROM Indicadores i4
        JOIN Setores s4 ON i4.Setores_idSetores = s4.idSetores
        WHERE i4.Municipios_idMunicipios = ${municipioId}
          AND i4.ano = ${ano}
          AND s4.nome_setor = (
            SELECT s5.nome_setor
            FROM Indicadores i5
            JOIN Setores s5 ON i5.Setores_idSetores = s5.idSetores
            WHERE i5.Municipios_idMunicipios = ${municipioId}
              AND i5.ano = ${ano}
            GROUP BY s5.nome_setor
            ORDER BY SUM(i5.valor_adicionado) DESC
            LIMIT 1
          )
      ) AS valor_setor_destaque
    FROM Municipios m
    JOIN Regioes r ON m.Regioes_idRegioes = r.idRegioes
    LEFT JOIN Metricas_do_pib mp 
      ON m.idMunicipios = mp.Municipios_idMunicipios
      AND mp.ano = ${ano}
    WHERE m.idMunicipios = ${municipioId}
    LIMIT 1;
  `;
  return database.executar(instrucaoSql);
}

function buscarArrecadacaoPorSetor(municipioId, ano) {
  var instrucaoSql = `
    SELECT 
      s.nome_setor,
      COALESCE(SUM(i.valor_adicionado), 0) AS valor_total,
      COUNT(i.idIndicadores) AS quantidade_indicadores,
      (COALESCE(SUM(i.valor_adicionado), 0) * 100.0 /
       NULLIF((
         SELECT SUM(i2.valor_adicionado)
         FROM Indicadores i2
         WHERE i2.Municipios_idMunicipios = ${municipioId}
           AND i2.ano = ${ano}
       ), 0)
      ) AS percentual_participacao
    FROM Setores s
    LEFT JOIN Indicadores i 
      ON s.idSetores = i.Setores_idSetores
      AND i.Municipios_idMunicipios = ${municipioId}
      AND i.ano = ${ano}
    GROUP BY s.idSetores, s.nome_setor
    HAVING valor_total > 0
    ORDER BY valor_total DESC;
  `;
  return database.executar(instrucaoSql);
}

function buscarCrescimentoAnual(municipioId) {
  var instrucaoSql = `
    SELECT 
      ano_atual.ano,
      ano_atual.pib_per_capita AS pib_atual,
      COALESCE(ano_anterior.pib_per_capita, 0) AS pib_anterior,
      CASE 
        WHEN ano_anterior.pib_per_capita IS NOT NULL 
          AND ano_anterior.pib_per_capita > 0 THEN
          ROUND(((ano_atual.pib_per_capita - ano_anterior.pib_per_capita) / ano_anterior.pib_per_capita) * 100, 2)
        ELSE NULL
      END AS crescimento_percentual,
      CASE 
        WHEN ano_anterior.pib_per_capita IS NOT NULL THEN
          (ano_atual.pib_per_capita - ano_anterior.pib_per_capita)
        ELSE NULL
      END AS crescimento_absoluto
    FROM Metricas_do_pib ano_atual
    LEFT JOIN Metricas_do_pib ano_anterior
      ON ano_atual.Municipios_idMunicipios = ano_anterior.Municipios_idMunicipios
      AND ano_anterior.ano = ano_atual.ano - 1
    WHERE ano_atual.Municipios_idMunicipios = ${municipioId}
      AND ano_atual.pib_per_capita IS NOT NULL
    ORDER BY ano_atual.ano DESC
    LIMIT 10;
  `;
  return database.executar(instrucaoSql);
}

module.exports = {
  buscarDadosDashboard,
  buscarIndicadoresPorAno,
  buscarAnosDisponiveis,
  buscarHistoricoCompleto,
  buscarDadosConsolidados,
  buscarArrecadacaoPorSetor,
  buscarCrescimentoAnual
};
