const User = require('../models/user');
const Post = require('../models/post');

const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const bycrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const { token } = require('morgan');
const { ObjectId } = require('mongodb');

exports.blog_post = [
    body('title', 'Title must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    body('content', 'Content must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        jwt.verify(req.token, 'mysecretkey', async (err, authData) => {
            if (err) {
                
                res.send(403); 
            }else{

                const errors = validationResult(req);
                const post = new Post({
                    title: req.body.title,
                    content: req.body.content,
                    timeStamp: new Date().toISOString().split('T')[0],
                    user: authData.user.userName
                })

                if(!errors.isEmpty()){
                    res.json({ errors: errors})
                }else{
                    await post.save();
                    res.json({ message: 'post made...'})
                }
            }
        })
    }),
]



exports.blogs_get = asyncHandler(async (req, res, next) => {
    const posts = await Post.find();

    res.json({
        posts: posts
    })
});

exports.delete = asyncHandler(async (req, res, next) => {
    await Post.deleteOne({ _id: ObjectId.createFromHexString(req.body.id)});
    res.json({message: 'post deleted'})
})