const express    = require('express');
const router     = express.Router();
const Customer   = require('../models/Customer');

router.get('/customers', (req, res, next) =>{
    console.log('in customers',req.user, req.params)
    
    Customer.find({})//.findById(req.params.restID)
        .then((customerForThisRest) =>{
            console.log(customerForThisRest)
            console.log('in here ')
            res.json({customerForThisRest})
            //res.json({ allCustomers: customersForThisRest})
    })
    .catch((err) =>{
        res.json(err);
    })
})

router.get('/customers/details/:id', (req, res, next) =>{
    Customer.findById(req.params.id)
    .then((theCustomer)=>{
        res.json(theCustomer)
    })
    .catch((err) =>{
        res.json(err);
    })
})  

router.post('/customers/newCustomer', (req, res, next) =>{
    console.log(req.user, req.params)
    Customer.create({
        name: req.body.name,
        spending: req.body.spending,
        phone: req.body.phone,
        restaurantID: req.user._id
        // rewards: req.body.rewards
    })
    .then((response) =>{
        res.json(response)
    })
    .catch((err) =>{
        res.json(err);
    })
})

router.post('/customers/edit/:id', (req, res, next) =>{
    Customer.findById(req.params.id)
    // figure out how to reset the spending to zero for now since there is only one reward
    // that will have to change later since rewards just keep on adding on (the more a customer comes the )
    .then((theCustomer)=>{
        console.log("current spending ------------- ", theCustomer.spending);
        newSpending = Number(theCustomer.spending) + Number(req.body.spending);
        theCustomer.set({spending: newSpending});
        theCustomer.save()
        .then(updatedCustomer => {
            console.log("new spending ================== ", updatedCustomer.spending);
            res.json(updatedCustomer);
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch((err)=>{
        res.json(err)
    })
})




module.exports = router;
