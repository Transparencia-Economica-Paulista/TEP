
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

CREATE TABLE User (
    idUser INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Empresas_idEmpresas INT,
    User_idAdm INT,
    ADM TINYINT(1) DEFAULT 0,
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
  impostos DECIMAL(18,2) NOT NULL,
  pib DECIMAL(18,2),
  pib_per_capita DECIMAL(18,2) NOT NULL,
  ano YEAR NOT NULL,
  Municipios_idMunicipios INT NOT NULL,
  FOREIGN KEY (Municipios_idMunicipios) REFERENCES Municipios(idMunicipios)
);


CREATE TABLE logBD (
id INT PRIMARY KEY AUTO_INCREMENT,
dataHora datetime NOT NULL,
tipo VARCHAR(45) NOT NULL,
mensagem VARCHAR(100) NOT NULL
);



-- =============================
-- INSERÇÃO DE REGIÕES
-- =============================
INSERT INTO Regioes (nome_regiao, sigla_regiao) VALUES 
('SP - Norte', 'RMSP'),
('SP - Sul', 'RMSP'),
('SP - Leste', 'RMSP'),
('SP - Oeste', 'RMSP'),
('SP - Capital', 'RMSP'),
('Norte', 'RMC'),
('Sul', 'RMC'),
('Leste', 'RMC'),
('Oeste', 'RMC'),
('Capital', 'RMC');

-- =============================
-- INSERÇÃO DE MUNICÍPIOS
-- =============================
INSERT INTO Municipios (nome_municipio, Regioes_idRegioes) VALUES 
-- RMS
('São Paulo', 5),
('Guarulhos', 1),
('Santo André', 3),
('São Bernardo do Campo', 2),
('Osasco', 4),
('Barueri', 4),
-- RMC
('Campinas', 10),
('Sumaré', 7),
('Hortolândia', 8),
('Indaiatuba', 9),
('Americana', 6);

-- =============================
-- INSERÇÃO DE SETORES
-- =============================
INSERT INTO Setores (nome_setor) VALUES 
('Serviços'),
('Indústria'),
('Agropecuária'),
('Administração Pública');

-- =============================
-- INSERÇÃO DE EMPRESAS
-- =============================
INSERT INTO Empresas (razao_social, cnpj, email, senha, Municipios_idMunicipios) VALUES 
('Empresa Capital SP', '12345678000195', 'contato@empresasp.com.br', 'sp123', 1),
('Empresa Osasco Ltda', '98765432000187', 'contato@empresaosasco.com.br', 'osasco123', 5),
('Empresa Campinas S/A', '11122233000144', 'contato@empresacampinas.com.br', 'campinas123', 7);

-- =============================
-- INSERÇÃO DE USUÁRIOS
-- =============================
INSERT INTO User (nome, email, senha, Empresas_idEmpresas, ADM) VALUES 
('João Silva', 'joao@empresasp.com.br', 'joao123', 1, 0),
('Maria Souza', 'maria@empresaosasco.com.br', 'maria123', 2, 0),
('Pedro Costa', 'pedro@empresacampinas.com.br', 'pedro123', 3, 0);

-- =============================
-- INSERÇÃO DE MÉTRICAS DO PIB
-- =============================
-- São Paulo (RMS - Capital)
INSERT INTO Metricas_do_pib (impostos, pib, pib_per_capita, ano, Municipios_idMunicipios) VALUES 
(150000000000, 2500000000000, 90000, 2020, 1),
(160000000000, 2600000000000, 94000, 2021, 1),
(170000000000, 2750000000000, 98000, 2022, 1),
(180000000000, 2900000000000, 102000, 2023, 1),
(190000000000, 3050000000000, 106000, 2024, 1);

-- Campinas (RMC - Sede)
INSERT INTO Metricas_do_pib (impostos, pib, pib_per_capita, ano, Municipios_idMunicipios) VALUES 
(20000000000, 600000000000, 75000, 2020, 7),
(22000000000, 630000000000, 78000, 2021, 7),
(24000000000, 670000000000, 81000, 2022, 7),
(26000000000, 710000000000, 85000, 2023, 7),
(28000000000, 750000000000, 89000, 2024, 7);

