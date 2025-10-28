CREATE DATABASE IF NOT EXISTS TEP;
USE TEP;

CREATE TABLE Regioes (
    idRegioes INT AUTO_INCREMENT PRIMARY KEY,
<<<<<<< HEAD
    nome_regiao VARCHAR(45) UNIQUE,
    sigla_regiao CHAR(4) NOT NULL
=======
    nome_regiao VARCHAR(45) NOT NULL,
    sigla_regiao CHAR(2) NOT NULL
>>>>>>> 002313cd0b3146968499f3ffc7f5ce8bf95d562c
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

<<<<<<< HEAD

=======
>>>>>>> 002313cd0b3146968499f3ffc7f5ce8bf95d562c
CREATE TABLE Empresas (
    idEmpresas INT AUTO_INCREMENT PRIMARY KEY,
    razao_social VARCHAR(100) NOT NULL,
    cnpj CHAR(14) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
<<<<<<< HEAD
    senha VARCHAR(100) NOT NULL,
=======
    senha CHAR(64) NOT NULL, -- hash SHA-256
>>>>>>> 002313cd0b3146968499f3ffc7f5ce8bf95d562c
    Municipios_idMunicipios INT NOT NULL,
    FOREIGN KEY (Municipios_idMunicipios) REFERENCES Municipios(idMunicipios)
);

CREATE TABLE User (
    idUser INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
<<<<<<< HEAD
    senha VARCHAR(100) NOT NULL,
    criado_em VARCHAR(45),
    Empresas_idEmpresas INT,
    User_idAdm INT,
    ADM TINYINT(1) DEFAULT 0,
=======
    senha CHAR(64) NOT NULL, -- hash SHA-256
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Empresas_idEmpresas INT,
    User_idAdm INT,
    ADM TINYINT(1) DEFAULT 0, -- 0 = comum, 1 = administrador
>>>>>>> 002313cd0b3146968499f3ffc7f5ce8bf95d562c
    FOREIGN KEY (Empresas_idEmpresas) REFERENCES Empresas(idEmpresas),
    FOREIGN KEY (User_idAdm) REFERENCES User(idUser)
);

<<<<<<< HEAD

=======
>>>>>>> 002313cd0b3146968499f3ffc7f5ce8bf95d562c
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
<<<<<<< HEAD
  idMetricas_do_pib INT AUTO_INCREMENT PRIMARY KEY,
  impostos DECIMAL(18,2) NOT NULL,
  pib_per_capita DECIMAL(18,2) NOT NULL,
  participacao DECIMAL(18,2) NOT NULL,
  ano YEAR NOT NULL,
  Municipios_idMunicipios INT NOT NULL,
  FOREIGN KEY (Municipios_idMunicipios) REFERENCES Municipios(idMunicipios)
);


CREATE TABLE logBD (
id INT PRIMARY KEY AUTO_INCREMENT,
dataHora datetime NOT NULL,
tipo VARCHAR(45) NOT NULL,
mensagem VARCHAR(100) NOT NULL 
=======
    idMetricas_do_pib INT AUTO_INCREMENT PRIMARY KEY,
    impostos DECIMAL(10,6),
    pib DECIMAL(18,2),
    pib_per_capita DECIMAL(18,2),
    ano YEAR NOT NULL,
    Municipios_idMunicipios INT NOT NULL,
    FOREIGN KEY (Municipios_idMunicipios) REFERENCES Municipios(idMunicipios)
>>>>>>> 002313cd0b3146968499f3ffc7f5ce8bf95d562c
);

SHOW TABLES;
