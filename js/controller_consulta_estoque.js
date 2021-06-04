(function () {
	'use strict';
	/*global M, angular, $*/
	function ConsultarEstoqueCtrl(ConsultaEstoque, $stateParams) {
		var vm = this;
		vm.dia = new Date();
		vm.produtos = ConsultaEstoque;
		vm.tipo_programa_entrada = $stateParams.programa_entrada;
	}
	ConsultarEstoqueCtrl.$inject = ['ConsultaEstoque', '$stateParams'];

	angular.module('GMERENDA').controller('ConsultarEstoqueCtrl', ConsultarEstoqueCtrl);
}());