(function () {
  'use strict';

  angular
    .module('cards.services')
    .factory('CardsService', CardsService);

  CardsService.$inject = ['$resource'];

  function CardsService($resource) {
    return $resource('api/lesson/:lesson/cards/:cardId', {
      cardId: '@_id',lesson: '@lesson'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('cards.services')
    .factory('LessonsService', LessonsService);

  LessonsService.$inject = ['$resource'];

  function LessonsService($resource) {
    return $resource('api/lessons', {  
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('cards.services')
    .factory('AllRevisionService', AllRevisionService);

  AllRevisionService.$inject = ['$resource'];

  function AllRevisionService($resource) {
    return $resource('api/allrevision/:cardId', { 
      cardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());


(function () {
  'use strict';

  angular
    .module('cards.services')
    .factory('RevisionService', RevisionService);

  RevisionService.$inject = ['$resource'];

  function RevisionService($resource) {
    return $resource('api/revision/:cardId', { 
      cardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('cards.services')
    .factory('CategoryService', CategoryService);

  CategoryService.$inject = ['$resource'];

  function CategoryService($resource) {
    return $resource('api/category/:category', { 
      category: '@category'
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('cards.services')
    .factory('SearchService', SearchService);

  SearchService.$inject = ['$resource'];

  function SearchService($resource) {
    return $resource('api/search/:cardId', {  
       cardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());