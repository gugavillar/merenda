(function () {
	'use strict';
	/*global M, angular, $*/
	function RelatorioDistribuicaoCtrl(Notas, GuiasEntradasResource, RelatoriosResource) {
		var vm = this;
		vm.notas = Notas;

		$(document).ready(function () {
			$('select').formSelect();
		});

		function clean() {
			delete vm.gerado;
			delete vm.produtosnota;
			delete vm.produtosdistribuicao;
		}
		vm.clean = clean;

		function gerar() {
			vm.gerado = true;
			Notas.filter(function (elem) {
				if (elem.id_entrada === vm.dados.id_entrada) {
					vm.data = elem;
				}
			});
			GuiasEntradasResource.produtosEntrada().query({ id_entrada: vm.dados.id_entrada }).$promise.then(function (data) {
				vm.produtosnota = data;
			});
			RelatoriosResource.distribuicao().query({ id_entrada_itenssaida: vm.dados.id_entrada }).$promise.then(function (data) {
				vm.produtosdistribuicao = data;
			});
		}
		vm.gerar = gerar;
	}
	RelatorioDistribuicaoCtrl.$inject = ['Notas', 'GuiasEntradasResource', 'RelatoriosResource'];

	angular.module('GMERENDA').controller('RelatorioDistribuicaoCtrl', RelatorioDistribuicaoCtrl);
}());