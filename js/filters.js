(function () {
	'use strict';
	/*global angular*/

	function tipoAlimento() {
		return function (input) {
			if (input) {
				switch (input) {
					case '1':
					case 1:
						return 'ALIMENTO SECO';
					default:
						return 'AGRICULTURA FAMILIAR';
				}
			}
		};
	}

	function tipoEscola() {
		return function (input) {
			if (input) {
				switch (input) {
					case '1':
					case 1:
						return 'ESCOLA';
					case '2':
					case 2:
						return 'ANEXO';
					case '3':
					case 3:
						return 'CRECHE';
					default:
						return 'NOVO MAIS EDUCAÇÃO';
				}
			}
		};
	}

	function cep() {
		return function (input) {
			if (input) {
				input = input.replace(/^(\d{5})(\d{3})$/g, '$1-$2');
				return input;
			}
		};
	}

	function cnpj() {
		return function (input) {
			if (input) {
				input = input.replace(/\D/g, '');
				input = input.replace(/(\d{2})(\d)/, '$1.$2');
				input = input.replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
				input = input.replace(/\.(\d{3})(\d)/, '.$1/$2');
				input = input.replace(/(\d{4})(\d)/, '$1-$2');
				return input;
			}
		};
	}

	function data(dateFilter) {
		return function (input) {
			if (input) {
				var dados = input.split(' '), data, novaData;
				data = dados[0].split('-');
				novaData = new Date(data[0], data[1] - 1, data[2]);
				return dateFilter(novaData, 'dd/MM/yyyy');
			}
		};
	}
	data.$inject = ['dateFilter'];

	function programa() {
		return function (input) {
			if (input) {
				switch (input) {
					case '1':
					case 1:
						return 'FUNDAMENTAL';
					default:
						return 'MAIS EDUCAÇÃO';
				}
			}
		};
	}

	function resposta() {
		return function (input) {
			if (input) {
				switch (input) {
					case 1:
					case '1':
						return 'Péssimo';
					case 2:
					case '2':
						return 'Ruim';
					case 3:
					case '3':
						return 'Regular';
					case 4:
					case '4':
						return 'Bom';
					default:
						return 'Ótimo';
				}
			}
		};
	}

	function turno() {
		return function (input) {
			if (input) {
				switch (input) {
					case '1':
					case 1:
						return 'Manhã';
					case '2':
					case 2:
						return 'Tarde';
					default:
						return 'Noite';
				}
			}
		};
	}

	function noNumber() {
		return function (input) {
			if (isNaN(input)) {
				return 0;
			} else {
				return input;
			}
		};
	}

	function tipoDistribuicao($filter) {
		return function (input, tipo, tipo2) {
			if (tipo2) {
				if (tipo2 === '1' || tipo2 === 1) {
					return $filter('currency')(input, '', 0);
				} else {
					return $filter('currency')(input, '', 2);
				}
			} else {
				if (tipo === '1' || tipo === 1) {
					return $filter('currency')(input, '', 0);
				} else {
					return $filter('currency')(input, '', 2);
				}
			}
		};
	}
	tipoDistribuicao.$inject = ['$filter'];

	angular.module('GMERENDA').filter('tipoAlimento', tipoAlimento).filter('tipoEscola', tipoEscola).filter('cep', cep).filter('cnpj', cnpj).filter('data', data).filter('programa', programa).filter('resposta', resposta).filter('turno', turno).filter('noNumber', noNumber).filter('tipoDistribuicao', tipoDistribuicao);
}());