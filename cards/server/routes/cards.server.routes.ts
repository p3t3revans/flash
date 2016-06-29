'use strict';

/**
 * Module dependencies
 */
var cardsPolicy = require('../policies/cards.server.policy'),
  cards = require('../controllers/cards.server.controller');

module.exports = function (app) {
  // Cards collection routes
  app.route('/api/lesson/:lesson/cards').all(cardsPolicy.isAllowed)
    .get(cards.list);

  // Cards collection routes
  app.route('/api/category/:category').all(cardsPolicy.isAllowed)
    .get(cards.category);

  // Category collection routes
  app.route('/api/category/create').all(cardsPolicy.isAllowed)
    .post(cards.createcategory);

  // Cards collection routes
  app.route('/api/lessons').all(cardsPolicy.isAllowed)
    .get(cards.lessons);

  // Cards collection routes
  app.route('/api/search').all(cardsPolicy.isAllowed)
    .get(cards.search);


  app.route('/api/search/:cardId').all(cardsPolicy.isAllowed)
    .put(cards.update);

  // Cards collection routes
  app.route('/api/revision').all(cardsPolicy.isAllowed)
    .get(cards.revision);

  // Cards collection routes
  app.route('/api/allrevision').all(cardsPolicy.isAllowed)
    .get(cards.allrevision);

  // Cards collection routes
  app.route('/api/revision/:cardId').all(cardsPolicy.isAllowed)
    .put(cards.update);


  app.route('/api/lesson/cards').all(cardsPolicy.isAllowed)
    .post(cards.create);

  // Single card routes
  app.route('/api/lesson/cards/:cardId').all(cardsPolicy.isAllowed)
    .get(cards.read)
    .put(cards.update)
    .delete(cards.delete);

  // Finish by binding the card middleware
  app.param('cardId', cards.cardByID);
};
