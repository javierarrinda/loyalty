const express = require('express');
const router  = express.Router();

const Reward = require('../models/Reward');


router.post('/rewards/newReward', (req, res, next) =>{
    Reward.create({
        restaurantName: req.params.restID,
        threshold: req.body.threshold,
        name: req.body.name,
        description: req.body.description,
        restaurantID: req.user._id
    })
    .then((response) =>{
        res.json(response)
    })
    .catch((err) =>{
        res.json(err);
    })
})

router.get('/rewards', (req, res, next)=>{
    Reward.find({})
    .then((rewardGotten)=>{
        console.log('this is the reward that we get back',rewardGotten)
        res.json({rewardGotten})
    })
    .catch((err)=>{
        res.json(err);
    })
})


router.post('/rewards/edit/:id', (req, res, next) =>{
    console.log('this log works');
    Reward.findByIdAndUpdate(req.params.id , {
        threshold: req.body.threshold,
        name: req.body.name,
        description: req.body.description
    })
    .then((response)=>{
        console.log('---------', response);
        if(response === null){
            res.json({message: 'sorry we could not find this reward'})
            return;
        }
        res.json([{message: 'this task has been successfully updated'},
        response ])
    })
    .catch((err)=>{
        res.json(err)
    })
})


router.post('/rewards/delete/:id', (req, res, next)=>{
    console.log('boutta delete //');
    Reward.findByIdAndRemove(req.params.id)
    .then((deletedReward)=>{
        if(deletedReward === null){
            res.json({ message: 'sorry this reward could not be found' })
            return;
        }
        res.json([
            { message: 'task succesfully deleted' },
            deletedReward
        ])
    })
    .catch((err)=>{
        res.json(err)
    })
})


module.exports = router;
