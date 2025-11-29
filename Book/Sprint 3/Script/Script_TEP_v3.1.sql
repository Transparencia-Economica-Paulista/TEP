CREATE DATABASE IF NOT EXISTS TEP;
USE TEP;


CREATE TABLE Regioes (
    idRegioes INT AUTO_INCREMENT PRIMARY KEY,
    nome_regiao VARCHAR(45) UNIQUE,
    sigla_regiao CHAR(4) NOT NULL
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
    senha VARCHAR(100) NOT NULL,
    Municipios_idMunicipios INT NOT NULL,
    FOREIGN KEY (Municipios_idMunicipios) REFERENCES Municipios(idMunicipios)
);

CREATE TABLE Cargo (
    idCargo INT AUTO_INCREMENT PRIMARY KEY,
    adm TINYINT(1) DEFAULT 0,
    descricao VARCHAR(100),
    Empresas_idEmpresas INT NOT NULL,
    FOREIGN KEY (Empresas_idEmpresas) REFERENCES Empresas(idEmpresas)
);

CREATE TABLE User (
    idUser INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    Cargo_idCargo INT NOT NULL,
    FOREIGN KEY (Cargo_idCargo) REFERENCES Cargo(idCargo)
);

CREATE TABLE Indicadores (
    idIndicadores INT AUTO_INCREMENT PRIMARY KEY,
    ano YEAR NOT NULL,
    valor_adicionado DECIMAL(18,2) NOT NULL,
    Setores_idSetores INT NOT NULL,
    Municipios_idMunicipios INT NOT NULL,

    FOREIGN KEY (Setores_idSetores) REFERENCES Setores(idSetores),
    FOREIGN KEY (Municipios_idMunicipios) REFERENCES Municipios(idMunicipios)
);

CREATE TABLE Metricas_do_pib (
    idMetricas_do_pib INT AUTO_INCREMENT PRIMARY KEY,
    impostos DECIMAL(18,2) NOT NULL,
    pib DECIMAL (18,2) NOT NULL,
    pib_per_capita DECIMAL(18,2) NOT NULL,
    ano YEAR NOT NULL,
    Municipios_idMunicipios INT NOT NULL,

    FOREIGN KEY (Municipios_idMunicipios) REFERENCES Municipios(idMunicipios)
);

CREATE TABLE logBD (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dataHora DATETIME NOT NULL,
    tipo VARCHAR(45) NOT NULL,
    mensagem VARCHAR(100) NOT NULL
);

SHOW TABLES;
