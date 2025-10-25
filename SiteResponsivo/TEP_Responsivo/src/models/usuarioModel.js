var database = require("../database/config");


function protegerTexto(texto) {
    if (texto == undefined || texto == null) {
        return '';
    }
    

    var textoSeguro = String(texto);
    var resultado = '';
    
    for (var i = 0; i < textoSeguro.length; i++) {
        if (textoSeguro[i] === "'") {
            resultado = resultado + "''";
        } else {
            resultado = resultado + textoSeguro[i];
        }
    }
    
    return resultado;
}

function autenticar(email, senha) {
    console.log("MODEL USUÁRIO - Verificando login para:", email);
    
  
    var emailSeguro = protegerTexto(email);
    var senhaSegura = protegerTexto(senha);
    

    var comandoSQL = "";
    comandoSQL = comandoSQL + "SELECT u.idUser as id, u.nome, u.email, u.Empresas_idEmpresas as fkEmpresa, ";
    comandoSQL = comandoSQL + "e.razao_social, e.cnpj ";
    comandoSQL = comandoSQL + "FROM User u ";
    comandoSQL = comandoSQL + "JOIN Empresas e ON u.Empresas_idEmpresas = e.idEmpresas ";
    comandoSQL = comandoSQL + "WHERE u.email = '" + emailSeguro + "' AND u.senha = SHA2('" + senhaSegura + "', 256)";

    console.log("Executando comando SQL:");
    console.log(comandoSQL);
    
  
    return database.executar(comandoSQL);
}

function cadastrar(nome, email, senha, idEmpresa, ehAdministrador) {

    if (ehAdministrador == undefined) {
        ehAdministrador = 0;
    }
    
    console.log("MODEL USUÁRIO - Cadastrando:", nome, email, idEmpresa, ehAdministrador);

   
    var nomeSeguro = protegerTexto(nome);
    var emailSeguro = protegerTexto(email);
    var senhaSegura = protegerTexto(senha);

    
    var comandoSQL = "";
    comandoSQL = comandoSQL + "INSERT INTO User (nome, email, senha, Empresas_idEmpresas, ADM) ";
    comandoSQL = comandoSQL + "VALUES ('" + nomeSeguro + "', '" + emailSeguro + "', SHA2('" + senhaSegura + "', 256), " + idEmpresa + ", " + ehAdministrador + ")";

    console.log("Executando comando SQL:");
    console.log(comandoSQL);
    
   
    return database.executar(comandoSQL);
}

module.exports = {
    autenticar,
    cadastrar
};
