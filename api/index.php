<?php
date_default_timezone_set('America/Recife');

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once 'vendor/autoload.php';
require_once 'conection_server.php';

$verify = function (Request $request, Response $response, $next) {
	$uri = $request->getUri()->getPath();
	$pattern1 = '/testesdeaceitabilidade\/escolas/i';
	$pattern2 = '/testesdeaceitabilidade\/respostas/i';
	$pattern3 = '/testesdeaceitabilidade/i';
	if ((preg_match($pattern1, $uri) && $request->isGet()) || ((preg_match($pattern2, $uri) && $request->isPost())) || (preg_match($pattern3, $uri) && $request->isGet())) {
		$response = $next($request, $response);
	} else if ($request->hasHeader('Authorization')) {
		$headerValue = $request->getHeaderLine('Authorization');
		$sql = 'SELECT users.token FROM users WHERE users.token = :token';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('token', $headerValue, PDO::PARAM_STR);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			if ($resp) {
				$response = $next($request, $response);
			} else {
				$response = $response->withStatus(401);
				$erro['erro'] = 'Unauthorized';
				$response->getBody()->write(json_encode($erro));
			}
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	} else {
		$response = $response->withStatus(401);
		$erro['erro'] = 'Unauthorized';
		$response->getBody()->write(json_encode($erro));
	}
	return $response;
};

