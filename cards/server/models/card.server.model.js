'use strict';
/**
 * Module dependencies
 */
var mongoose = require('mongoose'), Schema = mongoose.Schema;
/**
**Category Schema
 **/
var CategorySchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        default: '',
        trim: true,
        required: 'Category cannot be blank!'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});
/**
 * Card Schema
 */
var CardSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    lessonNumber: {
        type: Number,
        default: 1,
        required: 'Lesson Number cannot be blank'
    },
    cardNumber: {
        type: Number,
        default: 1,
        required: 'Card Number cannot be blank'
    },
    category: {
        type: String,
        default: '',
        trim: true
    },
    japaneseWord: {
        type: String,
        default: '',
        trim: true,
        required: 'Japanese Word is Required'
    },
    englishWord: {
        type: String,
        default: '',
        trim: true,
        required: 'English translation is Required'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    revision: [{
            type: String
        }]
});
mongoose.model('Card', CardSchema);
mongoose.model('Category', CategorySchema);
