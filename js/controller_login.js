(function () {
	'use strict';
	/*global M, angular, $*/
	function LoginCtrl(LoginResource, $state, EscolasTesteAceitabilidade, $http) {
		var vm = this;
		vm.show = false;
		vm.testes = EscolasTesteAceitabilidade.length;
		LoginResource.delCred();

		$(document).ready(function () {
			$('#mudar').modal();
		});

		function reload() {
			$state.reload();
		}

		function entrar() {
			LoginResource.setCred().save(vm.dados).$promise.then(function (data) {
				if (data.flag === '0') {
					vm.dados.id = data.id;
					delete vm.dados.pass;
					$('#mudar').modal('open');
				} else if (data.token) {
					delete vm.dados;
					$http.defaults.headers.common.Authorization = data.token;
					sessionStorage.setItem('token', data.token);
					$state.go('menu.dashboard');
				} else {
					M.toast({ html: 'Usuário e Senha inválidos', inDuration: 1500, classes: 'rounded noprint', completeCallback: reload });
				}
			});
		}
		vm.entrar = entrar;

		function change() {
			$('#mudar').modal('close');
			LoginResource.setCred().update({ id: vm.dados.id }, vm.dados).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					M.toast({ html: 'Senha alterada com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: reload });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint', completeCallback: reload });
				}
			});
		}
		vm.change = change;
	}
	LoginCtrl.$inject = ['LoginResource', '$state', 'EscolasTesteAceitabilidade', '$http'];

	angular.module('GMERENDA').controller('LoginCtrl', LoginCtrl);
}());