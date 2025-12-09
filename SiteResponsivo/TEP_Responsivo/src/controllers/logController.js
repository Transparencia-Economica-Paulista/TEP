var logModel = require("../models/logModel");

function listarLogs(req, res) {
    logModel.listarLogs()
        .then(function(resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(200).json([]);
            }
        })
        .catch(function(erro) {
            console.log("Erro ao buscar logs:", erro);
            res.status(500).json({ mensagem: "Erro ao buscar logs" });
        });
}

module.exports = {
    listarLogs
};
