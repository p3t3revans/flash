(function () {
  'use strict';

  angular
    .module('cards')
    .controller('CardsController', CardsController);

  CardsController.$inject = ['$scope', '$state', 'cardResolve', '$window', 'Authentication'];

  function CardsController($scope, $state, card, $window, Authentication) {
    var vm = this;

    vm.card = card;
    vm.authentication = Authentication;
    vm.showAdmin = false;
    if (vm.authentication.user) {
      if (vm.authentication.user.roles.indexOf('admin') !== -1) {
        vm.showAdmin = true;
      }
    }

    vm.category = {
      availableOptions: [
        { category: '' },
        { category: 'Number' },
        { category: 'Entertainment and Sport' },
        { category: 'Time' },
        { category: 'People' },
        { category: 'Places' },
        { category: 'Transport' },
        { category: 'Food and Drinks' },
        { category: 'Greetings' },
        { category: 'Things' },
        { category: 'Flora' },
        { category: 'Fauna' }
      ]
    };
    var l = vm.category.availableOptions.length;
    for (var i = 0; i < l; i++) {
      if (vm.card.category) {
        if (vm.category.availableOptions[i].category === vm.card.category) {
          vm.category.selectedOption = vm.category.availableOptions[i];
          break;
        }
      }
    }
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Card
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.card.$remove($state.go('cards.list'));
      }
    }

    // Save Card
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cardForm');
        return false;
      }
      vm.card.category = vm.category.selectedOption.category;
      // TODO: move create/update logic to service
      if (vm.card._id) {
        vm.card.$update(successCallback, errorCallback);
      } else {
        vm.card.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('cards.view', {
          cardId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
} ());
