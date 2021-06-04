(function () {
	'use strict';
	/*global M, angular, $*/
	function RealizarTesteCtrl(EscolasTesteAceitabilidade, TestesAceitabilidadeResource) {
		var vm = this, copy;
		vm.class = { um: false, dois: false, tres: false, quatro: false, cinco: false };
		vm.escolas = EscolasTesteAceitabilidade;

		$(document).ready(function () {
			$('#alert').modal({ dismissible: false });
			$('#confirmation').modal({ dismissible: false });
			$('#end').modal({ dismissible: false });
			$('select').formSelect();

			if (!EscolasTesteAceitabilidade.length) {
				$('#alert').modal('open');
			}
		});

		function select(num, prop) {
			if (vm.dados) {
				vm.dados.resposta_testeaceitabilidaderesposta = num;
			} else {
				vm.dados = { resposta_testeaceitabilidaderesposta: num };
			}
			Object.keys(vm.class).filter(function (elem) {
				if (elem === prop) {
					vm.class[elem] = true;
				} else {
					vm.class[elem] = false;
				}
			});
		}
		vm.select = select;

		function clear(id_testeaceitabilidade) {
			TestesAceitabilidadeResource.testesAceitabilidade().get({ id_testeaceitabilidade: id_testeaceitabilidade }).$promise.then(function (data) {
				if (data.quantitativo_afazer_testeaceitabilidade === data.quantitativo_realizado_testeaceitabilidade) {
					$('#end').modal('open');
				}
			});
		}

		function salvar() {
			copy = angular.copy(vm.dados);
			delete vm.dados;
			Object.keys(vm.class).filter(function (elem) {
				vm.class[elem] = false;
			});
			vm.block = true;
			TestesAceitabilidadeResource.respostasTestesAceitabilidade().save(copy).$promise.then(function (data) {
				if (data.id_testeaceitabilidaderesposta) {
					M.toast({ html: 'Teste finalizado com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: clear(data.id_testeaceitabilidade_testeaceitabilidaderesposta) });
				} else {
					var pattern = /TOTAL DE TESTES REALIZADOS/g;
					if (pattern.test(data.erro)) {
						M.toast({
							html: 'Total de testes já realizado', inDuration: 1500, classes: 'rounded noprint', completeCallback: clear(copy.id_testeaceitabilidade_testeaceitabilidaderesposta)
						});
					} else {
						M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			});
		}
		vm.salvar = salvar;

		function finalizar() {
			EscolasTesteAceitabilidade.filter(function (elem) {
				if (elem.id_testeaceitabilidade === vm.dados.id_testeaceitabilidade_testeaceitabilidaderesposta) {
					vm.dados.nome_escola = elem.nome_escola;
				}
			});
			$('#confirmation').modal('open');
		}
		vm.finalizar = finalizar;
	}
	RealizarTesteCtrl.$inject = ['EscolasTesteAceitabilidade', 'TestesAceitabilidadeResource'];

	angular.module('GMERENDA').controller('RealizarTesteCtrl', RealizarTesteCtrl);
}());