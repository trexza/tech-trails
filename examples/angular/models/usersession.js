/**
 * Created by Trexza on 12/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSessionSchema = new Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    sessionId: String,
    accessId: { type: String, required: true, unique: true },
    created_at: Date,
    updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var UserSession = mongoose.model('UserSession', userSessionSchema);

// make this available to our users in our Node applications
module.exports = UserSession;
