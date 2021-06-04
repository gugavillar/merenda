-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 03/06/2021 às 10:15
-- Versão do servidor: 10.3.29-MariaDB-0ubuntu0.20.04.1
-- Versão do PHP: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `MERENDA`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `alimentos`
--

CREATE TABLE `alimentos` (
  `id_alimento` int(11) NOT NULL,
  `tipo_alimento` enum('1','2') NOT NULL,
  `descricao_alimento` varchar(100) NOT NULL,
  `tipo_distribuicao_alimento` enum('1','2') NOT NULL,
  `estoque_minimo_alimento` decimal(8,2) UNSIGNED NOT NULL,
  `unidade_alimento` varchar(2) NOT NULL,
  `status_alimento` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `entradas`
--

CREATE TABLE `entradas` (
  `id_entrada` int(11) NOT NULL,
  `num_nota_entrada` int(11) UNSIGNED NOT NULL,
  `data_emissao_nota_entrada` date NOT NULL,
  `programa_entrada` enum('1','2') NOT NULL,
  `id_fornecedor_entrada` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `entradas_anexos_entrada`
--

CREATE TABLE `entradas_anexos_entrada` (
  `id_anexoentrada` int(11) NOT NULL,
  `id_entrada_anexoentrada` int(11) NOT NULL,
  `id_fornecedor_anexoentrada` int(11) NOT NULL,
  `num_nota_entrada_anexoentrada` int(11) UNSIGNED NOT NULL,
  `local_anexoentrada` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `entradas_itens_entrada`
--

CREATE TABLE `entradas_itens_entrada` (
  `id_itensentrada` int(11) NOT NULL,
  `id_entrada_itensentrada` int(11) NOT NULL,
  `id_alimento_itensentrada` int(11) NOT NULL,
  `quantidade_comprada_itensentrada` decimal(8,2) UNSIGNED NOT NULL,
  `quantidade_distribuida_itensentrada` decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `escolas`
--

CREATE TABLE `escolas` (
  `id_escola` int(11) NOT NULL,
  `inep_escola` varchar(8) NOT NULL,
  `cep_escola` int(8) UNSIGNED ZEROFILL NOT NULL,
  `nome_escola` varchar(100) NOT NULL,
  `logradouro_escola` varchar(150) NOT NULL,
  `numero_escola` varchar(10) DEFAULT NULL,
  `bairro_escola` varchar(100) NOT NULL,
  `complemento_escola` varchar(100) DEFAULT NULL,
  `referencia_escola` varchar(100) DEFAULT NULL,
  `tipo_escola` enum('1','2','3','4') NOT NULL,
  `status_escola` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `fornecedores`
--

CREATE TABLE `fornecedores` (
  `id_fornecedor` int(11) NOT NULL,
  `cnpj_fornecedor` varchar(14) NOT NULL,
  `nome_fornecedor` varchar(100) NOT NULL,
  `contato_fornecedor` varchar(150) NOT NULL,
  `email_fornecedor` varchar(50) NOT NULL,
  `cep_fornecedor` int(8) UNSIGNED ZEROFILL NOT NULL,
  `logradouro_fornecedor` varchar(150) NOT NULL,
  `numero_fornecedor` varchar(10) NOT NULL,
  `bairro_fornecedor` varchar(100) NOT NULL,
  `complemento_fornecedor` varchar(100) DEFAULT NULL,
  `cidade_fornecedor` varchar(100) NOT NULL,
  `estado_fornecedor` varchar(2) NOT NULL,
  `status_fornecedor` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `saidas`
--

CREATE TABLE `saidas` (
  `id_saida` int(11) NOT NULL,
  `num_saida` int(11) UNSIGNED NOT NULL,
  `id_escola_saida` int(11) NOT NULL,
  `data_emissao_saida` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gatilhos `saidas`
--
DELIMITER $$
CREATE TRIGGER `NUMERO GUIA SAIDA` BEFORE INSERT ON `saidas` FOR EACH ROW IF (
    SELECT MAX(saidas.id_saida)
    FROM saidas
    WHERE YEAR(saidas.data_emissao_saida) = YEAR(NOW())
  ) THEN
SET NEW.num_saida = (
    SELECT MAX(saidas.num_saida)
    FROM saidas
    WHERE YEAR(saidas.data_emissao_saida) = YEAR(NOW())
  ) + 1;
ELSE
SET NEW.num_saida = 1;
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `saidas_itens_saida`
--

CREATE TABLE `saidas_itens_saida` (
  `id_itenssaida` int(11) NOT NULL,
  `id_saida_itenssaida` int(11) NOT NULL,
  `id_alimento_itenssaida` int(11) NOT NULL,
  `quantidade_saida_itenssaida` decimal(8,2) UNSIGNED NOT NULL,
  `id_entrada_itenssaida` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gatilhos `saidas_itens_saida`
--
DELIMITER $$
CREATE TRIGGER `SOMA QUANTIDADE DISTRIBUIDA` BEFORE INSERT ON `saidas_itens_saida` FOR EACH ROW IF (NEW.quantidade_saida_itenssaida) THEN
SET @teste = (
    SELECT entradas_itens_entrada.quantidade_distribuida_itensentrada
    FROM entradas_itens_entrada
    WHERE entradas_itens_entrada.id_entrada_itensentrada = NEW.id_entrada_itenssaida
      AND entradas_itens_entrada.id_alimento_itensentrada = NEW.id_alimento_itenssaida
  ) + NEW.quantidade_saida_itenssaida;
IF (
  @teste <= (
    SELECT entradas_itens_entrada.quantidade_comprada_itensentrada
    FROM entradas_itens_entrada
    WHERE entradas_itens_entrada.id_entrada_itensentrada = NEW.id_entrada_itenssaida
      AND entradas_itens_entrada.id_alimento_itensentrada = NEW.id_alimento_itenssaida
  )
) THEN
UPDATE entradas_itens_entrada
SET entradas_itens_entrada.quantidade_distribuida_itensentrada = entradas_itens_entrada.quantidade_distribuida_itensentrada + NEW.quantidade_saida_itenssaida
WHERE entradas_itens_entrada.id_entrada_itensentrada = NEW.id_entrada_itenssaida
  AND entradas_itens_entrada.id_alimento_itensentrada = NEW.id_alimento_itenssaida;
ELSE SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'DISTRIBUICAO ACIMA DA ENTRADA';
END IF;
END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `SUBTRAI QUANTIDADE DISTRIBUIDA` BEFORE DELETE ON `saidas_itens_saida` FOR EACH ROW IF (OLD.id_itenssaida) THEN
SET @teste = (
    SELECT entradas_itens_entrada.quantidade_distribuida_itensentrada
    FROM entradas_itens_entrada
    WHERE entradas_itens_entrada.id_entrada_itensentrada = OLD.id_entrada_itenssaida
      AND entradas_itens_entrada.id_alimento_itensentrada = OLD.id_alimento_itenssaida
  ) - OLD.quantidade_saida_itenssaida;
IF (@teste >= 0.00) THEN
UPDATE entradas_itens_entrada
SET entradas_itens_entrada.quantidade_distribuida_itensentrada = entradas_itens_entrada.quantidade_distribuida_itensentrada - OLD.quantidade_saida_itenssaida
WHERE entradas_itens_entrada.id_entrada_itensentrada = OLD.id_entrada_itenssaida
  AND entradas_itens_entrada.id_alimento_itensentrada = OLD.id_alimento_itenssaida;
ELSE SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'ENTRADA JA EXCLUIDA';
END IF;
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `testes_aceitabilidade`
--

CREATE TABLE `testes_aceitabilidade` (
  `id_testeaceitabilidade` int(11) NOT NULL,
  `id_escola_testeaceitabilidade` int(11) NOT NULL,
  `quantitativo_afazer_testeaceitabilidade` int(11) UNSIGNED NOT NULL,
  `quantitativo_realizado_testeaceitabilidade` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `inicio_periodo_testeaceitabilidade` date NOT NULL,
  `fim_periodo_testeaceitabilidade` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `testes_aceitabilidade_resposta`
--

CREATE TABLE `testes_aceitabilidade_resposta` (
  `id_testeaceitabilidaderesposta` int(11) NOT NULL,
  `id_testeaceitabilidade_testeaceitabilidaderesposta` int(11) NOT NULL,
  `serie_testeaceitabilidaderesposta` enum('1','2','3','4','5','6','7','8','9') NOT NULL,
  `turno_testeaceitabilidaderesposta` enum('1','2','3') NOT NULL,
  `resposta_testeaceitabilidaderesposta` enum('1','2','3','4','5') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gatilhos `testes_aceitabilidade_resposta`
--
DELIMITER $$
CREATE TRIGGER `CONTA TESTE REALIZADO` BEFORE INSERT ON `testes_aceitabilidade_resposta` FOR EACH ROW IF (
    (
      SELECT testes_aceitabilidade.quantitativo_afazer_testeaceitabilidade
      FROM testes_aceitabilidade
      WHERE testes_aceitabilidade.id_testeaceitabilidade = NEW.id_testeaceitabilidade_testeaceitabilidaderesposta
    ) > (
      SELECT testes_aceitabilidade.quantitativo_realizado_testeaceitabilidade
      FROM testes_aceitabilidade
      WHERE testes_aceitabilidade.id_testeaceitabilidade = NEW.id_testeaceitabilidade_testeaceitabilidaderesposta
    )
  ) THEN
UPDATE testes_aceitabilidade
SET testes_aceitabilidade.quantitativo_realizado_testeaceitabilidade = testes_aceitabilidade.quantitativo_realizado_testeaceitabilidade + 1
WHERE testes_aceitabilidade.id_testeaceitabilidade = NEW.id_testeaceitabilidade_testeaceitabilidaderesposta;
ELSE SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'TOTAL DE TESTES REALIZADOS';
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `user` varchar(10) NOT NULL,
  `pass` varchar(42) NOT NULL,
  `token` varchar(32) NOT NULL DEFAULT '39a79d21c45fa98d20394cd9b5f1617a',
  `flag` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `name`, `user`, `pass`, `token`, `flag`) VALUES
(1, 'ADMINISTRADOR DO SISTEMA', 'root', '*BD1E96A8FE3355B8952F1EF08B565FC63D715ADF', 'e04faeb8fa9489888c951b1ea7e793b1', 1);

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `alimentos`
--
ALTER TABLE `alimentos`
  ADD PRIMARY KEY (`id_alimento`),
  ADD UNIQUE KEY `ALIMENTO UNICO` (`descricao_alimento`) USING BTREE;

--
-- Índices de tabela `entradas`
--
ALTER TABLE `entradas`
  ADD PRIMARY KEY (`id_entrada`),
  ADD UNIQUE KEY `UNICA NOTA POR FORNECEDOR` (`num_nota_entrada`,`id_fornecedor_entrada`),
  ADD KEY `ID FORNECEDOR ENTRADAS` (`id_fornecedor_entrada`) USING BTREE;

--
-- Índices de tabela `entradas_anexos_entrada`
--
ALTER TABLE `entradas_anexos_entrada`
  ADD PRIMARY KEY (`id_anexoentrada`),
  ADD UNIQUE KEY `UNICA NOTA POR FORNECEDOR` (`id_fornecedor_anexoentrada`,`num_nota_entrada_anexoentrada`),
  ADD KEY `ID ENTRADA ANEXO` (`id_entrada_anexoentrada`) USING BTREE,
  ADD KEY `ID FORNECEDOR ANEXO` (`id_fornecedor_anexoentrada`) USING BTREE;

--
-- Índices de tabela `entradas_itens_entrada`
--
ALTER TABLE `entradas_itens_entrada`
  ADD PRIMARY KEY (`id_itensentrada`),
  ADD UNIQUE KEY `UNICO ITEM POR GUIA DE ENTRADA` (`id_alimento_itensentrada`,`id_entrada_itensentrada`) USING BTREE,
  ADD KEY `ID ENTRADA ENTRADAS_ITENS_ENTRADA` (`id_entrada_itensentrada`) USING BTREE,
  ADD KEY `ID ALIMENTO ENTRADAS_ITENS_ENTRADA` (`id_alimento_itensentrada`) USING BTREE;

--
-- Índices de tabela `escolas`
--
ALTER TABLE `escolas`
  ADD PRIMARY KEY (`id_escola`);

--
-- Índices de tabela `fornecedores`
--
ALTER TABLE `fornecedores`
  ADD PRIMARY KEY (`id_fornecedor`),
  ADD UNIQUE KEY `CNPJ UNICO` (`cnpj_fornecedor`) USING BTREE;

--
-- Índices de tabela `saidas`
--
ALTER TABLE `saidas`
  ADD PRIMARY KEY (`id_saida`),
  ADD KEY `ID ESCOLA SAIDAS` (`id_escola_saida`) USING BTREE;

--
-- Índices de tabela `saidas_itens_saida`
--
ALTER TABLE `saidas_itens_saida`
  ADD PRIMARY KEY (`id_itenssaida`),
  ADD UNIQUE KEY `UNICO ITEM POR GUIA DE SAIDA` (`id_alimento_itenssaida`,`id_saida_itenssaida`) USING BTREE,
  ADD KEY `ID SAIDA SAIDAS_ITENS_SAIDA` (`id_saida_itenssaida`),
  ADD KEY `ID ALIMENTO SAIDAS_ITENS_SAIDA` (`id_alimento_itenssaida`),
  ADD KEY `ID ENTRADA SAIDAS_ITENS_SAIDA` (`id_entrada_itenssaida`);

--
-- Índices de tabela `testes_aceitabilidade`
--
ALTER TABLE `testes_aceitabilidade`
  ADD PRIMARY KEY (`id_testeaceitabilidade`),
  ADD KEY `ID ESCOLA TESTES` (`id_escola_testeaceitabilidade`);

--
-- Índices de tabela `testes_aceitabilidade_resposta`
--
ALTER TABLE `testes_aceitabilidade_resposta`
  ADD PRIMARY KEY (`id_testeaceitabilidaderesposta`),
  ADD KEY `ID TESTE TESTES` (`id_testeaceitabilidade_testeaceitabilidaderesposta`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `USER` (`user`);

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `alimentos`
--
ALTER TABLE `alimentos`
  MODIFY `id_alimento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `entradas`
--
ALTER TABLE `entradas`
  MODIFY `id_entrada` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `entradas_anexos_entrada`
--
ALTER TABLE `entradas_anexos_entrada`
  MODIFY `id_anexoentrada` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `entradas_itens_entrada`
--
ALTER TABLE `entradas_itens_entrada`
  MODIFY `id_itensentrada` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `escolas`
--
ALTER TABLE `escolas`
  MODIFY `id_escola` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `fornecedores`
--
ALTER TABLE `fornecedores`
  MODIFY `id_fornecedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `saidas`
--
ALTER TABLE `saidas`
  MODIFY `id_saida` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `saidas_itens_saida`
--
ALTER TABLE `saidas_itens_saida`
  MODIFY `id_itenssaida` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `testes_aceitabilidade`
--
ALTER TABLE `testes_aceitabilidade`
  MODIFY `id_testeaceitabilidade` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `testes_aceitabilidade_resposta`
--
ALTER TABLE `testes_aceitabilidade_resposta`
  MODIFY `id_testeaceitabilidaderesposta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `entradas`
--
ALTER TABLE `entradas`
  ADD CONSTRAINT `entradas_ibfk_1` FOREIGN KEY (`id_fornecedor_entrada`) REFERENCES `fornecedores` (`id_fornecedor`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `entradas_anexos_entrada`
--
ALTER TABLE `entradas_anexos_entrada`
  ADD CONSTRAINT `entradas_anexos_entrada_ibfk_1` FOREIGN KEY (`id_entrada_anexoentrada`) REFERENCES `entradas` (`id_entrada`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `entradas_anexos_entrada_ibfk_2` FOREIGN KEY (`id_fornecedor_anexoentrada`) REFERENCES `fornecedores` (`id_fornecedor`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `entradas_itens_entrada`
--
ALTER TABLE `entradas_itens_entrada`
  ADD CONSTRAINT `entradas_itens_entrada_ibfk_2` FOREIGN KEY (`id_alimento_itensentrada`) REFERENCES `alimentos` (`id_alimento`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `entradas_itens_entrada_ibfk_3` FOREIGN KEY (`id_entrada_itensentrada`) REFERENCES `entradas` (`id_entrada`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `saidas`
--
ALTER TABLE `saidas`
  ADD CONSTRAINT `saidas_ibfk_1` FOREIGN KEY (`id_escola_saida`) REFERENCES `escolas` (`id_escola`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `saidas_itens_saida`
--
ALTER TABLE `saidas_itens_saida`
  ADD CONSTRAINT `saidas_itens_saida_ibfk_1` FOREIGN KEY (`id_saida_itenssaida`) REFERENCES `saidas` (`id_saida`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `saidas_itens_saida_ibfk_2` FOREIGN KEY (`id_alimento_itenssaida`) REFERENCES `alimentos` (`id_alimento`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `saidas_itens_saida_ibfk_3` FOREIGN KEY (`id_entrada_itenssaida`) REFERENCES `entradas` (`id_entrada`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `testes_aceitabilidade`
--
ALTER TABLE `testes_aceitabilidade`
  ADD CONSTRAINT `testes_aceitabilidade_ibfk_1` FOREIGN KEY (`id_escola_testeaceitabilidade`) REFERENCES `escolas` (`id_escola`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `testes_aceitabilidade_resposta`
--
ALTER TABLE `testes_aceitabilidade_resposta`
  ADD CONSTRAINT `testes_aceitabilidade_resposta_ibfk_1` FOREIGN KEY (`id_testeaceitabilidade_testeaceitabilidaderesposta`) REFERENCES `testes_aceitabilidade` (`id_testeaceitabilidade`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
