(function () {
	'use strict';
	/*global angular*/
	function LoginResource($resource) {
		function setCred() {
			return $resource('api/login', null, {
				update: { method: 'PUT' }
			});
		}

		function chkCred() {
			var returnVal = false;
			if (sessionStorage.getItem('token')) {
				returnVal = true;
			}
			return returnVal;
		}

		function delCred() {
			sessionStorage.clear();
		}

		return {
			setCred: setCred,
			chkCred: chkCred,
			delCred: delCred
		};
	}
	LoginResource.$inject = ['$resource'];

	function EscolasResource($resource) {
		return $resource('api/escolas/:id_escola');
	}
	EscolasResource.$inject = ['$resource'];

	function AlimentosResource($resource) {
		return $resource('api/alimentos/:id_alimento');
	}
	AlimentosResource.$inject = ['$resource'];

	function FornecedoresResource($resource) {
		return $resource('api/fornecedores/:id_fornecedor');
	}
	FornecedoresResource.$inject = ['$resource'];

	function GuiasSaidasResource($resource) {
		function guias() {
			return $resource('api/guiassaida/:id_saida');
		}
		function produtosSaida() {
			return $resource('api/guiassaida/produtos/:id_saida');
		}
		function produtosNota() {
			return $resource('api/guiassaida/produtos/nota/:id_entrada');
		}
		function notas() {
			return $resource('api/guiassaida/distribuicao/notas');
		}
		function itensSaida() {
			return $resource('api/guiassaida/itens/:id_itenssaida');
		}

		return {
			guias: guias,
			produtosSaida: produtosSaida,
			produtosNota: produtosNota,
			notas: notas,
			itensSaida: itensSaida
		};
	}
	GuiasSaidasResource.$inject = ['$resource'];

	function GuiasEntradasResource($resource) {
		function guias() {
			return $resource('api/guiasentrada/:id_entrada');
		}
		function produtosEntrada() {
			return $resource('api/guiasentrada/produtos/:id_entrada');
		}
		function anexoNota() {
			return $resource('api/guiasentrada/anexo/:id_entrada_anexoentrada');
		}
		function itensEntrada() {
			return $resource('api/guiasentrada/itens/:id_itensentrada');
		}

		return {
			guias: guias,
			produtosEntrada: produtosEntrada,
			anexoNota: anexoNota,
			itensEntrada: itensEntrada
		};
	}
	GuiasEntradasResource.$inject = ['$resource'];

	function RelatoriosResource($resource) {
		function escolas() {
			return $resource('api/relatorio/escolas/:id_escola/:inicio_periodo/:fim_periodo');
		}
		function tipoEscola() {
			return $resource('api/relatorio/tipo/escola/:tipo_escola/:inicio_periodo/:fim_periodo');
		}
		function distribuicao() {
			return $resource('api/relatorio/distribuicao/:id_entrada_itenssaida');
		}
		function programa() {
			return $resource('api/relatorio/programa/:programa_entrada/:inicio_periodo/:fim_periodo');
		}
		function fornecedor() {
			return $resource('api/relatorio/fornecedor/:id_fornecedor/:programa_entrada/:inicio_periodo/:fim_periodo');
		}
		function notas() {
			return $resource('api/relatorio/notas');
		}

		return {
			escolas: escolas,
			tipoEscola: tipoEscola,
			distribuicao: distribuicao,
			programa: programa,
			fornecedor: fornecedor,
			notas: notas
		};
	}
	RelatoriosResource.$inject = ['$resource'];

	function EstoqueResource($resource) {
		return $resource('api/estoque/:programa_entrada');
	}
	EstoqueResource.$inject = ['$resource'];

	function TestesAceitabilidadeResource($resource) {
		function testesAceitabilidade() {
			return $resource('api/testesdeaceitabilidade/:id_testeaceitabilidade');
		}
		function escolasTestesAceitabilidade() {
			return $resource('api/testesdeaceitabilidade/escolas');
		}
		function respostasTestesAceitabilidade() {
			return $resource('api/testesdeaceitabilidade/respostas/:id_testeaceitabilidade');
		}

		return {
			testesAceitabilidade: testesAceitabilidade,
			escolasTestesAceitabilidade: escolasTestesAceitabilidade,
			respostasTestesAceitabilidade: respostasTestesAceitabilidade
		};
	}
	TestesAceitabilidadeResource.$inject = ['$resource'];

	function DashboardResource($resource) {
		return $resource('api/dashboard/alimentos');
	}
	DashboardResource.$inject = ['$resource'];

	angular.module('GMERENDA').factory('LoginResource', LoginResource).factory('EscolasResource', EscolasResource).factory('AlimentosResource', AlimentosResource).factory('FornecedoresResource', FornecedoresResource).factory('GuiasSaidasResource', GuiasSaidasResource).factory('GuiasEntradasResource', GuiasEntradasResource).factory('RelatoriosResource', RelatoriosResource).factory('EstoqueResource', EstoqueResource).factory('TestesAceitabilidadeResource', TestesAceitabilidadeResource).factory('DashboardResource', DashboardResource);
}());