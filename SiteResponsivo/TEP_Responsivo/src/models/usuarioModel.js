var database = require("../database/config");

function autenticar(email, senha) {
    console.log("USUARIO MODEL - LOGIN: ", email);
    var instrucaoSql = `
        SELECT u.idUser as id, u.nome, u.email, u.Empresas_idEmpresas as fkEmpresa, 
               e.razao_social, e.cnpj
        FROM User u
        JOIN Empresas e ON u.Empresas_idEmpresas = e.idEmpresas
        WHERE u.email = '${email}' AND u.senha = SHA2('${senha}', 256)
    `;
    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, senha, fkEmpresa, adm = 0) {
    console.log("USUARIO MODEL - CADASTRO: ", nome, email, fkEmpresa, adm);
    
    var instrucaoSql = `
        INSERT INTO User (nome, email, senha, Empresas_idEmpresas, ADM)
        VALUES ('${nome}', '${email}', SHA2('${senha}', 256), ${fkEmpresa}, ${adm})
    `;
    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar
};
