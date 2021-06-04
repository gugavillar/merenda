(function () {
	'use strict';
	/*global M, angular, $*/
	function ImprimirGuiaEntradaCtrl(GuiaEntrada, AlimentosGuiaEntrada, GuiasEntradasResource, $state, $location) {
		var vm = this;
		vm.guia = GuiaEntrada;
		vm.produtos = AlimentosGuiaEntrada;

		function print() {
			M.toast({
				html: 'Preparando a impressão', inDuration: 1000, classes: 'rounded noprint', completeCallback: function () {
					window.print();
					$state.go('menu.listarentradas');
				}
			});
		}
		vm.print = print;

		GuiasEntradasResource.anexoNota().get({ id_entrada_anexoentrada: vm.guia.id_entrada }).$promise.then(function (data) {
			if (data.local_anexoentrada) {
				vm.nota = $location.absUrl().replace(/#(\S+)/g, '') + 'api/media/notas/' + data.local_anexoentrada;
			}
		});
	}
	ImprimirGuiaEntradaCtrl.$inject = ['GuiaEntrada', 'AlimentosGuiaEntrada', 'GuiasEntradasResource', '$state', '$location'];

	angular.module('GMERENDA').controller('ImprimirGuiaEntradaCtrl', ImprimirGuiaEntradaCtrl);
}());