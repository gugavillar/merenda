(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaAlimentosCtrl(Alimentos, AlimentosResource, $filter) {
		var vm = this;

		$(document).ready(function () {
			$('.tooltipped').tooltip({ delay: 50 });
			$('#excluir_produto').modal();
		});

		vm.alimentos = Alimentos;
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

		function search() {
			vm.alimentos = $filter('filter')(Alimentos, { descricao_alimento: vm.query });
		}
		vm.search = search;

		function modal(alimento) {
			vm.modal_data = alimento;
			$('#excluir_produto').modal('open');
		}
		vm.modal = modal;

		function excluir(id_alimento) {
			AlimentosResource.delete({ id_alimento: id_alimento }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.alimentos = vm.alimentos.filter(function (elem) {
						if (elem.id_alimento !== id_alimento) {
							return elem;
						}
					});
					M.toast({ html: 'Alimento excluído com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.excluir = excluir;
	}
	ListaAlimentosCtrl.$inject = ['Alimentos', 'AlimentosResource', '$filter'];

	angular.module('GMERENDA').controller('ListaAlimentosCtrl', ListaAlimentosCtrl);
}());