-- Osasco (RMSP - Oeste)
INSERT INTO Metricas_do_pib (impostos, pib, pib_per_capita, ano, Municipios_idMunicipios) VALUES 
(8000000000, 180000000000, 45000, 2020, 5),
(8500000000, 190000000000, 47000, 2021, 5),
(9000000000, 200000000000, 49000, 2022, 5),
(9500000000, 210000000000, 51000, 2023, 5),
(10000000000, 220000000000, 53000, 2024, 5);

-- Barueri (RMSP - Oeste)
INSERT INTO Metricas_do_pib (impostos, pib, pib_per_capita, ano, Municipios_idMunicipios) VALUES 
(6000000000, 140000000000, 55000, 2020, 6),
(6300000000, 147000000000, 57000, 2021, 6),
(6600000000, 154000000000, 59000, 2022, 6),
(6900000000, 161000000000, 61000, 2023, 6),
(7200000000, 168000000000, 63000, 2024, 6);

-- Guarulhos (RMSP - Norte)
INSERT INTO Metricas_do_pib (impostos, pib, pib_per_capita, ano, Municipios_idMunicipios) VALUES 
(12000000000, 280000000000, 50000, 2020, 2),
(12600000000, 294000000000, 52000, 2021, 2),
(13200000000, 308000000000, 54000, 2022, 2),
(13800000000, 322000000000, 56000, 2023, 2),
(14400000000, 336000000000, 58000, 2024, 2);

-- =============================
-- INSERÇÃO DE INDICADORES
-- =============================

INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
(2024, 1600000000000, 1, 1),
(2024, 600000000000, 2, 1),
(2024, 210000000000, 4, 1),
(2024, 250000000000, 3, 1),
(2024, 180000000000, 4, 1),
(2024, 40000000000, 3, 1);

-- Campinas (RMC - Sede)
INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
(2024, 300000000000, 1, 7),
(2024, 160000000000, 2, 7),
(2024, 50000000000, 4, 7),
(2024, 40000000000, 3, 7),
(2024, 27000000000, 2, 7),
(2024, 9000000000, 3, 7);

-- Osasco (RMSP - Oeste)
INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
(2024, 90000000000, 1, 5),
(2024, 45000000000, 2, 5),
(2024, 15000000000, 4, 5),
(2024, 8000000000, 3, 5),
(2024, 20000000000, 2, 5),
(2024, 5000000000, 3, 5);

-- Barueri (RMSP - Oeste)
INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
(2024, 70000000000, 1, 6),
(2024, 35000000000, 2, 6),
(2024, 12000000000, 4, 6),
(2024, 6000000000, 3, 6),
(2024, 15000000000, 2, 6),
(2024, 4000000000, 3, 6);

-- Guarulhos (RMSP - Norte) 
INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
(2024, 140000000000, 1, 2),
(2024, 70000000000, 2, 2),
(2024, 25000000000, 4, 2),
(2024, 12000000000, 3, 2),
(2024, 30000000000, 2, 2),
(2024, 8000000000, 3, 2);

-- Dados históricos adicionais para anos anteriores
-- Osasco - 2023
INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
(2023, 85000000000, 1, 5),
(2023, 42000000000, 2, 5),
(2023, 14000000000, 4, 5),
(2023, 7500000000, 3, 5);

-- Campinas - 2023
INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
(2023, 285000000000, 1, 7),
(2023, 152000000000, 2, 7),
(2023, 48000000000, 4, 7),
(2023, 38000000000, 3, 7);

-- São Paulo - 2023
INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
(2023, 1520000000000, 1, 1),
(2023, 570000000000, 2, 1),
(2023, 200000000000, 4, 1),
(2023, 240000000000, 3, 1);

-- Osasco (RMSP - Oeste) - Município ID 5
INSERT INTO Metricas_do_pib (impostos, pib, pib_per_capita, ano, Municipios_idMunicipios) VALUES 
(8000000000, 180000000000, 45000, 2020, 5),
(8500000000, 190000000000, 47000, 2021, 5),
(9000000000, 200000000000, 49000, 2022, 5),
(9500000000, 210000000000, 51000, 2023, 5),
(10000000000, 220000000000, 53000, 2024, 5);

-- Barueri (RMSP - Oeste) - Município ID 6
INSERT INTO Metricas_do_pib (impostos, pib, pib_per_capita, ano, Municipios_idMunicipios) VALUES 
(6000000000, 140000000000, 55000, 2020, 6),
(6300000000, 147000000000, 57000, 2021, 6),
(6600000000, 154000000000, 59000, 2022, 6),
(6900000000, 161000000000, 61000, 2023, 6),
(7200000000, 168000000000, 63000, 2024, 6);

