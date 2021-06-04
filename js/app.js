(function () {
	'use strict';
	/*global angular, $*/

	function getAlimentos(AlimentosResource) {
		return AlimentosResource.query().$promise;
	}
	getAlimentos.$inject = ['AlimentosResource'];

	function getEscolas(EscolasResource) {
		return EscolasResource.query().$promise;
	}
	getEscolas.$inject = ['EscolasResource'];

	function getFornecedores(FornecedoresResource) {
		return FornecedoresResource.query().$promise;
	}
	getFornecedores.$inject = ['FornecedoresResource'];

	function getListaSaidas(GuiasSaidasResource) {
		return GuiasSaidasResource.guias().query().$promise;
	}
	getListaSaidas.$inject = ['GuiasSaidasResource'];

	function getGuiaSaida(GuiasSaidasResource, $stateParams) {
		return GuiasSaidasResource.guias().get({ id_saida: $stateParams.id_saida }).$promise;
	}
	getGuiaSaida.$inject = ['GuiasSaidasResource', '$stateParams'];

	function getAlimentosGuiaSaida(GuiasSaidasResource, $stateParams) {
		return GuiasSaidasResource.produtosSaida().query({ id_saida: $stateParams.id_saida }).$promise;
	}
	getAlimentosGuiaSaida.$inject = ['GuiasSaidasResource', '$stateParams'];

	function getListaEntradas(GuiasEntradasResource) {
		return GuiasEntradasResource.guias().query().$promise;
	}
	getListaEntradas.$inject = ['GuiasEntradasResource'];

	function getGuiaEntrada(GuiasEntradasResource, $stateParams) {
		return GuiasEntradasResource.guias().get({ id_entrada: $stateParams.id_entrada }).$promise;
	}
	getGuiaEntrada.$inject = ['GuiasEntradasResource', '$stateParams'];

	function getAlimentosGuiaEntradaResource(GuiasEntradasResource, $stateParams) {
		return GuiasEntradasResource.produtosEntrada().query({ id_entrada: $stateParams.id_entrada }).$promise;
	}
	getAlimentosGuiaEntradaResource.$inject = ['GuiasEntradasResource', '$stateParams'];

	function getEstoque(EstoqueResource, $stateParams) {
		return EstoqueResource.query({ programa_entrada: $stateParams.programa_entrada }).$promise;
	}
	getEstoque.$inject = ['EstoqueResource', '$stateParams'];

	function getNotasDisponiveis(GuiasSaidasResource) {
		return GuiasSaidasResource.notas().query().$promise;
	}
	getNotasDisponiveis.$inject = ['GuiasSaidasResource'];

	function getNotasRelatorio(RelatoriosResource) {
		return RelatoriosResource.notas().query().$promise;
	}
	getNotasRelatorio.$inject = ['RelatoriosResource'];

	function getEscolasTesteAceitabilidade(TestesAceitabilidadeResource) {
		return TestesAceitabilidadeResource.escolasTestesAceitabilidade().query().$promise;
	}
	getEscolasTesteAceitabilidade.$inject = ['TestesAceitabilidadeResource'];

	function getListaTestes(TestesAceitabilidadeResource) {
		return TestesAceitabilidadeResource.testesAceitabilidade().query().$promise;
	}
	getListaTestes.$inject = ['TestesAceitabilidadeResource'];

	function getRespostasTesteAceitabilidade(TestesAceitabilidadeResource, $stateParams) {
		return TestesAceitabilidadeResource.respostasTestesAceitabilidade().query({ id_testeaceitabilidade: $stateParams.id_testeaceitabilidade }).$promise;
	}
	getRespostasTesteAceitabilidade.$inject = ['TestesAceitabilidadeResource', '$stateParams'];

	function getDadosTesteAceitabilidade(TestesAceitabilidadeResource, $stateParams) {
		return TestesAceitabilidadeResource.testesAceitabilidade().get({ id_testeaceitabilidade: $stateParams.id_testeaceitabilidade }).$promise;
	}
	getDadosTesteAceitabilidade.$inject = ['TestesAceitabilidadeResource', '$stateParams'];

	function getDashboard(DashboardResource) {
		return DashboardResource.query().$promise;
	}
	getDashboard.$inject = ['DashboardResource'];

	function configuration($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'dist/partials/login.html',
				controller: 'LoginCtrl as login',
				resolve: {
					EscolasTesteAceitabilidade: getEscolasTesteAceitabilidade
				},
				data: {
					auth: false
				}
			})
			.state('menuteste', {
				url: '/menuteste',
				templateUrl: 'dist/partials/menu_teste.html',
				controller: 'MenuTesteCtrl as menu',
				abstract: true,
				data: {
					auth: false
				}
			})
			.state('menuteste.realizarteste', {
				url: '/realizarteste',
				templateUrl: 'dist/partials/realizar_teste.html',
				controller: 'RealizarTesteCtrl as realizarteste',
				resolve: {
					EscolasTesteAceitabilidade: getEscolasTesteAceitabilidade
				},
				data: {
					auth: false
				}
			})
			.state('menu', {
				url: '/menu',
				templateUrl: 'dist/partials/menu.html',
				controller: 'MenuCtrl as menu',
				abstract: true,
				data: {
					auth: true
				}
			})
			.state('menu.dashboard', {
				url: '/dashboard',
				templateUrl: 'dist/partials/dashboard.html',
				controller: 'DashboardCtrl as dashboard',
				resolve: {
					DashboardAlimentosEstoque: getDashboard
				},
				data: {
					auth: true
				}
			})
			.state('menu.escolas', {
				url: '/escolas',
				templateUrl: 'dist/partials/escolas.html',
				controller: 'EscolasCtrl as escola',
				data: {
					auth: true
				}
			})
			.state('menu.alimentos', {
				url: '/alimentos',
				templateUrl: 'dist/partials/alimentos.html',
				controller: 'AlimentosCtrl as alimento',
				data: {
					auth: true
				}
			})
			.state('menu.fornecedores', {
				url: '/fornecedores',
				templateUrl: 'dist/partials/fornecedores.html',
				controller: 'FornecedoresCtrl as fornecedor',
				data: {
					auth: true
				}
			})
			.state('menu.testesdeaceitabilidade', {
				url: '/testesdeaceitabilidade',
				templateUrl: 'dist/partials/testes_aceitabilidade.html',
				controller: 'TestesAceitabilidadeCtrl as teste',
				resolve: {
					Escolas: getEscolas
				},
				data: {
					auth: true
				}
			})
			.state('menu.gerarguiasaida', {
				url: '/gerarguiasaida',
				templateUrl: 'dist/partials/gerar_guia_saida.html',
				controller: 'GerarGuiaSaidaCtrl as gerar',
				resolve: {
					Escolas: getEscolas,
					NotasDisponiveis: getNotasDisponiveis
				},
				data: {
					auth: true
				}
			})
			.state('menu.gerarguiaentrada', {
				url: '/gerarguiaentrada',
				templateUrl: 'dist/partials/gerar_guia_entrada.html',
				controller: 'GerarGuiaEntradaCtrl as gerar',
				resolve: {
					Fornecedores: getFornecedores,
					Alimentos: getAlimentos
				},
				data: {
					auth: true
				}
			})
			.state('menu.listarsaidas', {
				url: '/listarsaidas',
				templateUrl: 'dist/partials/listar_saidas.html',
				controller: 'ListaSaidasCtrl as lista',
				resolve: {
					ListaSaidas: getListaSaidas
				},
				data: {
					auth: true
				}
			})
			.state('menu.listarentradas', {
				url: '/listarentradas',
				templateUrl: 'dist/partials/listar_entradas.html',
				controller: 'ListaEntradasCtrl as lista',
				data: {
					auth: true
				},
				resolve: {
					ListaEntradas: getListaEntradas
				}
			})
			.state('menu.listarescolas', {
				url: '/listarescolas',
				templateUrl: 'dist/partials/listar_escolas.html',
				controller: 'ListaEscolasCtrl as lista',
				resolve: {
					Escolas: getEscolas
				},
				data: {
					auth: true
				}
			})
			.state('menu.listaralimentos', {
				url: '/listaralimentos',
				templateUrl: 'dist/partials/listar_alimentos.html',
				controller: 'ListaAlimentosCtrl as lista',
				resolve: {
					Alimentos: getAlimentos
				},
				data: {
					auth: true
				}
			})
			.state('menu.listarfornecedores', {
				url: '/listarfornecedores',
				templateUrl: 'dist/partials/listar_fornecedores.html',
				controller: 'ListaFornecedoresCtrl as lista',
				resolve: {
					Fornecedores: getFornecedores
				},
				data: {
					auth: true
				}
			})
			.state('menu.listartestesdeaceitabilidade', {
				url: '/listartestesdeaceitabilidade',
				templateUrl: 'dist/partials/listar_testes_aceitabilidade.html',
				controller: 'ListaTestesAceitabilidadeCtrl as lista',
				resolve: {
					ListaTestes: getListaTestes
				},
				data: {
					auth: true
				}
			})
			.state('menu.relatorioporescola', {
				url: '/relatorioporescolas',
				templateUrl: 'dist/partials/relatorio_por_escola.html',
				controller: 'RelatorioPorEscolaCtrl as relatorio',
				resolve: {
					Escolas: getEscolas
				},
				data: {
					auth: true
				}
			})
			.state('menu.relatoriotipoescola', {
				url: '/relatoriotipoescola',
				templateUrl: 'dist/partials/relatorio_tipo_escola.html',
				controller: 'RelatorioTipoEscolaCtrl as relatorio',
				data: {
					auth: true
				}
			})
			.state('menu.relatoriodistribuicao', {
				url: '/relatoriodistribuicao',
				templateUrl: 'dist/partials/relatorio_distribuicao.html',
				controller: 'RelatorioDistribuicaoCtrl as relatorio',
				resolve: {
					Notas: getNotasRelatorio
				},
				data: {
					auth: true
				}
			})
			.state('menu.relatorioentradaprograma', {
				url: '/relatorioentradaprograma',
				templateUrl: 'dist/partials/relatorio_entrada_programa.html',
				controller: 'RelatorioEntradaProgramaCtrl as relatorio',
				data: {
					auth: true
				}
			})
			.state('menu.relatorioentradafornecedor', {
				url: '/relatorioentradafornecedor',
				templateUrl: 'dist/partials/relatorio_entrada_fornecedor.html',
				controller: 'RelatorioEntradaFornecedorCtrl as relatorio',
				resolve: {
					Fornecedores: getFornecedores
				},
				data: {
					auth: true
				}
			})
			.state('menu.estoque', {
				url: '/estoque/:programa_entrada',
				templateUrl: 'dist/partials/estoque_geral.html',
				controller: 'ConsultarEstoqueCtrl as estoque',
				resolve: {
					ConsultaEstoque: getEstoque
				},
				data: {
					auth: true
				}
			})
			.state('menu.editarguiasaida', {
				url: '/editarguiasaida/:id_saida',
				templateUrl: 'dist/partials/editar_guia_saida.html',
				controller: 'EditarGuiaSaidaCtrl as editar',
				resolve: {
					GuiaSaida: getGuiaSaida,
					Notas: getNotasDisponiveis,
					AlimentosGuiaSaida: getAlimentosGuiaSaida
				},
				data: {
					auth: true
				}
			})
			.state('menu.imprimirguiaentrada', {
				url: '/imprimirguiaentrada/:id_entrada',
				templateUrl: 'dist/partials/imprimir_guia_entrada.html',
				controller: 'ImprimirGuiaEntradaCtrl as imprimir',
				resolve: {
					GuiaEntrada: getGuiaEntrada,
					AlimentosGuiaEntrada: getAlimentosGuiaEntradaResource
				},
				data: {
					auth: true
				}
			})
			.state('menu.imprimirguiasaida', {
				url: '/imprimirguiasaida/:id_saida',
				templateUrl: 'dist/partials/imprimir_guia_saida.html',
				controller: 'ImprimirGuiaSaidaCtrl as imprimir',
				resolve: {
					GuiaSaida: getGuiaSaida,
					AlimentosGuiaSaida: getAlimentosGuiaSaida
				},
				data: {
					auth: true
				}
			})
			.state('menu.imprimirresultadoteste', {
				url: '/imprimirresultadoteste/:id_testeaceitabilidade',
				templateUrl: 'dist/partials/imprimir_resultado_teste.html',
				controller: 'ImprimirResultadoTesteCtrl as imprimir',
				resolve: {
					RespostasTesteAceitabilidade: getRespostasTesteAceitabilidade,
					DadosTesteAceitabilidade: getDadosTesteAceitabilidade
				},
				data: {
					auth: true
				}
			});
		$urlRouterProvider.otherwise('/login');
	}
	configuration.$inject = ['$stateProvider', '$urlRouterProvider'];

	function runner($rootScope, $state, LoginResource, cfpLoadingBar) {
		$rootScope.$on('$stateChangeStart', function (event, toState) {
			cfpLoadingBar.start();
			if (toState.data.auth && !LoginResource.chkCred()) {
				cfpLoadingBar.complete();
				event.preventDefault();
				$state.go('login');
			}
		});
		$rootScope.$on('$stateChangeSuccess', function (event, toState) {
			cfpLoadingBar.complete();
			$('.tooltipped').tooltip('close');
		});
	}
	runner.$inject = ['$rootScope', '$state', 'LoginResource', 'cfpLoadingBar'];

	angular.module('GMERENDA', ['ui.router', 'ngResource', 'angular-table', 'angular-loading-bar', 'ngFileUpload']).config(configuration).run(runner);
}());