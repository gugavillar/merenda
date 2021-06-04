(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaEntradasCtrl(ListaEntradas, $filter) {
		var vm = this;

		$(document).ready(function () {
			$('.tooltipped').tooltip({ delay: 50 });
		});

		vm.guides = ListaEntradas;
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
			if (vm.query) {
				vm.guides = $filter('filter')(ListaEntradas, { num_nota: parseInt(vm.query) }, true);
			} else {
				vm.guides = ListaEntradas;
			}
		}
		vm.search = search;
	}
	ListaEntradasCtrl.$inject = ['ListaEntradas', '$filter'];

	angular.module('GMERENDA').controller('ListaEntradasCtrl', ListaEntradasCtrl);
}());