(function () {
	'use strict';
	/*global M, angular, $*/
	function GerarGuiaEntradaCtrl(Fornecedores, Alimentos, Upload, GuiasEntradasResource) {
		var vm = this, copy;
		vm.block = false;
		vm.produtos = [];
		vm.fornecedores = Fornecedores;
		vm.alimentos = Alimentos;
		vm.show = '1';

		function selectTipo(id_alimento) {
			delete vm.itens.quantidade_comprada_itensentrada;
			Alimentos.filter(function (elem) {
				if (elem.id_alimento === id_alimento) {
					if (elem.tipo_distribuicao_alimento === '1') {
						vm.show = '1';
					} else {
						vm.show = '2';
					}
				}
			});
		}
		vm.selectTipo = selectTipo;

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
				disableWeekends: true
			});
		});

		function bloqueio(bool) {
			vm.block = bool;
			$(document).ready(function () {
				$('select').formSelect();
			});
		}

		function uploadFile(id_entrada_anexoentrada, id_fornecedor_anexoentrada, num_nota_entrada_anexoentrada) {
			Upload.upload({
				url: 'api/guiasentrada/anexo',
				method: 'POST',
				data: { file: vm.file, id_entrada_anexoentrada: id_entrada_anexoentrada, id_fornecedor_anexoentrada: id_fornecedor_anexoentrada, num_nota_entrada_anexoentrada: num_nota_entrada_anexoentrada }
			}).then(function (resp) {
				if (resp.data.id_anexoentrada) {
					M.toast({ html: 'Nota anexada com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}

		function cadastrar() {
			GuiasEntradasResource.guias().save(vm.dados).$promise.then(function (data) {
				if (data.id_entrada) {
					vm.id_entrada = data.id_entrada;
					M.toast({ html: 'Guia de Estoque aberta com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: bloqueio(true) });
					if (vm.file) {
						uploadFile(data.id_entrada, vm.dados.id_fornecedor_entrada, vm.dados.num_nota_entrada);
					}
				} else {
					delete vm.dados;
					var pattern = /UNICA NOTA POR FORNECEDOR/g;
					if (pattern.test(data.erro)) {
						M.toast({ html: 'Nota já cadastrada', inDuration: 1500, classes: 'rounded noprint' });
					} else {
						M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			});
		}
		vm.cadastrar = cadastrar;

		function inserir() {
			vm.itens.id_entrada_itensentrada = vm.id_entrada;
			copy = angular.copy(vm.itens);
			delete vm.itens;
			GuiasEntradasResource.itensEntrada().save(copy).$promise.then(function (data) {
				if (data.id_itensentrada) {
					vm.alimentos.filter(function (el) {
						if (el.id_alimento === copy.id_alimento_itensentrada) {
							el.disabled = true;
							$(document).ready(function () {
								$('select').formSelect();
							});
						}
					});
					GuiasEntradasResource.itensEntrada().get({ id_itensentrada: data.id_itensentrada }).$promise.then(function (data) {
						vm.produtos.push(data);
					});
					M.toast({ html: 'Item inserido com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.inserir = inserir;

		function excluir(id_itensentrada, id_alimento) {
			GuiasEntradasResource.itensEntrada().delete({ id_itensentrada: id_itensentrada }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.produtos = vm.produtos.filter(function (el) {
						if (el.id_alimento !== id_alimento) {
							return el;
						}
					});
					vm.alimentos.filter(function (el) {
						if (el.id_alimento === id_alimento) {
							delete el.disabled;
							$(document).ready(function () {
								$('select').formSelect();
							});
						}
					});
					M.toast({ html: 'Item excluído com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma Falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.excluir = excluir;
	}
	GerarGuiaEntradaCtrl.$inject = ['Fornecedores', 'Alimentos', 'Upload', 'GuiasEntradasResource'];

	angular.module('GMERENDA').controller('GerarGuiaEntradaCtrl', GerarGuiaEntradaCtrl);
}());