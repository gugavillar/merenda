(function () {
	'use strict';
	/*global M, angular, $*/
	function ImprimirGuiaSaidaCtrl(GuiaSaida, AlimentosGuiaSaida, $state) {
		var vm = this;
		vm.guia = GuiaSaida;
		vm.produtos = AlimentosGuiaSaida;

		function print() {
			M.toast({
				html: 'Preparando a impressão', inDuration: 1000, classes: 'rounded noprint', completeCallback: function () {
					window.print();
					$state.go('menu.listarsaidas');
				}
			});
		}
		vm.print = print;
	}
	ImprimirGuiaSaidaCtrl.$inject = ['GuiaSaida', 'AlimentosGuiaSaida', '$state'];

	angular.module('GMERENDA').controller('ImprimirGuiaSaidaCtrl', ImprimirGuiaSaidaCtrl);
}());