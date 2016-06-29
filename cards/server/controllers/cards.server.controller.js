'use strict';
/**
 * Module dependencies
 */
var path = require('path'), mongoose = require('mongoose'), Card = mongoose.model('Card'), Category = mongoose.model('Category'), errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
/**
 * Create an card
 */
exports.create = function (req, res) {
    var card = new Card(req.body);
    card.user = req.user;
    card.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(card);
        }
    });
};
/**
 * Create a category
 */
exports.createcategory = function (req, res) {
    var category = new Category(req.body);
    category.user = req.user;
    category.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(category);
        }
    });
};
/**
 * Show the current card
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var card = req.card ? req.card.toJSON() : {};
    // Add a custom field to the Card, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Card model.
    card.isCurrentUserOwner = !!(req.user && card.user && card.user._id.toString() === req.user._id.toString());
    res.json(card);
};
/**
 * Update an card
 */
exports.update = function (req, res) {
    var card = req.card;
    card.lessonNumber = req.body.lessonNumber;
    card.cardNumber = req.body.cardNumber;
    card.japaneseWord = req.body.japaneseWord;
    card.englishWord = req.body.englishWord;
    card.revision = req.body.revision;
    card.category = req.body.category;
    card.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(card);
        }
    });
};
/**
 * Delete an card
 */
exports.delete = function (req, res) {
    var card = req.card;
    card.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(card);
        }
    });
};
/**
 * List of Cards
 */
exports.lessons = function (req, res) {
    Card.distinct('lessonNumber', function (err, cards) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            cards.sort(function (a, b) { return a - b; });
            res.json(cards);
        }
    });
};
/**
 * List of Cards
 */
exports.list = function (req, res) {
    Card.find({ lessonNumber: req.params.lesson }).sort({ cardNumber: 1 }).populate('user', 'displayName').exec(function (err, cards) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(cards);
        }
    });
};
/**
 * List of All Revision Cards
 */
exports.allrevision = function (req, res) {
    Card.find({ revision: { $gt: [] } }).sort({ cardNumber: 1 }).populate('user', 'displayName').exec(function (err, cards) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(cards);
        }
    });
};
/**
 * List of Cards
 */
exports.revision = function (req, res) {
    Card.find({ revision: req.user.username }).sort({ cardNumber: 1 }).populate('user', 'displayName').exec(function (err, cards) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(cards);
        }
    });
};
/**
 * List of Category { category: req.params.category }
 */
exports.category = function (req, res) {
    Card.find({ category: req.params.category }).sort({ cardNumber: 1 }).populate('user', 'displayName').exec(function (err, cards) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(cards);
        }
    });
};
/**
 * List of search Cards
 */
exports.search = function (req, res) {
    Card.find().sort({ cardNumber: 1 }).populate('user', 'displayName').exec(function (err, cards) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(cards);
        }
    });
};
/**
 * Card middleware
 */
exports.cardByID = function (req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Card is invalid'
        });
    }
    Card.findById(id).populate('user', 'displayName').exec(function (err, card) {
        if (err) {
            return next(err);
        }
        else if (!card) {
            return res.status(404).send({
                message: 'No card with that identifier has been found'
            });
        }
        req.card = card;
        next();
    });
};
