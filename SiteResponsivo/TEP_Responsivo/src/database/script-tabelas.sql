CREATE DATABASE IF NOT EXISTS TEP;
USE TEP;

CREATE TABLE Regioes (
    idRegioes INT AUTO_INCREMENT PRIMARY KEY,
    nome_regiao VARCHAR(45) NOT NULL,
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
    senha CHAR(64) NOT NULL, 
    Municipios_idMunicipios INT NOT NULL,
    FOREIGN KEY (Municipios_idMunicipios) REFERENCES Municipios(idMunicipios)
);

CREATE TABLE User (
    idUser INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha CHAR(64) NOT NULL,
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
    Setores_idSetores INT NOT NULL,
    Municipios_idMunicipios INT NOT NULL,
    FOREIGN KEY (Setores_idSetores) REFERENCES Setores(idSetores),
    FOREIGN KEY (Municipios_idMunicipios) REFERENCES Municipios(idMunicipios)
);

CREATE TABLE Metricas_do_pib (
    idMetricas_do_pib INT AUTO_INCREMENT PRIMARY KEY,
    impostos DECIMAL(10,6),
    pib DECIMAL(18,2),
    pib_per_capita DECIMAL(18,2),
    ano YEAR NOT NULL,
    Municipios_idMunicipios INT NOT NULL,
    FOREIGN KEY (Municipios_idMunicipios) REFERENCES Municipios(idMunicipios)
);

-- INSERINDO DADOS

INSERT INTO Regioes (nome_regiao, sigla_regiao)
VALUES 
('Região Metropolitana de São Paulo', 'RMSP'),
('Região Metropolitana de Campinas', 'RMC');

INSERT INTO Municipios (nome_municipio, Regioes_idRegioes)
VALUES
('São Paulo', 1),
('Guarulhos', 1),
('Osasco', 1),
('Santo André', 1),
('São Bernardo do Campo', 1),
('Mauá', 1),
('Barueri', 1),
('Campinas', 2),
('Sumaré', 2),
('Hortolândia', 2),
('Indaiatuba', 2),
('Americana', 2),
('Paulínia', 2),
('Valinhos', 2);

INSERT INTO Setores (nome_setor)
VALUES
('Indústria'),
('Agricultura'),
('Construção Civil'),
('Tecnologia');

INSERT INTO Empresas (razao_social, cnpj, email, senha, Municipios_idMunicipios)
VALUES
('Tech Solutions LTDA', '12345678000199', 'contato@techsolutions.com', SHA2('senha123', 256), 8),   -- Campinas
('Comércio Paulista SA', '98765432000188', 'vendas@comerciopaulista.com', SHA2('senha123', 256), 1), -- São Paulo
('Indústrias Guarulhos LTDA', '22334455000177', 'financeiro@indguarulhos.com', SHA2('senha123', 256), 2), -- Guarulhos
('AgroValinhos', '66778899000166', 'contato@agrovalinhos.com', SHA2('senha123', 256), 14); -- Valinhos

INSERT INTO User (nome, email, senha, ADM)
VALUES ('Administrador Geral', 'admin@tep.com', SHA2('admin123', 256), 1);

INSERT INTO User (nome, email, senha, Empresas_idEmpresas, User_idAdm)
VALUES
('Maria Souza', 'maria@techsolutions.com', SHA2('senha123', 256), 1, 1),
('João Lima', 'joao@comerciopaulista.com', SHA2('senha123', 256), 2, 1),
('Ana Costa', 'ana@indguarulhos.com', SHA2('senha123', 256), 3, 1),
('Pedro Alves', 'pedro@agrovalinhos.com', SHA2('senha123', 256), 4, 1);

INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios)
VALUES
(2023, 5000000.00, 1, 1), -- Indústria - São Paulo
(2023, 2000000.00, 2, 8), -- Agricultura - Campinas
(2023, 1500000.00, 3, 2), -- Construção Civil - Guarulhos
(2023, 700000.00, 4, 14), -- Tecnologia - Valinhos
(2024, 5200000.00, 1, 1), -- Indústria - São Paulo
(2024, 2100000.00, 2, 8); -- Agricultura - Campinas

INSERT INTO Metricas_do_pib (impostos, pib, pib_per_capita, ano, Municipios_idMunicipios)
VALUES
(0.180000, 8000000.00, 65000.00, 2023, 1),  -- São Paulo
(0.160000, 2500000.00, 58000.00, 2023, 8),  -- Campinas
(0.140000, 1800000.00, 52000.00, 2023, 2),  -- Guarulhos
(0.130000, 900000.00, 48000.00, 2023, 14);  -- Valinhos

SHOW TABLES;
