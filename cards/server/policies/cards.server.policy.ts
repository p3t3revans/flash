'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Cards Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/lesson/cards',
      permissions: ['*']
    }, {
      resources: '/api/lesson/:lesson/cards',
      permissions: '*'
    }, {
      resources: '/api/lesson/cards/:cardId',
      permissions: '*'
    }, {
      resources: '/api/lessons',
      permissions: '*'
   }, {
      resources: '/api/search',
      permissions: '*'
    }, {
      resources: '/api/category/:category',
      permissions: '*'
    }, {
      resources: '/api/category/create',
      permissions: '*'
    }, {
      resources: '/api/search/:cardId',
      permissions: ['put']
    }, {
      resources: '/api/allrevision',
      permissions: ['get']
    }, {
      resources: '/api/revision',
      permissions: ['get']
    }, {
      resources: '/api/revision/:cardId',
      permissions: ['put']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/lesson/:lesson/cards',
      permissions: ['get']
    }, {
      resources: '/api/category/:category',
      permissions: ['get']
    }, {
      resources: '/api/lesson/cards/:cardId',
      permissions: ['get']
    }, {
      resources: '/api/lessons',
      permissions: ['get']
    }, {
      resources: '/api/search',
      permissions: ['get']
    },{
      resources: '/api/search/:cardId',
      permissions: ['put']
    }, {
      resources: '/api/allrevision',
      permissions: ['get']
    },  {
      resources: '/api/revision',
      permissions: ['get']
    }, {
      resources: '/api/revision/:cardId',
      permissions: ['put']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/lesson/:lesson/cards',
      permissions: ['get']
    }, {
      resources: '/api/category/:category',
      permissions: ['get']
    }, {
      resources: '/api/lesson/cards/:cardId',
      permissions: ['get']
    }, {
      resources: '/api/lessons',
      permissions: ['get']
    }, {
      resources: '/api/search',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Cards Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an card is being processed and the current user created it then allow any manipulation
  if (req.card && req.user && req.card.user && req.card.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
