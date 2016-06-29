(function () {
  'use strict';

  angular
    .module('cards')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Create Card',
      state: 'cards.create',
      type: 'item',
      roles: ['admin']
    });

    menuService.addMenuItem('topbar', {
      title: 'Cards',
      state: 'cards.list',
      type: 'item',
      roles: ['*']
    });

    menuService.addMenuItem('topbar', {
      title: 'Search',
      state: 'cards.search',
      type: 'item',
      roles: ['*']
    });

  }
} ());
