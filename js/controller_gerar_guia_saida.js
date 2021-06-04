(function () {
	'use strict';
	/*global M, angular, $*/
	function GerarGuiaSaidaCtrl(Escolas, NotasDisponiveis, EscolasResource, GuiasSaidasResource, $filter) {
		var vm = this, copy, quantidade;
		vm.block = false;
		vm.blockestoque = false;
		vm.produtos = [];
		vm.alimentos = [];
		vm.notas = [];
		vm.escolas = Escolas;

		$(document).ready(function () {
			$('select').formSelect();
		});

		function bloqueio(bool) {
			vm.block = bool;
			$(document).ready(function () {
				$('select').formSelect();
			});
		}

		function bloqueioestoque(bool) {
			vm.blockestoque = bool;
			$(document).ready(function () {
				$('select').formSelect();
			});
		}

		function populateAlimentos(id_alimento) {
			return vm.alimentos.find(function (elem) {
				return (elem.id_alimento === id_alimento);
			});
		}

		function resta(id_alimento) {
			vm.alimentos.filter(function (elem) {
				if (elem.id_alimento === id_alimento) {
					GuiasSaidasResource.produtosNota().query({ id_entrada: elem.id_entrada_itensentrada }).$promise.then(function (data) {
						if (data.length) {
							data.filter(function (elemdata) {
								if (elemdata.id_alimento === id_alimento) {
									quantidade = parseFloat(elemdata.quantidade_comprada_itensentrada) - parseFloat(elemdata.quantidade_distribuida_itensentrada);
									if (elemdata.tipo_distribuicao_alimento === '1') {
										vm.show = '1';
										vm.itens.disponivel_estoque = $filter('tipoDistribuicao')(quantidade, elemdata.tipo_distribuicao_alimento);
									} else {
										vm.show = '2';
										vm.itens.disponivel_estoque = $filter('tipoDistribuicao')(quantidade, elemdata.tipo_distribuicao_alimento);
									}
									$(document).ready(function () {
										M.updateTextFields();
									});
								}
							});
						} else {
							M.toast({
								html: 'Estoque do produto acabou', inDuration: 1500, classes: 'rounded noprint'
							});
						}
					});
				}
			});
		}
		vm.resta = resta;

		function check() {
			if (vm.itens.disponivel_estoque) {
				if (quantidade < vm.itens.quantidade_saida_itenssaida) {
					M.toast({ html: 'Você não pode distribuir mais que o disponível', inDuration: 1500, classes: 'rounded noprint' });
					delete vm.itens.quantidade_saida_itenssaida;
				}
			}
		}
		vm.check = check;

		function cadastrar() {
			GuiasSaidasResource.guias().save(vm.dados).$promise.then(function (data) {
				if (data.id_saida) {
					vm.id_saida = data.id_saida;
					EscolasResource.get({ id_escola: vm.dados.id_escola_saida }).$promise.then(function (data) {
						NotasDisponiveis.filter(function (elem) {
							if (parseInt(data.tipo_escola, 10) <= 3) {
								if (elem.programa_entrada === '2') {
									elem.disabled = true;
								}
							} else {
								if (elem.programa_entrada === '1') {
									elem.disabled = true;
								}
							}
							vm.notas.push(elem);
						});
						M.toast({ html: 'Guia aberta com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: bloqueioestoque(true) });
					});
				} else {
					delete vm.dados;
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint', completeCallback: bloqueioestoque(false) });
				}
			});
		}
		vm.cadastrar = cadastrar;

		function getProdutosNota(id_entrada) {
			delete vm.produtosnota;
			GuiasSaidasResource.produtosNota().query({ id_entrada: id_entrada }).$promise.then(function (data) {
				vm.produtosnota = data;
			});
		}
		vm.getProdutosNota = getProdutosNota;

		function liberarProdutos() {
			copy = angular.copy(vm.nota);
			delete vm.nota;
			GuiasSaidasResource.produtosNota().query({ id_entrada: copy.id_entrada }).$promise.then(function (data) {
				if (vm.alimentos.length) {
					data.forEach(function (elemdata) {
						var boolean = populateAlimentos(elemdata.id_alimento);
						if (!boolean) {
							vm.alimentos.push(elemdata);
						}
					});
				} else {
					vm.alimentos = data;
				}
				vm.notas.filter(function (elem) {
					if (elem.id_entrada === copy.id_entrada) {
						elem.disabled = true;
					}
				});
				M.toast({ html: 'Produtos liberado', inDuration: 1500, classes: 'rounded noprint', completeCallback: bloqueio(true) });
			});
		}
		vm.liberarProdutos = liberarProdutos;

		function inserir() {
			vm.itens.id_saida_itenssaida = vm.id_saida;
			copy = angular.copy(vm.itens);
			delete vm.itens;
			vm.alimentos.filter(function (elem) {
				if (copy.id_alimento_itenssaida === elem.id_alimento) {
					copy.id_entrada_itenssaida = elem.id_entrada_itensentrada;
				}
			});
			GuiasSaidasResource.itensSaida().save(copy).$promise.then(function (data) {
				if (data.id_itenssaida) {
					vm.alimentos.filter(function (el) {
						if (el.id_alimento === copy.id_alimento_itenssaida) {
							el.disabled = true;
							$(document).ready(function () {
								$('select').formSelect();
							});
						}
					});
					GuiasSaidasResource.itensSaida().get({ id_itenssaida: data.id_itenssaida }).$promise.then(function (data) {
						vm.produtos.push(data);
					});
					M.toast({ html: 'Item inserido com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					var pattern = /DISTRIBUICAO ACIMA DA ENTRADA/g;
					if (pattern.test(data.erro)) {
						vm.alimentos.filter(function (el) {
							if (el.id_alimento === copy.id_alimento_itenssaida) {
								el.disabled = true;
								$(document).ready(function () {
									$('select').formSelect();
								});
							}
						});
						M.toast({
							html: 'Estoque do produto acabou', inDuration: 1500, classes: 'rounded noprint'
						});
					} else {
						M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			});
		}
		vm.inserir = inserir;

		function excluir(id_itenssaida, id_alimento) {
			GuiasSaidasResource.itensSaida().delete({ id_itenssaida: id_itenssaida }).$promise.then(function (data) {
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
					var pattern = /ENTRADA JA EXCLUIDA/g;
					if (pattern.test(data.erro)) {
						vm.alimentos.filter(function (el) {
							if (el.id_alimento === id_alimento) {
								delete el.disabled;
								$(document).ready(function () {
									$('select').formSelect();
								});
							}
						});
						M.toast({
							html: 'Item já excluído', inDuration: 1500, classes: 'rounded noprint'
						});
					} else {
						M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			});
		}
		vm.excluir = excluir;
	}

	GerarGuiaSaidaCtrl.$inject = ['Escolas', 'NotasDisponiveis', 'EscolasResource', 'GuiasSaidasResource', '$filter'];

	angular.module('GMERENDA').controller('GerarGuiaSaidaCtrl', GerarGuiaSaidaCtrl);
}());