$app = new \Slim\App();
$app->group('/login', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'SELECT users.id, users.token, users.flag FROM users WHERE users.user = BINARY :usuario AND users.pass = BINARY PASSWORD(:password)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('usuario', $data['user'], PDO::PARAM_STR);
			$stmt->bindParam('password', $data['pass'], PDO::PARAM_STR);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->put('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'UPDATE users SET users.pass = PASSWORD(:novasenha), users.token = :token, users.flag = :flag WHERE users.id = :id';
		$data['token'] = md5($data['user'] . ':' . $data['novasenha'] . time());
		$data['flag'] = 1;
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('novasenha', $data['novasenha'], PDO::PARAM_STR);
			$stmt->bindParam('token', $data['token'], PDO::PARAM_STR);
			$stmt->bindParam('flag', $data['flag'], PDO::PARAM_INT);
			$stmt->bindParam('id', $data['id'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
});

$app->group('/alimentos', function () use ($app) {
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM alimentos WHERE alimentos.status_alimento = 1 ORDER BY alimentos.descricao_alimento ASC';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO alimentos (alimentos.tipo_alimento, alimentos.descricao_alimento, alimentos.tipo_distribuicao_alimento, alimentos.estoque_minimo_alimento, alimentos.unidade_alimento) VALUES (:tipo_alimento, :descricao_alimento, :tipo_distribuicao_alimento, :estoque_minimo_alimento, :unidade_alimento)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('tipo_alimento', $data['tipo_alimento'], PDO::PARAM_INT);
			$stmt->bindParam('descricao_alimento', $data['descricao_alimento'], PDO::PARAM_STR);
			$stmt->bindParam('tipo_distribuicao_alimento', $data['tipo_distribuicao_alimento'], PDO::PARAM_STR);
			$stmt->bindParam('estoque_minimo_alimento', $data['estoque_minimo_alimento']);
			$stmt->bindParam('unidade_alimento', $data['unidade_alimento'], PDO::PARAM_STR);
			$stmt->execute();
			$data['id_alimento'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->delete('/{id_alimento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE alimentos SET alimentos.status_alimento = 0 WHERE alimentos.id_alimento = :id_alimento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_alimento', $arguments['id_alimento'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/escolas', function () use ($app) {
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM escolas WHERE escolas.status_escola = 1 ORDER BY escolas.nome_escola ASC';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/{id_escola}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM escolas WHERE escolas.id_escola = :id_escola';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_escola', $arguments['id_escola'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO escolas (escolas.inep_escola, escolas.cep_escola, escolas.nome_escola, escolas.logradouro_escola, escolas.numero_escola, escolas.bairro_escola, escolas.complemento_escola, escolas.referencia_escola, escolas.tipo_escola) VALUES (:inep_escola, :cep_escola, :nome_escola, :logradouro_escola, :numero_escola, :bairro_escola, :complemento_escola, :referencia_escola, :tipo_escola)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('inep_escola', $data['inep_escola'], PDO::PARAM_STR);
			$stmt->bindParam('cep_escola', $data['cep_escola'], PDO::PARAM_INT);
			$stmt->bindParam('nome_escola', $data['nome_escola'], PDO::PARAM_STR);
			$stmt->bindParam('logradouro_escola', $data['logradouro_escola'], PDO::PARAM_STR);
			$stmt->bindParam('numero_escola', $data['numero_escola'], PDO::PARAM_STR);
			$stmt->bindParam('bairro_escola', $data['bairro_escola'], PDO::PARAM_STR);
			$stmt->bindParam('complemento_escola', $data['complemento_escola'], PDO::PARAM_STR);
			$stmt->bindParam('referencia_escola', $data['referencia_escola'], PDO::PARAM_STR);
			$stmt->bindParam('tipo_escola', $data['tipo_escola'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_escola'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->delete('/{id_escola}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE escolas SET escolas.status_escola = 0 WHERE escolas.id_escola = :id_escola';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_escola', $arguments['id_escola'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/fornecedores', function () use ($app) {
	$app->get('/{id_fornecedor}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM fornecedores WHERE fornecedores.id_fornecedor = :id_fornecedor';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_fornecedor', $arguments['id_fornecedor'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM fornecedores WHERE fornecedores.status_fornecedor = 1 ORDER BY fornecedores.nome_fornecedor ASC';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO fornecedores (fornecedores.cnpj_fornecedor, fornecedores.nome_fornecedor, fornecedores.contato_fornecedor, fornecedores.email_fornecedor, fornecedores.cep_fornecedor, fornecedores.logradouro_fornecedor, fornecedores.numero_fornecedor, fornecedores.bairro_fornecedor, fornecedores.complemento_fornecedor, fornecedores.cidade_fornecedor, fornecedores.estado_fornecedor) VALUES (:cnpj_fornecedor, :nome_fornecedor, :contato_fornecedor, :email_fornecedor, :cep_fornecedor, :logradouro_fornecedor, :numero_fornecedor, :bairro_fornecedor, :complemento_fornecedor, :cidade_fornecedor, :estado_fornecedor)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('cnpj_fornecedor', $data['cnpj_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('nome_fornecedor', $data['nome_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('contato_fornecedor', $data['contato_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('email_fornecedor', $data['email_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('cep_fornecedor', $data['cep_fornecedor'], PDO::PARAM_INT);
			$stmt->bindParam('logradouro_fornecedor', $data['logradouro_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('numero_fornecedor', $data['numero_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('bairro_fornecedor', $data['bairro_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('complemento_fornecedor', $data['complemento_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('cidade_fornecedor', $data['cidade_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('estado_fornecedor', $data['estado_fornecedor'], PDO::PARAM_STR);
			$stmt->execute();
			$data['id_fornecedor'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->delete('/{id_fornecedor}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE fornecedores SET fornecedores.status_fornecedor = 0 WHERE fornecedores.id_fornecedor = :id_fornecedor';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_fornecedor', $arguments['id_fornecedor'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/guiassaida', function () use ($app) {
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT saidas.id_saida, saidas.num_saida, escolas.nome_escola, escolas.tipo_escola, saidas.data_emissao_saida FROM saidas INNER JOIN escolas ON saidas.id_escola_saida = escolas.id_escola ORDER BY saidas.data_emissao_saida DESC';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/{id_saida}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT saidas.id_saida, saidas.num_saida, saidas.data_emissao_saida, escolas.id_escola, escolas.nome_escola, escolas.numero_escola, escolas.inep_escola, escolas.logradouro_escola, escolas.cep_escola, escolas.bairro_escola, escolas.tipo_escola, escolas.referencia_escola FROM saidas INNER JOIN escolas ON saidas.id_escola_saida = escolas.id_escola WHERE saidas.id_saida = :id_saida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_saida', $arguments['id_saida'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->delete('/{id_saida}', function (Request $request, Response $response, array $arguments) {
		$sql = 'DELETE FROM saidas WHERE saidas.id_saida = :id_saida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_saida', $arguments['id_saida'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO saidas (saidas.id_escola_saida, saidas.data_emissao_saida) VALUES (:id_escola_saida, NOW())';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_escola_saida', $data['id_escola_saida'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_saida'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/produtos/{id_saida}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT alimentos.id_alimento, alimentos.tipo_alimento, alimentos.tipo_distribuicao_alimento, alimentos.descricao_alimento, alimentos.unidade_alimento, saidas_itens_saida.quantidade_saida_itenssaida, saidas_itens_saida.id_itenssaida FROM alimentos INNER JOIN saidas_itens_saida ON alimentos.id_alimento = saidas_itens_saida.id_alimento_itenssaida WHERE saidas_itens_saida.id_saida_itenssaida = :id_saida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_saida', $arguments['id_saida'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/produtos/nota/{id_entrada}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT alimentos.id_alimento, alimentos.descricao_alimento, alimentos.tipo_alimento, alimentos.tipo_distribuicao_alimento, alimentos.unidade_alimento, entradas_itens_entrada.quantidade_comprada_itensentrada, entradas_itens_entrada.quantidade_distribuida_itensentrada, entradas_itens_entrada.id_entrada_itensentrada FROM alimentos INNER JOIN entradas_itens_entrada ON alimentos.id_alimento = entradas_itens_entrada.id_alimento_itensentrada WHERE entradas_itens_entrada.id_entrada_itensentrada = :id_entrada AND entradas_itens_entrada.quantidade_distribuida_itensentrada < entradas_itens_entrada.quantidade_comprada_itensentrada AND alimentos.status_alimento = 1';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_entrada', $arguments['id_entrada'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/itens/{id_itenssaida}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT alimentos.id_alimento, alimentos.descricao_alimento, alimentos.tipo_alimento, alimentos.tipo_distribuicao_alimento, alimentos.unidade_alimento, saidas_itens_saida.quantidade_saida_itenssaida, saidas_itens_saida.id_itenssaida FROM alimentos INNER JOIN saidas_itens_saida ON alimentos.id_alimento = saidas_itens_saida.id_alimento_itenssaida WHERE saidas_itens_saida.id_itenssaida = :id_itenssaida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_itenssaida', $arguments['id_itenssaida'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->delete('/itens/{id_itenssaida}', function (Request $request, Response $response, array $arguments) {
		$sql = 'DELETE FROM saidas_itens_saida WHERE saidas_itens_saida.id_itenssaida = :id_itenssaida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_itenssaida', $arguments['id_itenssaida'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->post('/itens', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO saidas_itens_saida (saidas_itens_saida.id_saida_itenssaida, saidas_itens_saida.id_alimento_itenssaida, saidas_itens_saida.quantidade_saida_itenssaida, saidas_itens_saida.id_entrada_itenssaida) VALUES (:id_saida_itenssaida, :id_alimento_itenssaida, :quantidade_saida_itenssaida, :id_entrada_itenssaida)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_saida_itenssaida', $data['id_saida_itenssaida'], PDO::PARAM_INT);
			$stmt->bindParam('id_alimento_itenssaida', $data['id_alimento_itenssaida'], PDO::PARAM_INT);
			$stmt->bindParam('quantidade_saida_itenssaida', $data['quantidade_saida_itenssaida'], PDO::PARAM_INT);
			$stmt->bindParam('id_entrada_itenssaida', $data['id_entrada_itenssaida'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_itenssaida'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->get('/distribuicao/notas', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT DISTINCT entradas.id_entrada, entradas.num_nota_entrada, entradas.programa_entrada, fornecedores.nome_fornecedor, fornecedores.id_fornecedor FROM entradas INNER JOIN fornecedores ON entradas.id_fornecedor_entrada = fornecedores.id_fornecedor INNER JOIN entradas_itens_entrada ON entradas_itens_entrada.id_entrada_itensentrada = entradas.id_entrada WHERE entradas_itens_entrada.quantidade_distribuida_itensentrada < entradas_itens_entrada.quantidade_comprada_itensentrada';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/guiasentrada', function () use ($app) {
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT entradas.id_entrada, entradas.num_nota_entrada, fornecedores.nome_fornecedor, entradas.data_emissao_nota_entrada FROM entradas INNER JOIN fornecedores ON entradas.id_fornecedor_entrada = fornecedores.id_fornecedor ORDER BY entradas.id_entrada DESC';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/{id_entrada}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT entradas.id_entrada, entradas.num_nota_entrada, entradas.data_emissao_nota_entrada, fornecedores.cnpj_fornecedor, fornecedores.nome_fornecedor, fornecedores.logradouro_fornecedor, fornecedores.numero_fornecedor, fornecedores.cep_fornecedor, fornecedores.bairro_fornecedor, fornecedores.complemento_fornecedor, fornecedores.cidade_fornecedor, fornecedores.estado_fornecedor FROM entradas INNER JOIN fornecedores ON entradas.id_fornecedor_entrada = fornecedores.id_fornecedor WHERE entradas.id_entrada = :id_entrada';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_entrada', $arguments['id_entrada'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO entradas (entradas.id_fornecedor_entrada, entradas.num_nota_entrada, entradas.data_emissao_nota_entrada, entradas.programa_entrada) VALUES (:id_fornecedor_entrada, :num_nota_entrada, :data_emissao_nota_entrada, :programa_entrada)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_fornecedor_entrada', $data['id_fornecedor_entrada'], PDO::PARAM_INT);
			$stmt->bindParam('num_nota_entrada', $data['num_nota_entrada'], PDO::PARAM_INT);
			$stmt->bindParam('programa_entrada', $data['programa_entrada'], PDO::PARAM_STR);
			$stmt->bindParam('data_emissao_nota_entrada', $data['data_emissao_nota_entrada']);
			$stmt->execute();
			$data['id_entrada'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->get('/produtos/{id_entrada}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT alimentos.id_alimento, alimentos.tipo_alimento, alimentos.tipo_distribuicao_alimento, alimentos.descricao_alimento, alimentos.unidade_alimento, entradas_itens_entrada.quantidade_comprada_itensentrada, entradas_itens_entrada.id_itensentrada FROM alimentos INNER JOIN entradas_itens_entrada ON alimentos.id_alimento = entradas_itens_entrada.id_alimento_itensentrada WHERE entradas_itens_entrada.id_entrada_itensentrada = :id_entrada';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_entrada', $arguments['id_entrada'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('/anexo', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$filename = $_FILES['file']['name'];
		$ext = pathinfo($filename, PATHINFO_EXTENSION);
		$sql = 'INSERT INTO entradas_anexos_entrada (entradas_anexos_entrada.id_entrada_anexoentrada, entradas_anexos_entrada.id_fornecedor_anexoentrada, entradas_anexos_entrada.num_nota_entrada_anexoentrada, entradas_anexos_entrada.local_anexoentrada) VALUES (:id_entrada_anexoentrada, :id_fornecedor_anexoentrada, :num_nota_entrada_anexoentrada, :file)';
		if (move_uploaded_file($_FILES['file']['tmp_name'], __DIR__ . '/media/notas/' . $data['id_fornecedor_anexoentrada'] . '_' . $data['num_nota_entrada_anexoentrada'] . '.' . $ext)) {
			$data['file'] =  $data['id_fornecedor_anexoentrada'] . '_' . $data['num_nota_entrada_anexoentrada'] . '.' . $ext;
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam('id_entrada_anexoentrada', $data['id_entrada_anexoentrada'], PDO::PARAM_INT);
				$stmt->bindParam('id_fornecedor_anexoentrada', $data['id_fornecedor_anexoentrada'], PDO::PARAM_INT);
				$stmt->bindParam('num_nota_entrada_anexoentrada', $data['num_nota_entrada_anexoentrada'], PDO::PARAM_INT);
				$stmt->bindParam('file', $data['file'], PDO::PARAM_STR);
				$stmt->execute();
				$data['id_anexoentrada'] = $db->lastInsertId();
				$db = null;
				$response->getBody()->write(json_encode($data));
			} catch (PDOException $e) {
				$response->getBody()->write(json_encode($e->getMessage()));
			}
		}
	});

	$app->get('/anexo/{id_entrada_anexoentrada}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT entradas_anexos_entrada.local_anexoentrada FROM entradas_anexos_entrada WHERE entradas_anexos_entrada.id_entrada_anexoentrada = :id_entrada_anexoentrada';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_entrada_anexoentrada', $arguments['id_entrada_anexoentrada'], PDO::PARAM_STR);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/itens/{id_itensentrada}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT alimentos.id_alimento, alimentos.descricao_alimento, alimentos.tipo_alimento, alimentos.tipo_distribuicao_alimento, alimentos.unidade_alimento, entradas_itens_entrada.quantidade_comprada_itensentrada, entradas_itens_entrada.id_itensentrada FROM alimentos INNER JOIN entradas_itens_entrada ON alimentos.id_alimento = entradas_itens_entrada.id_alimento_itensentrada WHERE entradas_itens_entrada.id_itensentrada = :id_itensentrada';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_itensentrada', $arguments['id_itensentrada'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->delete('/itens/{id_itensentrada}', function (Request $request, Response $response, array $arguments) {
		$sql = 'DELETE FROM entradas_itens_entrada WHERE entradas_itens_entrada.id_itensentrada = :id_itensentrada';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_itensentrada', $arguments['id_itensentrada'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('/itens', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO entradas_itens_entrada (entradas_itens_entrada.id_entrada_itensentrada, entradas_itens_entrada.id_alimento_itensentrada, entradas_itens_entrada.quantidade_comprada_itensentrada) VALUES (:id_entrada_itensentrada, :id_alimento_itensentrada, :quantidade_comprada_itensentrada)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_entrada_itensentrada', $data['id_entrada_itensentrada'], PDO::PARAM_INT);
			$stmt->bindParam('id_alimento_itensentrada', $data['id_alimento_itensentrada'], PDO::PARAM_INT);
			$stmt->bindParam('quantidade_comprada_itensentrada', $data['quantidade_comprada_itensentrada'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_itensentrada'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/relatorio', function () use ($app) {
	$app->get('/escolas/{id_escola}/{inicio_periodo}/{fim_periodo}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT alimentos.tipo_alimento, alimentos.descricao_alimento, alimentos.tipo_distribuicao_alimento, SUM(saidas_itens_saida.quantidade_saida_itenssaida) AS quantidade_saida, alimentos.unidade_alimento FROM saidas_itens_saida INNER JOIN saidas ON saidas_itens_saida.id_saida_itenssaida = saidas.id_saida INNER JOIN alimentos ON saidas_itens_saida.id_alimento_itenssaida = alimentos.id_alimento WHERE DATE(saidas.data_emissao_saida) BETWEEN :inicio_periodo AND :fim_periodo AND saidas.id_escola_saida = :id_escola GROUP BY saidas_itens_saida.id_alimento_itenssaida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_escola', $arguments['id_escola'], PDO::PARAM_INT);
			$stmt->bindParam('inicio_periodo', $arguments['inicio_periodo']);
			$stmt->bindParam('fim_periodo', $arguments['fim_periodo']);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/tipo/escola/{tipo_escola}/{inicio_periodo}/{fim_periodo}', function (Request $request, Response $response, array $arguments) {
		if ($arguments['tipo_escola'] != '9' && $arguments['tipo_escola'] != '8') {
			$sql = 'SELECT alimentos.tipo_alimento, alimentos.descricao_alimento, alimentos.tipo_distribuicao_alimento, alimentos.unidade_alimento, SUM(saidas_itens_saida.quantidade_saida_itenssaida) AS quantidade_saida FROM saidas_itens_saida INNER JOIN saidas ON saidas_itens_saida.id_saida_itenssaida = saidas.id_saida INNER JOIN alimentos ON saidas_itens_saida.id_alimento_itenssaida = alimentos.id_alimento INNER JOIN escolas ON saidas.id_escola_saida = escolas.id_escola WHERE escolas.tipo_escola = :tipo_escola AND DATE(saidas.data_emissao_saida) BETWEEN :inicio_periodo AND :fim_periodo GROUP BY saidas_itens_saida.id_alimento_itenssaida';
		} else if ($arguments['tipo_escola'] == '8') {
			$sql = 'SELECT alimentos.tipo_alimento, alimentos.descricao_alimento, alimentos.tipo_distribuicao_alimento, alimentos.unidade_alimento, SUM(saidas_itens_saida.quantidade_saida_itenssaida) AS quantidade_saida FROM saidas_itens_saida INNER JOIN saidas ON saidas_itens_saida.id_saida_itenssaida = saidas.id_saida INNER JOIN alimentos ON saidas_itens_saida.id_alimento_itenssaida = alimentos.id_alimento INNER JOIN escolas ON saidas.id_escola_saida = escolas.id_escola WHERE escolas.tipo_escola <> 4 AND DATE(saidas.data_emissao_saida) BETWEEN :inicio_periodo AND :fim_periodo GROUP BY saidas_itens_saida.id_alimento_itenssaida';
		} else {
			$sql = 'SELECT alimentos.tipo_alimento, alimentos.descricao_alimento, alimentos.tipo_distribuicao_alimento, alimentos.unidade_alimento, SUM(saidas_itens_saida.quantidade_saida_itenssaida) AS quantidade_saida FROM saidas_itens_saida INNER JOIN saidas ON saidas_itens_saida.id_saida_itenssaida = saidas.id_saida INNER JOIN alimentos ON saidas_itens_saida.id_alimento_itenssaida = alimentos.id_alimento WHERE DATE(saidas.data_emissao_saida) BETWEEN :inicio_periodo AND :fim_periodo GROUP BY saidas_itens_saida.id_alimento_itenssaida';
		}
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			if ($arguments['tipo_escola'] != '9' && $arguments['tipo_escola'] != '8') {
				$stmt->bindParam('tipo_escola', $arguments['tipo_escola'], PDO::PARAM_INT);
			}
			$stmt->bindParam('inicio_periodo', $arguments['inicio_periodo']);
			$stmt->bindParam('fim_periodo', $arguments['fim_periodo']);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/distribuicao/{id_entrada_itenssaida}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT escolas.nome_escola, escolas.tipo_escola, alimentos.descricao_alimento, alimentos.tipo_distribuicao_alimento, alimentos.unidade_alimento, saidas_itens_saida.quantidade_saida_itenssaida, saidas.num_saida, saidas.data_emissao_saida FROM saidas_itens_saida INNER JOIN saidas ON saidas_itens_saida.id_saida_itenssaida = saidas.id_saida INNER JOIN escolas ON escolas.id_escola = saidas.id_escola_saida INNER JOIN alimentos ON alimentos.id_alimento = saidas_itens_saida.id_alimento_itenssaida WHERE saidas_itens_saida.id_entrada_itenssaida = :id_entrada_itenssaida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_entrada_itenssaida', $arguments['id_entrada_itenssaida'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/programa/{programa_entrada}/{inicio_periodo}/{fim_periodo}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT alimentos.tipo_alimento, alimentos.descricao_alimento, alimentos.tipo_distribuicao_alimento, SUM(entradas_itens_entrada.quantidade_comprada_itensentrada) AS quantidade_comprada, alimentos.unidade_alimento FROM entradas_itens_entrada INNER JOIN entradas ON entradas_itens_entrada.id_entrada_itensentrada = entradas.id_entrada INNER JOIN alimentos ON entradas_itens_entrada.id_alimento_itensentrada = alimentos.id_alimento WHERE DATE(entradas.data_emissao_nota_entrada) BETWEEN :inicio_periodo AND :fim_periodo AND entradas.programa_entrada = :programa_entrada GROUP BY entradas_itens_entrada.id_alimento_itensentrada';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('programa_entrada', $arguments['programa_entrada'], PDO::PARAM_INT);
			$stmt->bindParam('inicio_periodo', $arguments['inicio_periodo']);
			$stmt->bindParam('fim_periodo', $arguments['fim_periodo']);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/fornecedor/{id_fornecedor}/{programa_entrada}/{inicio_periodo}/{fim_periodo}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT alimentos.descricao_alimento, alimentos.unidade_alimento, alimentos.tipo_distribuicao_alimento, entradas_itens_entrada.quantidade_comprada_itensentrada, entradas.id_entrada, entradas.data_emissao_nota_entrada, entradas.num_nota_entrada FROM alimentos INNER JOIN entradas_itens_entrada ON alimentos.id_alimento = entradas_itens_entrada.id_alimento_itensentrada INNER JOIN entradas ON entradas_itens_entrada.id_entrada_itensentrada = entradas.id_entrada INNER JOIN fornecedores ON entradas.id_fornecedor_entrada = fornecedores.id_fornecedor WHERE fornecedores.id_fornecedor = :id_fornecedor AND entradas.programa_entrada = :programa_entrada AND entradas.data_emissao_nota_entrada BETWEEN :inicio_periodo AND :fim_periodo';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_fornecedor', $arguments['id_fornecedor'], PDO::PARAM_INT);
			$stmt->bindParam('programa_entrada', $arguments['programa_entrada'], PDO::PARAM_INT);
			$stmt->bindParam('inicio_periodo', $arguments['inicio_periodo']);
			$stmt->bindParam('fim_periodo', $arguments['fim_periodo']);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/notas', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT entradas.id_entrada, entradas.num_nota_entrada, entradas.programa_entrada, fornecedores.cnpj_fornecedor, fornecedores.nome_fornecedor, fornecedores.logradouro_fornecedor, fornecedores.numero_fornecedor, fornecedores.cep_fornecedor, fornecedores.bairro_fornecedor, fornecedores.cidade_fornecedor, fornecedores.estado_fornecedor, fornecedores.complemento_fornecedor FROM entradas INNER JOIN fornecedores ON entradas.id_fornecedor_entrada = fornecedores.id_fornecedor';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/estoque', function () use ($app) {
	$app->get('/{programa_entrada}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT alimentos.descricao_alimento, alimentos.tipo_alimento, alimentos.tipo_distribuicao_alimento, alimentos.unidade_alimento, SUM(entradas_itens_entrada.quantidade_comprada_itensentrada) - SUM(entradas_itens_entrada.quantidade_distribuida_itensentrada) AS disponivel_estoque FROM entradas_itens_entrada INNER JOIN alimentos ON entradas_itens_entrada.id_alimento_itensentrada = alimentos.id_alimento INNER JOIN entradas ON entradas_itens_entrada.id_entrada_itensentrada = entradas.id_entrada WHERE entradas.programa_entrada = :programa_entrada GROUP BY entradas_itens_entrada.id_alimento_itensentrada';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('programa_entrada', $arguments['programa_entrada'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/testesdeaceitabilidade', function () use ($app) {
	$app->get('/escolas', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT testes_aceitabilidade.id_testeaceitabilidade, escolas.nome_escola, escolas.tipo_escola FROM escolas INNER JOIN testes_aceitabilidade ON escolas.id_escola = testes_aceitabilidade.id_escola_testeaceitabilidade WHERE escolas.status_escola = 1 AND testes_aceitabilidade.fim_periodo_testeaceitabilidade >= CURDATE() AND testes_aceitabilidade.inicio_periodo_testeaceitabilidade >= CURDATE() AND testes_aceitabilidade.quantitativo_afazer_testeaceitabilidade > testes_aceitabilidade.quantitativo_realizado_testeaceitabilidade';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('/respostas', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO testes_aceitabilidade_resposta (testes_aceitabilidade_resposta.id_testeaceitabilidade_testeaceitabilidaderesposta, testes_aceitabilidade_resposta.serie_testeaceitabilidaderesposta, testes_aceitabilidade_resposta.turno_testeaceitabilidaderesposta, testes_aceitabilidade_resposta.resposta_testeaceitabilidaderesposta) VALUES (:id_testeaceitabilidade_testeaceitabilidaderesposta, :serie_testeaceitabilidaderesposta, :turno_testeaceitabilidaderesposta, :resposta_testeaceitabilidaderesposta)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_testeaceitabilidade_testeaceitabilidaderesposta', $data['id_testeaceitabilidade_testeaceitabilidaderesposta'], PDO::PARAM_INT);
			$stmt->bindParam('serie_testeaceitabilidaderesposta', $data['serie_testeaceitabilidaderesposta'], PDO::PARAM_STR);
			$stmt->bindParam('turno_testeaceitabilidaderesposta', $data['turno_testeaceitabilidaderesposta'], PDO::PARAM_STR);
			$stmt->bindParam('resposta_testeaceitabilidaderesposta', $data['resposta_testeaceitabilidaderesposta'], PDO::PARAM_STR);
			$stmt->execute();
			$data['id_testeaceitabilidaderesposta'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->get('/respostas/{id_testeaceitabilidade}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT testes_aceitabilidade_resposta.serie_testeaceitabilidaderesposta, testes_aceitabilidade_resposta.turno_testeaceitabilidaderesposta, testes_aceitabilidade_resposta.resposta_testeaceitabilidaderesposta FROM testes_aceitabilidade_resposta WHERE testes_aceitabilidade_resposta.id_testeaceitabilidade_testeaceitabilidaderesposta = :id_testeaceitabilidade';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_testeaceitabilidade', $arguments['id_testeaceitabilidade'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado, JSON_NUMERIC_CHECK));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO testes_aceitabilidade (testes_aceitabilidade.id_escola_testeaceitabilidade, testes_aceitabilidade.quantitativo_afazer_testeaceitabilidade, testes_aceitabilidade.inicio_periodo_testeaceitabilidade, testes_aceitabilidade.fim_periodo_testeaceitabilidade) VALUES (:id_escola_testeaceitabilidade, :quantitativo_afazer_testeaceitabilidade, :inicio_periodo_testeaceitabilidade, :fim_periodo_testeaceitabilidade)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_escola_testeaceitabilidade', $data['id_escola_testeaceitabilidade'], PDO::PARAM_INT);
			$stmt->bindParam('quantitativo_afazer_testeaceitabilidade', $data['quantitativo_afazer_testeaceitabilidade'], PDO::PARAM_INT);
			$stmt->bindParam('inicio_periodo_testeaceitabilidade', $data['inicio_periodo_testeaceitabilidade']);
			$stmt->bindParam('fim_periodo_testeaceitabilidade', $data['fim_periodo_testeaceitabilidade']);
			$stmt->execute();
			$data['id_testeaceitabilidade'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/{id_testeaceitabilidade}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT escolas.nome_escola, escolas.tipo_escola, testes_aceitabilidade.quantitativo_afazer_testeaceitabilidade, testes_aceitabilidade.quantitativo_realizado_testeaceitabilidade, testes_aceitabilidade.inicio_periodo_testeaceitabilidade, testes_aceitabilidade.fim_periodo_testeaceitabilidade FROM testes_aceitabilidade INNER JOIN escolas ON testes_aceitabilidade.id_escola_testeaceitabilidade = escolas.id_escola WHERE testes_aceitabilidade.id_testeaceitabilidade = :id_testeaceitabilidade';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_testeaceitabilidade', $arguments['id_testeaceitabilidade'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado, JSON_NUMERIC_CHECK));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT testes_aceitabilidade.id_testeaceitabilidade, escolas.nome_escola, escolas.tipo_escola, testes_aceitabilidade.quantitativo_afazer_testeaceitabilidade, testes_aceitabilidade.quantitativo_realizado_testeaceitabilidade, testes_aceitabilidade.inicio_periodo_testeaceitabilidade, testes_aceitabilidade.fim_periodo_testeaceitabilidade FROM testes_aceitabilidade INNER JOIN escolas ON testes_aceitabilidade.id_escola_testeaceitabilidade = escolas.id_escola';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->delete('/{id_testeaceitabilidade}', function (Request $request, Response $response, array $arguments) {
		$sql = 'DELETE FROM testes_aceitabilidade WHERE testes_aceitabilidade.id_testeaceitabilidade = :id_testeaceitabilidade';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_testeaceitabilidade', $arguments['id_testeaceitabilidade'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/dashboard', function () use ($app) {
	$app->get('/alimentos', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT alimentos.descricao_alimento, alimentos.tipo_alimento, alimentos.tipo_distribuicao_alimento, entradas.programa_entrada, SUM(entradas_itens_entrada.quantidade_comprada_itensentrada) AS quantidade_comprada_itensentrada, SUM(entradas_itens_entrada.quantidade_distribuida_itensentrada) AS quantidade_distribuida_itensentrada FROM entradas_itens_entrada INNER JOIN entradas ON entradas_itens_entrada.id_entrada_itensentrada = entradas.id_entrada INNER JOIN alimentos ON alimentos.id_alimento = entradas_itens_entrada.id_alimento_itensentrada WHERE (entradas_itens_entrada.quantidade_comprada_itensentrada - entradas_itens_entrada.quantidade_distribuida_itensentrada) <= alimentos.estoque_minimo_alimento AND (entradas_itens_entrada.quantidade_comprada_itensentrada - entradas_itens_entrada.quantidade_distribuida_itensentrada) <> 0.00 GROUP BY entradas.programa_entrada, entradas_itens_entrada.id_alimento_itensentrada';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->run();
