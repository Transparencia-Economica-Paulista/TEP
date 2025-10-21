// Script para testar o fluxo completo de cadastro
const mysql = require('mysql2');
require('dotenv').config({ path: '.env.dev' });

const config = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
};

console.log('Testando fluxo completo...');

const conexao = mysql.createConnection(config);

conexao.connect((err) => {
  if (err) {
    console.log('Erro ao conectar:', err.message);
    process.exit(1);
  }
  console.log('Conectado ao banco!');

  // Limpar dados anteriores
  conexao.query('DELETE FROM User', (err) => {
    if (err) console.log('Erro ao limpar User:', err.message);
    
    conexao.query('DELETE FROM Empresas', (err) => {
      if (err) console.log('Erro ao limpar Empresas:', err.message);
      
      // Inserir empresa de teste
      const empresaSQL = `
        INSERT INTO Empresas (razao_social, cnpj, email, senha, codigo_ativacao, Municipios_idMunicipios)
        VALUES ('Empresa Teste LTDA', '12345678901234', 'teste@empresa.com', 'senha123', 'TEP123456', 1)
      `;
      
      conexao.query(empresaSQL, (err, resultado) => {
        if (err) {
          console.log('Erro ao inserir empresa:', err.message);
          conexao.end();
          return;
        }
        
        console.log('Empresa inserida com ID:', resultado.insertId);
        
        // Inserir usuário de teste
        const usuarioSQL = `
          INSERT INTO User (nome, email, senha, Empresas_idEmpresas, ADM)
          VALUES ('Admin Teste', 'admin@teste.com', 'senha123', ${resultado.insertId}, 1)
        `;
        
        conexao.query(usuarioSQL, (err, resultadoUser) => {
          if (err) {
            console.log('Erro ao inserir usuário:', err.message);
          } else {
            console.log('Usuário inserido com ID:', resultadoUser.insertId);
            console.log('Teste completo! Agora você pode fazer login com:');
            console.log('Email: admin@teste.com');
            console.log('Senha: senha123');
          }
          
          conexao.end();
        });
      });
    });
  });
});