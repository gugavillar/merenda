(function () {
	'use strict';
	/*global M, angular, $*/
	function RelatorioEntradaProgramaCtrl(RelatoriosResource, dateFilter, $scope) {
		var vm = this;

		function checkData() {
			if (vm.dados) {
				if (vm.dados.fim_periodo) {
					var dataInicio = vm.dados.inicio_periodo.split('-'), dataFim = vm.dados.fim_periodo.split('-'), novoInicio, novoFim;
					novoInicio = dateFilter(new Date(dataInicio[0], dataInicio[1] - 1, dataInicio[2]), 'yyyy-MM-dd');
					novoFim = dateFilter(new Date(dataFim[0], dataFim[1] - 1, dataFim[2]), 'yyyy-MM-dd');
					if (novoFim < novoInicio) {
						$('#fim').val('').focus();
						delete vm.dados.fim_periodo;
						$scope.$apply();
						M.toast({ html: 'A data final tem que ser superior a data inicial', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			}
		}

		$(document).ready(function () {
			$('#resposta').modal();
			$('select').formSelect();
			$('.timepicker').timepicker({
				i18n: {
					cancel: 'Sair',
					done: 'Ok'
				},
				twelveHour: false
			});
			$('.datepicker').datepicker({
				i18n: {
					months: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
					monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
					weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
					weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
					weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
					today: 'Hoje',
					clear: 'Limpar',
					cancel: 'Sair',
					done: 'Ok',
					labelMonthNext: 'Próximo mês',
					labelMonthPrev: 'Mês anterior',
					labelMonthSelect: 'Selecione um mês',
					labelYearSelect: 'Selecione um ano'
				},
				format: 'dd/mm/yyyy',
				disableWeekends: true,
				onClose: function () {
					checkData();
				}
			});
		});

		function clean() {
			delete vm.dados.inicio_periodo;
			delete vm.dados.fim_periodo;
			delete vm.gerado;
			delete vm.produtos;
		}
		vm.clean = clean;

		function gerar() {
			RelatoriosResource.programa().query({ programa_entrada: vm.dados.programa_entrada, inicio_periodo: vm.dados.inicio_periodo, fim_periodo: vm.dados.fim_periodo }).$promise.then(function (data) {
				if (data.$resolved && data.length >= 1) {
					vm.produtos = data;
					vm.gerado = true;
				} else {
					$('#resposta').modal('open');
				}
			});
		}
		vm.gerar = gerar;
	}
	RelatorioEntradaProgramaCtrl.$inject = ['RelatoriosResource', 'dateFilter', '$scope'];

	angular.module('GMERENDA').controller('RelatorioEntradaProgramaCtrl', RelatorioEntradaProgramaCtrl);
}());