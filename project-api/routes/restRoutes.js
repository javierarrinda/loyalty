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
    console.log(username, password)
  
    Restaurant.findOne({ username }, (err, foundRestaurant) =>{

        if(err){
            console.log('at the beginning')
            res.status(500).json({message: "Username check went bad."});
            return;
        }

        if (foundRestaurant) {
            console.log('username taken')
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
                console.log('couldnt save');
                res.status(400).json({ message: 'Saving user to database went wrong.' });
                return;
            }
            req.login(aNewRest, (err) => {

                console.log('tryna login')

                if (err) {
                    console.log('couldnt login')
                    res.status(500).json({ message: 'Login after signup went bad.' });
                    return;
                }

                res.json(aNewRest);
            });
        });
    });
});


// router.post('/login', (req, res, next) =>{
//     console.log('----------')
//     passport.authenticate('local', (err, theUser, x) =>{    
//     console.log('the passport authentication is running. the user is =', theUser )
//         if (err) {
//             res.json({ message: 'Something went wrong while authenticating the user.'});
//             return;
//         }

//         if (!theUser) {
//             res.json(x);
//             return;
//         }

//         req.login(theUser, (err) =>{
//             if(err) {
//                 res.json({ message: 'Session save went bad.'});
//                 return;
//             }
//             res.json(theUser);
//         })
//     })(req, res, next);
// })



router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
        if (err) {
            res.json({ message: 'Something went wrong authenticating user' });
            return;
        }
    
        if (!theUser) {
            // "failureDetails" contains the error messages
            // from our logic in "LocalStrategy" { message: '...' }.
            console.log('------------ failure', failureDetails);            
            res.json(failureDetails);
            return;
        }

        // save user in session
        req.login(theUser, (err) => {
            if (err) {
                res.json({ message: 'Session save went bad.' });
                return;
            }

            // We are now logged in (that's why we can also send req.user)
            res.json(theUser);
        });
    })(req, res, next);
});










router.post('/logout', (req, res, next) =>{
    req.logout();
    res.json({ message: 'Log out succes!'});
})

router.get('/loggedin', (req, res, next) =>{
    console.log('in logged in', req.body, req.params)
        console.log(req.user)
    
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
