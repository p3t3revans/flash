(function () {
  'use strict';

  angular
    .module('cards')
    .controller('CardsListController', CardsListController);

  CardsListController.$inject = ['cardResolve', 'CategoryService', '$state', 'CardsService', '$scope', 'Authentication', 'LessonsService'];

  function CardsListController(card, CategoryService, $state, CardsService, $scope, Authentication, LessonsService) {
    var vm = this;
    vm.card = card;

    vm.authentication = Authentication;
    vm.showEnglish = false;
    vm.showAdmin = false;
    vm.showUser = false;
    if (vm.authentication.user) {
      if (vm.authentication.user.roles.indexOf('admin') !== -1) {
        vm.showAdmin = true;
      }
      vm.showUser = true;
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
    vm.lessonNumberData = {
      availableOptions: [{ lessonNumber: 1 }]
    };
    vm.lessons = LessonsService.query();
    vm.lessons.$promise.then(function (result) {
      vm.lessonNumberData.availableOptions = [];
      for (var i = 0; i < result.length; i++) {
        vm.lessonNumberData.availableOptions.push({ lessonNumber: result[i] })
      }
      // vm.lessonNumberData.availableOptions = result;
      // vm.
      vm.lessonNumberData.selectedOption = vm.lessonNumberData.availableOptions[0];
    })
    vm.lessonNumberData.selectedOption = vm.lessonNumberData.availableOptions[0];
    if (vm.card._id) vm.lessonNumber = vm.card.lessonNumber;
    else vm.lessonNumber = 1;
    $scope.listCards = function () {
      vm.wait = true;
      vm.cards = CardsService.query({ lesson: vm.lessonNumberData.selectedOption.lessonNumber });
      vm.cards.$promise.then(function (result) {
        for (var y = 0; y < vm.cards.length; y++) {
          if (vm.cards[y].revision.indexOf(vm.authentication.user.username) > -1) {
            vm.cards[y].selected = true;
          }
          else vm.cards[y].selected = false;
        }
        vm.wait = false;
      });
    }
    $scope.listCards();
    $scope.listCategory = function () {
      vm.wait = true;
      vm.cards = CategoryService.query({ category: vm.category.selectedOption.category });
      vm.cards.$promise.then(function (result) {
        for (var y = 0; y < vm.cards.length; y++) {
          if (vm.cards[y].revision.indexOf(vm.authentication.user.username) > -1) {
            vm.cards[y].selected = true;
          }
          else
            vm.cards[y].selected = false;
        }
        vm.wait = false;
      });
    };
    $scope.displayToggle = false;
    // implementation of Knuth in-place shuffle
    function knuthShuffle(a) {
      for (var i = a.length, j, k; i;
        j = Math.floor(Math.random() * i),
        k = a[--i],
        a[i] = a[j],
        a[j] = k);
      return a;
    }

    $scope.shuffle = function () {
      vm.cards = knuthShuffle(vm.cards);
    };

    $scope.update = function () {
      var listLength = vm.cards.length;
      for (var i = 0; i < listLength; i++) {
        if (vm.cards[i].selected) {
          var find = vm.cards[i].revision.indexOf(vm.authentication.user.username);
          if (find === -1) {
            vm.cards[i].revision.push(vm.authentication.user.username);
            vm.cards[i].$update(successCallback, errorCallback);
          }
        }
        else {
          var at = vm.cards[i].revision.indexOf(vm.authentication.user.username);
          if (at !== -1) {
            vm.cards[i].revision.splice(at, 1);
            vm.cards[i].$update(successCallback, errorCallback);
          }
        }
        function successCallback(res) {
          if (i === (listLength - 1)) {
            $scope.listCards();
          }
        }



        function errorCallback(res) {

          if (i === (listLength - 1)) {

          }
          // vm.error = res.data.message;
        }
        if (i === (listLength - 1)) {
          var myVar = setInterval(myTimer, 1000);
          function myTimer() {
            $scope.listCards();
            clearInterval(myVar);
          }
        }
      }
      //
    };

  }
} ());
