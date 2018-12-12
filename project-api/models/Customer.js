const mongoose = require ('mongoose');
const Schema   = mongoose.Schema;


const customerSchema = new Schema({
    // change the schema type into the appropiate syntax
    restaurantID: {type: Schema.Types.ObjectId, ref: "Restaurant"},
    name: String,
    spending: Number,
    phone: Number,
    rewards: []
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports   = Customer;