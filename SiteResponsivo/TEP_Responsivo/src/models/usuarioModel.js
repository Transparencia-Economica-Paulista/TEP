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
    var emailSeguro = protegerTexto(email);
    var senhaSegura = protegerTexto(senha);
    
    var comandoSQL = "";
    comandoSQL = comandoSQL + "SELECT u.idUser as id, u.nome, u.email, c.Empresas_idEmpresas as fkEmpresa, ";
    comandoSQL = comandoSQL + "e.razao_social, e.cnpj, c.adm ";
    comandoSQL = comandoSQL + "FROM User u ";
    comandoSQL = comandoSQL + "JOIN Cargo c ON u.Cargo_idCargo = c.idCargo ";
    comandoSQL = comandoSQL + "JOIN Empresas e ON c.Empresas_idEmpresas = e.idEmpresas ";
    comandoSQL = comandoSQL + "WHERE u.email = '" + emailSeguro + "' AND u.senha = SHA2('" + senhaSegura + "', 256)";

    return database.executar(comandoSQL);
}

function cadastrar(nome, email, senha, idEmpresa, ehAdministrador) {
    if (ehAdministrador == undefined) {
        ehAdministrador = 0;
    }

    var nomeSeguro = protegerTexto(nome);
    var emailSeguro = protegerTexto(email);
    var senhaSegura = protegerTexto(senha);

    var comandoSQLCargo = "INSERT INTO Cargo (adm, descricao, Empresas_idEmpresas) ";
    if(ehAdministrador == 1){
         comandoSQLCargo += "VALUES (" + ehAdministrador + ", 'Administrador', " + idEmpresa + ")";
    }else{
    comandoSQLCargo += "VALUES (" + ehAdministrador + ", 'Usuário do sistema', " + idEmpresa + ")";
}
    return database.executar(comandoSQLCargo).then(function(resultadoCargo) {
        var idCargo = resultadoCargo.insertId;
        
        var comandoSQLUser = "INSERT INTO User (nome, email, senha, Cargo_idCargo) ";
        comandoSQLUser += "VALUES ('" + nomeSeguro + "', '" + emailSeguro + "', SHA2('" + senhaSegura + "', 256), " + idCargo + ")";
        
        return database.executar(comandoSQLUser);
    });
}

function listarPorEmpresa(idEmpresa) {
    var comandoSQL = "";
    comandoSQL = comandoSQL + "SELECT u.idUser as id, u.nome, u.email, c.adm, c.Empresas_idEmpresas as fkEmpresa ";
    comandoSQL = comandoSQL + "FROM User u ";
    comandoSQL = comandoSQL + "JOIN Cargo c ON u.Cargo_idCargo = c.idCargo ";
    comandoSQL = comandoSQL + "WHERE c.Empresas_idEmpresas = " + idEmpresa;
    comandoSQL = comandoSQL + " ORDER BY c.adm DESC, u.nome ASC";

    return database.executar(comandoSQL);
}

function deletar(idUsuario) {
    var comandoSQL = "";
    comandoSQL = comandoSQL + "DELETE FROM User WHERE idUser = " + idUsuario;
    
    return database.executar(comandoSQL);
}

function atualizarCargo(idUsuario, ehAdministrador) {
    var comandoSQL = "";
    comandoSQL = comandoSQL + "UPDATE Cargo c ";
    comandoSQL = comandoSQL + "JOIN User u ON u.Cargo_idCargo = c.idCargo ";
    comandoSQL = comandoSQL + "SET c.adm = " + ehAdministrador + ", ";
    comandoSQL = comandoSQL + "c.descricao = '" + (ehAdministrador == 1 ? "Administrador" : "Usuário do sistema") + "' ";
    comandoSQL = comandoSQL + "WHERE u.idUser = " + idUsuario;
    
    return database.executar(comandoSQL);
}

module.exports = {
    autenticar,
    cadastrar,
    listarPorEmpresa,
    deletar,
    atualizarCargo
};
