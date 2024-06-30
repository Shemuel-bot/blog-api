const User = require('../models/user');

const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const bycrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const user = require('../models/user');

exports.create_user = [
    body('firstName', 'FirstName must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('lastName', 'lastName must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('userName', 'userName must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('password', 'password must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next)=>{
        const errors = validationResult(req);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: req.body.password,
        });

        await bycrypt.hash(req.body.password, 10)
                .then(hash =>{user.password = hash})
                .catch(err => {console.log(err.message)})

        if(!errors.isEmpty()){
            res.json({
                errors: errors,
            })
        }else{
            await user.save();
            res.json(user);
        }
    }),
];


exports.log_in_user = asyncHandler(passport.authenticate('local'), async (req, res, next)=>{
    if(req.user !== undefined){
    jwt.sign({ user: req.user}, 'mysecretkey', (err, token) =>{
        res.json({
            token
        })
    })
    }
})

exports.get_users = asyncHandler(async (req, res, next) => {
    const users = await User.find();

    res.json({
        users: users,
    });
})


passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ userName: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        const match = await bycrypt.compare(password, user.password);
  if (!match) {
  // passwords do not match!
  return done(null, false, { message: "Incorrect password" })
  }
  
        return done(null, user);
      } catch(err) {
        return done(err);
      };
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    };
  });
  