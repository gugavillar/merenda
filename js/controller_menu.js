(function () {
	'use strict';
	/*global M, angular, $*/
	function MenuCtrl(LoginResource, $state) {
		var vm = this;

		$(document).ready(function () {
			$('.dropdown-trigger').dropdown({
				coverTrigger: false
			});
			$('.sidenav').sidenav({
				draggable: true
			});
			$('.sidenav-close').click(function () {
				$('.sidenav').sidenav('close');
			});
		});

		function logout() {
			LoginResource.delCred();
			$state.go('login');
		}
		vm.logout = logout;
	}
	MenuCtrl.$inject = ['LoginResource', '$state'];

	angular.module('GMERENDA').controller('MenuCtrl', MenuCtrl);
}());