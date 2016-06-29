(function () {
  'use strict';

  angular
    .module('cards.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cards', {
        abstract: true,
        url: '',
        template: '<ui-view/>'
      })
      .state('cards.list', {
        url: '/cards',
        templateUrl: 'modules/cards/client/views/list-cards.client.view.html',
        controller: 'CardsListController',
        controllerAs: 'vm',
        resolve: {
          cardResolve: newCard
        },
        data: {
          pageTitle: 'Cards List'
        }
      })
      .state('cards.search', {
        url: '/all',
        templateUrl: 'modules/cards/client/views/list-search-cards.client.view.html',
        controller: 'CardsSearchController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Search'
        }
      })
      .state('cards.create', {
        url: '/create',
        templateUrl: 'modules/cards/client/views/form-card.client.view.html',
        controller: 'CardsController',
        controllerAs: 'vm',
        resolve: {
          cardResolve: newCard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Cards Create'
        }
      })
      .state('cards.edit', {
        url: '/:cardId/edit',
        templateUrl: 'modules/cards/client/views/form-card.client.view.html',
        controller: 'CardsController',
        controllerAs: 'vm',
        resolve: {
          cardResolve: getCard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Card {{ cardResolve.lessonNumber }} {{ cardResolve.cardNumber }}'
        }
      })
      .state('cards.view', {
        url: '/:cardId',
        templateUrl: 'modules/cards/client/views/view-card.client.view.html',
        controller: 'CardsController',
        controllerAs: 'vm',
        resolve: {
          cardResolve: getCard
        },
        data: {
          pageTitle: 'Card {{ cardResolve.lessonNumber }} {{ cardResolve.cardNumber }}'
        }
      });
  }

  getCard.$inject = ['$stateParams', 'CardsService'];

  function getCard($stateParams, CardsService) {
    return CardsService.get({
      cardId: $stateParams.cardId
    }).$promise;
  }

  newCard.$inject = ['CardsService'];

  function newCard(CardsService) {
    return new CardsService();
  }
} ());
