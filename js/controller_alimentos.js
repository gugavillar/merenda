(function () {
	'use strict';
	/*global M, angular, $*/
	function AlimentosCtrl(AlimentosResource) {
		var vm = this, copy;
		vm.novo = { tipo_distribuicao_alimento: '1' };
		vm.show = '1';

		$(document).ready(function () {
			$('select').formSelect();
		});

		function selectTipo() {
			if (vm.novo.estoque_minimo_alimento) {
				delete vm.novo.estoque_minimo_alimento;
			}
			if (vm.novo.tipo_distribuicao_alimento === '1') {
				vm.show = '1';
			} else {
				vm.show = '2';
			}
		}
		vm.selectTipo = selectTipo;

		function cadastrar() {
			copy = angular.copy(vm.novo);
			delete vm.novo;
			AlimentosResource.save(copy).$promise.then(function (data) {
				if (data.id_alimento) {
					M.toast({ html: 'Alimento cadastrado com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					var pattern = /ALIMENTO UNICO/g;
					if (pattern.test(data.erro)) {
						M.toast({ html: 'Alimento já cadastrado', inDuration: 1500, classes: 'rounded noprint' });
					} else {
						M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			});
		}
		vm.cadastrar = cadastrar;
	}
	AlimentosCtrl.$inject = ['AlimentosResource'];

	angular.module('GMERENDA').controller('AlimentosCtrl', AlimentosCtrl);
}());