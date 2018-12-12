const mongoose = require ('mongoose');
const Schema   = mongoose.Schema;

const restaurantSchema = new Schema({
    // just requires the name of the restaurant and a password to match it with
    username: String,
    password: String
    // restaurantName: req.params.id
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports   = Restaurant;