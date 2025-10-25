var mysql = require("mysql2");

var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

var mysql = require("mysql2");

var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

function executar(instrucao) {
    console.log("Configuração do banco:", {
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        port: process.env.DB_PORT
    });
    
    console.log("Executando SQL:", instrucao);

    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);
        
        conexao.connect(function(err) {
            if (err) {
                console.log("Erro ao conectar ao banco:", err);
                reject(err);
                return;
            }
            console.log("Conectado ao banco de dados!");
        });
        
        conexao.query(instrucao, function (erro, resultados) {
            conexao.end();
            if (erro) {
                console.log("Erro na query:", erro);
                reject(erro);
            } else {
                console.log("Resultados da query:", resultados);
                resolve(resultados);
            }
        });
        
        conexao.on('error', function (erro) {
            console.log("ERRO NO MySQL SERVER:", erro.sqlMessage);
            reject(erro);
        });
    });
}

module.exports = {
    executar
};