'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Entry = new Schema({
    entryId:Number,
    username:String,
    name:String,
    language:String,
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

module.exports = mongoose.model('Entry',Entry);