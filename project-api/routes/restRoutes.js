const express    = require('express');
const router     = express.Router();
const Restaurant = require('../models/Restaurant');


const bcrypt     = require('bcryptjs');
const passport = require('passport');


router.post('/signup', (req, res, next) =>{
    const username = req.body.username;
    const password = req.body.password;
  

    // becomes annoying while testing, make sure you put it on after
    // if(password.length < 5){
    //     res.status(400).json({ message: 'Please make your password at least 6 characters long for security purposes.' });
    //     return;
    // }
  
    Restaurant.findOne({ username }, (err, foundRestaurant) =>{

        if(err){
            res.status(500).json({message: "Username check went bad."});
            return;
        }

        if (foundRestaurant) {
            res.status(400).json({ message: 'Username taken. Choose another one.' });
            return;
        }
  
        const salt     = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);
  
        const aNewRest = new Restaurant({
            username:username,
            password: hashPass
        });
  
        aNewRest.save(err =>{
            if (err) {
                res.status(400).json({ message: 'Saving user to database went wrong.' });
                return;
            }
            req.login(aNewRest, (err) => {

                if (err) {
                    res.status(500).json({ message: 'Login after signup went bad.' });
                    return;
                }

                res.json(aNewRest);
            });
        });
    });
});


router.post('/login', (req, res, next) =>{
    console.log('----------')
    passport.authenticate('local', (err, theUser, x) =>{    
    console.log('the passport authentication is running. the user is =', theUser )
        if (err) {
            res.json({ message: 'Something went wrong while authenticating the user.'});
            return;
        }

        if (!theUser) {
            res.json(x);
            return;
        }

        req.login(theUser, (err) =>{
            if(err) {
                res.json({ message: 'Session save went bad.'});
                return;
            }
            res.json(theUser);
        })
    })(req, res, next)
})


router.post('/logout', (req, res, next) =>{
    req.logout();
    res.json({ message: 'Log out succes!'});
})

router.get('/loggedin', (req, res, next) =>{
    if (req.isAuthenticated()) {
        res.json(req.user)
    }
})


router.post('/restaurants/delete/:id', (req, res, next) =>{
    Restaurant.findByIdAndRemove(req.params.id)
    .then((deletedRestaurant)=>{
        if (deletedRestaurant === null){
            res.json({ message: 'Sorry this restaurant could not be found'})
            return;
        }
        res.json([
            { message: 'Restaurant removed!'},
            deletedRestaurant
        ])
    })
    .catch((err)=>{
        res.json(err)
    })
})

module.exports = router;