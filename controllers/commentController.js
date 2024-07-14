const Comment = require('../models/comment');


const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const bycrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const { ObjectId } = require('mongodb');

exports.post_comment = [
    body('content', 'Content must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    
    asyncHandler(async (req, res, next) => {
        jwt.verify(req.token, 'mysecretkey', async (err, authData) => {
            if (err) {
                res.sendStatus(403); 
            }else{
                const errors = validationResult(req);
                
                const comment = new Comment({
                    content: req.body.content,
                    user: authData.user.userName,
                    post: req.body.id,
                })

                if(!errors.isEmpty()){
            
                    res.json({ errors: errors})
                }else{
                   
                    await comment.save();
                    res.json({message: 'comment made'});
                }
            }
        })
    }),
];

exports.get_all_comments = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find({ post: ObjectId.createFromHexString(req.body.id)});
    
    res.json({
        comments
    })
});