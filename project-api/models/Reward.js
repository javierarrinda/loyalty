const mongoose = require ('mongoose');
const Schema   = mongoose.Schema;


const rewardSchema = new Schema({
    threshold: Number,
    name: String,
    description: String
})

const Reward = mongoose.model('Reward', rewardSchema)

module.exports   = Reward;