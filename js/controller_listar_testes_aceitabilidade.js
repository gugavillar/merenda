(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaTestesAceitabilidadeCtrl(ListaTestes, TestesAceitabilidadeResource) {
		var vm = this;
		vm.testes = ListaTestes;

		$(document).ready(function () {
			$('.tooltipped').tooltip({ delay: 50 });
			$('#excluir_teste').modal();
		});

		vm.config = {
			itemsPerPage: 5,
			fillLastPage: true,
			maxPages: 5,
			paginatorLabels: {
				first: '<<',
				last: '>>',
				stepBack: '<',
				stepAhead: '>'
			}
		};

		function modal(id_testeaceitabilidade) {
			vm.modal_data = { id_testeaceitabilidade: id_testeaceitabilidade };
			$('#excluir_teste').modal('open');
		}
		vm.modal = modal;

		function excluir(id_testeaceitabilidade) {
			TestesAceitabilidadeResource.testesAceitabilidade().delete({ id_testeaceitabilidade: id_testeaceitabilidade }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.testes = vm.testes.filter(function (elem) {
						if (elem.id_testeaceitabilidade !== id_testeaceitabilidade) {
							return elem;
						}
					});
					M.toast({ html: 'Teste excluído com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.excluir = excluir;

	}
	ListaTestesAceitabilidadeCtrl.$inject = ['ListaTestes', 'TestesAceitabilidadeResource'];

	angular.module('GMERENDA').controller('ListaTestesAceitabilidadeCtrl', ListaTestesAceitabilidadeCtrl);
}());