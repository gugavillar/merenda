(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaEscolasCtrl(Escolas, EscolasResource, $filter) {
		var vm = this;

		$(document).ready(function () {
			$('#excluir_escola').modal();
			$('.tooltipped').tooltip({ delay: 50 });
		});

		vm.escolas = Escolas;
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
			vm.escolas = $filter('filter')(Escolas, { nome_escola: vm.query });
		}
		vm.search = search;

		function modal(escola) {
			vm.modal_data = escola;
			$('#excluir_escola').modal('open');
		}
		vm.modal = modal;

		function excluir(id_escola) {
			EscolasResource.delete({ id_escola: id_escola }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.escolas = vm.escolas.filter(function (elem) {
						if (elem.id_escola !== id_escola) {
							return elem;
						}
					});
					M.toast({ html: 'Escola excluída com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.excluir = excluir;
	}
	ListaEscolasCtrl.$inject = ['Escolas', 'EscolasResource', '$filter'];

	angular.module('GMERENDA').controller('ListaEscolasCtrl', ListaEscolasCtrl);
}());