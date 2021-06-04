(function () {
	'use strict';
	/*global M, angular, $*/
	function MenuTesteCtrl($state) {
		var vm = this;
		$(document).ready(function () {
			$('.sidenav').sidenav({
				draggable: true
			});
			$('.sidenav-close').click(function () {
				$('.sidenav').sidenav('close');
			});
		});

		function logout() {
			$state.go('login');
		}
		vm.logout = logout;
	}
	MenuTesteCtrl.$inject = ['$state'];

	angular.module('GMERENDA').controller('MenuTesteCtrl', MenuTesteCtrl);
}());