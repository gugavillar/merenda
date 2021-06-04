(function () {
	'use strict';
	/*global M, angular, $*/
	function EscolasCtrl(EscolasResource, $http) {
		var vm = this, copy;

		$(document).ready(function () {
			$('select').formSelect();
		});

		function getEndereco(cep) {
			if (cep) {
				delete $http.defaults.headers.common.Authorization;
				$http.get('https://viacep.com.br/ws/' + cep + '/json/').then(function (data) {
					if (data.erro !== true) {
						var endereco = data;
						vm.novo.logradouro_escola = endereco.data.logradouro.toUpperCase();
						vm.novo.bairro_escola = endereco.data.bairro.toUpperCase();
						$(document).ready(function () {
							M.updateTextFields();
						});
					}
				});
			}
		}
		vm.getEndereco = getEndereco;

		function cadastrar() {
			copy = angular.copy(vm.novo);
			delete vm.novo;
			$http.defaults.headers.common.Authorization = sessionStorage.getItem('token');
			EscolasResource.save(copy).$promise.then(function (data) {
				if (data.id_escola) {
					M.toast({ html: 'Escola cadastrada com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.cadastrar = cadastrar;
	}
	EscolasCtrl.$inject = ['EscolasResource', '$http'];

	angular.module('GMERENDA').controller('EscolasCtrl', EscolasCtrl);
}());