-- Guarulhos (RMSP - Norte) - Município ID 2
INSERT INTO Metricas_do_pib (impostos, pib, pib_per_capita, ano, Municipios_idMunicipios) VALUES 
(12000000000, 280000000000, 50000, 2020, 2),
(12600000000, 294000000000, 52000, 2021, 2),
(13200000000, 308000000000, 54000, 2022, 2),
(13800000000, 322000000000, 56000, 2023, 2),
(14400000000, 336000000000, 58000, 2024, 2);

-- Indicadores para Osasco (ID 5)
INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
-- 2024
(2024, 90000000000, 1, 5),   -- Serviços
(2024, 45000000000, 2, 5),   -- Indústria
(2024, 15000000000, 4, 5),   -- Administração Pública
(2024, 8000000000, 3, 5),    -- Agropecuária
-- 2023
(2023, 85000000000, 1, 5),   -- Serviços
(2023, 42000000000, 2, 5),   -- Indústria
(2023, 14000000000, 4, 5),   -- Administração Pública
(2023, 7500000000, 3, 5);    -- Agropecuária

-- Indicadores para Barueri (ID 6)
INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
-- 2024
(2024, 70000000000, 1, 6),   -- Serviços
(2024, 35000000000, 2, 6),   -- Indústria
(2024, 12000000000, 4, 6),   -- Administração Pública
(2024, 6000000000, 3, 6),    -- Agropecuária
-- 2023
(2023, 66000000000, 1, 6),   -- Serviços
(2023, 33000000000, 2, 6),   -- Indústria
(2023, 11000000000, 4, 6),   -- Administração Pública
(2023, 5500000000, 3, 6);    -- Agropecuária

-- Indicadores para Guarulhos (ID 2)
INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
-- 2024
(2024, 140000000000, 1, 2),  -- Serviços
(2024, 70000000000, 2, 2),   -- Indústria
(2024, 25000000000, 4, 2),   -- Administração Pública
(2024, 12000000000, 3, 2),   -- Agropecuária
-- 2023
(2023, 132000000000, 1, 2),  -- Serviços
(2023, 66000000000, 2, 2),   -- Indústria
(2023, 23000000000, 4, 2),   -- Administração Pública
(2023, 11000000000, 3, 2);   -- Agropecuária

-- Dados históricos adicionais para São Paulo e Campinas
-- São Paulo - 2023
INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
(2023, 1520000000000, 1, 1),  -- Serviços
(2023, 570000000000, 2, 1),   -- Indústria
(2023, 200000000000, 4, 1),   -- Administração Pública
(2023, 240000000000, 3, 1);   -- Agropecuária

-- Campinas - 2023
INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
(2023, 285000000000, 1, 7),  -- Serviços
(2023, 152000000000, 2, 7),  -- Indústria
(2023, 48000000000, 4, 7),   -- Administração Pública
(2023, 38000000000, 3, 7);   -- Agropecuária

-- Adicionar também dados para municípios restantes (Santo André, São Bernardo, Sumaré, etc.)
-- Santo André (ID 3)
INSERT INTO Metricas_do_pib (impostos, pib, pib_per_capita, ano, Municipios_idMunicipios) VALUES 
(5000000000, 120000000000, 48000, 2023, 3),
(5200000000, 125000000000, 50000, 2024, 3);

INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
(2024, 55000000000, 1, 3),   -- Serviços
(2024, 28000000000, 2, 3),   -- Indústria
(2024, 10000000000, 4, 3),   -- Administração Pública
(2024, 5000000000, 3, 3);    -- Agropecuária

-- São Bernardo do Campo (ID 4)
INSERT INTO Metricas_do_pib (impostos, pib, pib_per_capita, ano, Municipios_idMunicipios) VALUES 
(7000000000, 160000000000, 52000, 2023, 4),
(7300000000, 167000000000, 54000, 2024, 4);

INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores, Municipios_idMunicipios) VALUES
(2024, 75000000000, 1, 4),   -- Serviços
(2024, 38000000000, 2, 4),   -- Indústria
(2024, 13000000000, 4, 4),   -- Administração Pública
(2024, 7000000000, 3, 4);    -- Agropecuária
