var database = require("../database/config");

function listarLogs() {
    var comandoSQL = "SELECT id, dataHora, tipo, mensagem FROM logBD ORDER BY dataHora DESC";
    return database.executar(comandoSQL);
}

module.exports = {
    listarLogs
};
