(function () {
	'use strict';
	/*global M, angular, $*/

	function DashboardCtrl(DashboardAlimentosEstoque) {
		var vm = this;
		vm.alimentosEstoque = DashboardAlimentosEstoque;
	}

	DashboardCtrl.$inject = ['DashboardAlimentosEstoque'];

	angular.module('GMERENDA').controller('DashboardCtrl', DashboardCtrl);
}());