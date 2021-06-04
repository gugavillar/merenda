(function () {
	'use strict';
	/*global M, angular, $*/
	function ImprimirResultadoTesteCtrl(RespostasTesteAceitabilidade, DadosTesteAceitabilidade, $state) {
		var vm = this;
		vm.respostas = RespostasTesteAceitabilidade;
		vm.dados = DadosTesteAceitabilidade;

		function print() {
			M.toast({
				html: 'Preparando a impressão', inDuration: 1000, classes: 'rounded noprint', completeCallback: function () {
					window.print();
					$state.go('menu.listartestesdeaceitabilidade');
				}
			});
		}
		vm.print = print;

		vm.totalotimo = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.resposta_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalbom = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.resposta_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalregular = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.resposta_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalruim = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.resposta_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalpessimo = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.resposta_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalmanha = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totaltarde = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalnoite = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalanoum = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalanodois = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalanotres = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalanoquatro = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalanocinco = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalanoseis = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 6) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalanosete = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 7) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalanooito = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 8) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalanonove = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 9) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalotimomanha = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 1 && elem.resposta_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalbommanha = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 1 && elem.resposta_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalregularmanha = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 1 && elem.resposta_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalruimmanha = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 1 && elem.resposta_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalpessimomanha = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 1 && elem.resposta_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalotimotarde = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 2 && elem.resposta_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalbomtarde = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 2 && elem.resposta_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalregulartarde = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 2 && elem.resposta_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalruimtarde = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 2 && elem.resposta_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalpessimotarde = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 2 && elem.resposta_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalotimonoite = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 3 && elem.resposta_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalbomnoite = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 3 && elem.resposta_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalregularnoite = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 3 && elem.resposta_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalruimnoite = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 3 && elem.resposta_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalpessimonoite = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.turno_testeaceitabilidaderesposta === 3 && elem.resposta_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalotimoanoum = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 1 && elem.resposta_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalbomanoum = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 1 && elem.resposta_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalregularanoum = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 1 && elem.resposta_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalruimanoum = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 1 && elem.resposta_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalpessimoanoum = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 1 && elem.resposta_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalotimoanodois = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 2 && elem.resposta_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalbomanodois = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 2 && elem.resposta_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalregularanodois = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 2 && elem.resposta_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalruimanodois = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 2 && elem.resposta_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalpessimoanodois = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 2 && elem.resposta_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalotimoanotres = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 3 && elem.resposta_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalbomanotres = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 3 && elem.resposta_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalregularanotres = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 3 && elem.resposta_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalruimanotres = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 3 && elem.resposta_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalpessimoanotres = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 3 && elem.resposta_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalotimoanoquatro = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 4 && elem.resposta_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalbomanoquatro = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 4 && elem.resposta_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalregularanoquatro = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 4 && elem.resposta_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalruimanoquatro = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 4 && elem.resposta_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalpessimoanoquatro = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 4 && elem.resposta_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalotimoanocinco = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 5 && elem.resposta_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalbomanocinco = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 5 && elem.resposta_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalregularanocinco = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 5 && elem.resposta_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalruimanocinco = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 5 && elem.resposta_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalpessimoanocinco = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 5 && elem.resposta_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalotimoanoseis = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 6 && elem.resposta_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalbomanoseis = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 6 && elem.resposta_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalregularanoseis = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 6 && elem.resposta_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalruimanoseis = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 6 && elem.resposta_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalpessimoanoseis = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 6 && elem.resposta_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalotimoanosete = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 7 && elem.resposta_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalbomanosete = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 7 && elem.resposta_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalregularanosete = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 7 && elem.resposta_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalruimanosete = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 7 && elem.resposta_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalpessimoanosete = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 7 && elem.resposta_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalotimoanooito = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 8 && elem.resposta_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalbomanooito = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 8 && elem.resposta_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalregularanooito = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 8 && elem.resposta_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalruimanooito = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 8 && elem.resposta_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalpessimoanooito = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 8 && elem.resposta_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalotimoanonove = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 9 && elem.resposta_testeaceitabilidaderesposta === 5) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalbomanonove = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 9 && elem.resposta_testeaceitabilidaderesposta === 4) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalregularanonove = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 9 && elem.resposta_testeaceitabilidaderesposta === 3) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalruimanonove = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 9 && elem.resposta_testeaceitabilidaderesposta === 2) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);

		vm.totalpessimoanonove = RespostasTesteAceitabilidade.reduce(function (prevVal, elem) {
			if (elem.serie_testeaceitabilidaderesposta === 9 && elem.resposta_testeaceitabilidaderesposta === 1) {
				return prevVal + 1;
			} else {
				return prevVal;
			}
		}, 0);
	}
	ImprimirResultadoTesteCtrl.$inject = ['RespostasTesteAceitabilidade', 'DadosTesteAceitabilidade', '$state'];

	angular.module('GMERENDA').controller('ImprimirResultadoTesteCtrl', ImprimirResultadoTesteCtrl);
}());