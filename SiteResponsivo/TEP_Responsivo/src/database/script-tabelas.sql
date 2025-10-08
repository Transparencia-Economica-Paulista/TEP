CREATE DATABASE IF NOT EXISTS TEP;
USE TEP;

CREATE TABLE Regioes (
    idRegioes INT AUTO_INCREMENT PRIMARY KEY,
    nome_regiao VARCHAR(45) NOT NULL,
    sigla_regiao CHAR(2) NOT NULL
);

CREATE TABLE Municipios (
    idMunicipios INT AUTO_INCREMENT PRIMARY KEY,
    nome_municipio VARCHAR(100) NOT NULL,
    Regioes_idRegioes INT NOT NULL,
    FOREIGN KEY (Regioes_idRegioes) REFERENCES Regioes(idRegioes)
);

CREATE TABLE Setores (
    idSetores INT AUTO_INCREMENT PRIMARY KEY,
    nome_setor VARCHAR(60) NOT NULL
);

CREATE TABLE Empresas (
    idEmpresas INT AUTO_INCREMENT PRIMARY KEY,
    razao_social VARCHAR(100) NOT NULL,
    cnpj CHAR(14) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    codigo_ativacao VARCHAR(20),
    Municipios_idMunicipios INT NOT NULL,
    FOREIGN KEY (Municipios_idMunicipios) REFERENCES Municipios(idMunicipios)
);

CREATE TABLE User (
    idUser INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Empresas_idEmpresas INT,
    User_idAdm INT,
    ADM TINYINT(1) DEFAULT 0, -- 0 = comum, 1 = administrador
    FOREIGN KEY (Empresas_idEmpresas) REFERENCES Empresas(idEmpresas),
    FOREIGN KEY (User_idAdm) REFERENCES User(idUser)
);

CREATE TABLE Indicadores (
    idIndicadores INT AUTO_INCREMENT PRIMARY KEY,
    ano YEAR NOT NULL,
    valor_adicionado DECIMAL(18,2) NOT NULL,
    pib_per_capita DECIMAL(12,2) NOT NULL,
    participacao DECIMAL(10,5) NOT NULL,
    Setores_idSetores INT NOT NULL,
    Municipios_idMunicipios INT NOT NULL,
    FOREIGN KEY (Setores_idSetores) REFERENCES Setores(idSetores),
    FOREIGN KEY (Municipios_idMunicipios) REFERENCES Municipios(idMunicipios)
);

select * from empresas;
select * from user;
SHOW TABLES;

-- DADOS INICIAIS PARA TESTE
INSERT INTO Regioes (nome_regiao, sigla_regiao) VALUES 
('Sudeste', 'SE'),
('Sul', 'S'),
('Centro-Oeste', 'CO'),
('Norte', 'N'),
('Nordeste', 'NE');

INSERT INTO Municipios (nome_municipio, Regioes_idRegioes) VALUES 
('São Paulo', 1),
('Rio de Janeiro', 1),
('Belo Horizonte', 1),
('Porto Alegre', 2),
('Curitiba', 2),
('Brasília', 3),
('Goiânia', 3),
('Manaus', 4),
('Belém', 4),
('Salvador', 5),
('Recife', 5),
('Fortaleza', 5);

INSERT INTO Setores (nome_setor) VALUES 
('Agropecuária'),
('Indústria'),
('Serviços'),
('Administração Pública');

-- TABELA PARA TESTAR SE TA INDO
