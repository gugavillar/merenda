(function () {
	'use strict';
	/*global M, angular, $*/
	function TestesAceitabilidadeCtrl(Escolas, TestesAceitabilidadeResource, dateFilter, $scope) {
		var vm = this, copy;
		vm.escolas = Escolas;

		function checkData() {
			if (vm.dados) {
				var dia = dateFilter(new Date(), 'yyyy-MM-dd');
				if (vm.dados.inicio_periodo_testeaceitabilidade < dia) {
					$('#inicio').val('').focus();
					delete vm.dados.inicio_periodo_testeaceitabilidade;
					$scope.$apply();
					M.toast({ html: 'A data inicial tem que ser superior a data de hoje', inDuration: 1500, classes: 'rounded noprint' });
				}
				if (vm.dados.fim_periodo_testeaceitabilidade) {
					var dataInicio = vm.dados.inicio_periodo_testeaceitabilidade.split('-'), dataFim = vm.dados.fim_periodo_testeaceitabilidade.split('-'), novoInicio, novoFim;
					novoInicio = dateFilter(new Date(dataInicio[0], dataInicio[1] - 1, dataInicio[2]), 'yyyy-MM-dd');
					novoFim = dateFilter(new Date(dataFim[0], dataFim[1] - 1, dataFim[2]), 'yyyy-MM-dd');
					if (novoFim < novoInicio) {
						$('#termino').val('').focus();
						delete vm.dados.fim_periodo_testeaceitabilidade;
						$scope.$apply();
						M.toast({ html: 'A data final tem que ser superior a data inicial', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			}
		}

		$(document).ready(function () {
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

		function cadastrar() {
			copy = angular.copy(vm.dados);
			delete vm.dados;
			TestesAceitabilidadeResource.testesAceitabilidade().save(copy).$promise.then(function (data) {
				if (data.id_testeaceitabilidade) {
					M.toast({ html: 'Teste de aceitabilidade cadastrado com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.cadastrar = cadastrar;
	}
	TestesAceitabilidadeCtrl.$inject = ['Escolas', 'TestesAceitabilidadeResource', 'dateFilter', '$scope'];

	angular.module('GMERENDA').controller('TestesAceitabilidadeCtrl', TestesAceitabilidadeCtrl);
}());