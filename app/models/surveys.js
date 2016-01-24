'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Survey = new Schema({
    surveyId:Number,
    username:String,
    name:String,
    options:[
        {name:String,
        count:Number
        },
        {name:String,
        count:Number
        }
    ],
    voted:[]
});

module.exports = mongoose.model('Survey',Survey);