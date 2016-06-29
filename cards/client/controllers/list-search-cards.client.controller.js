(function () {
    'use strict';
    angular
        .module('cards')
        .controller('CardsSearchController', CardsSearchController);
    CardsSearchController.$inject = ['$state', 'AllRevisionService', 'RevisionService', 'SearchService', '$scope', 'Authentication'];
    function CardsSearchController($state, AllRevisionService, RevisionService, SearchService, $scope, Authentication) {
        var vm = this;
        vm.authentication = Authentication;
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
        $scope.revision = function () {
            vm.wait = true;
            vm.search = 'revision';
            vm.cards = RevisionService.query();
            vm.cards.$promise.then(function (result) {
                for (var z = 0; z < vm.cards.length; z++) {
                    vm.cards[z].selected = true;
                }
                vm.wait = false;
            });
        };
        $scope.allrevision = function () {
            vm.wait = true;
            vm.search = 'revision';
            vm.cards = AllRevisionService.query();
            vm.cards.$promise.then(function (result) {
                for (var z = 0; z < vm.cards.length; z++) {
                    vm.cards[z].selected = true;
                }
                vm.wait = false;
            });
        };
        $scope.listCards = function () {
            vm.wait = true;
            vm.search = 'list';
            vm.cards = SearchService.query();
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
        $scope.listCards();
        $scope.displayToggle = false;
        // implementation of Knuth in-place shuffle
        function knuthShuffle(a) {
            for (var i = a.length, j, k; i; j = Math.floor(Math.random() * i),
                k = a[--i],
                a[i] = a[j],
                a[j] = k)
                ;
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
                    vm.cards[i].selected = true;
                }
                else {
                    var at = vm.cards[i].revision.indexOf(vm.authentication.user.username);
                    if (at !== -1) {
                        vm.cards[i].revision.splice(at, 1);
                        vm.cards[i].$update(successCallback, errorCallback);
                    }
                    vm.cards[i].selected = false;
                }
                function successCallback(res) {
                    // $state.go('cards.search');
                }
                function errorCallback(res) {
                    // vm.error = res.data.message;
                }
                if (i === (listLength - 1)) {
                    var myVar = setInterval(myTimer, 1000);
                    function myTimer() {
                        if (vm.search === 'list') {
                            $scope.listCards();
                        }
                        else {
                            $scope.revision();
                        }
                        clearInterval(myVar);
                    }
                }
            }
            //$scope.listCards();
        };
    }
}());
