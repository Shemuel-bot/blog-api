var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

router.get('/api', function(req, res, next) {
  res.json({ 
    title: 'Express' 
  });
});


router.put('/api/sign-up', userController.create_user);

router.post('/api/log-in',  userController.log_in_user);

router.post('/api/post', verifyToken, postController.blog_post);

router.get('/api/all-posts', verifyToken, postController.blogs_get);

router.post('/api/delete-post', postController.delete);

router.get('/api/all-users', userController.get_users);

router.post('/api/match-name', verifyToken, userController.user_names_match);

router.post('/api/posts-comments',  commentController.get_all_comments);

router.post('/api/post-comment', verifyToken, commentController.post_comment);


function verifyToken (req, res, next){
  const bearerHeader = req.headers['authorization'];
  
if(typeof bearerHeader !== 'undefined' &&  bearerHeader !== 'null'){

    const bearer = bearerHeader.split(' ');
   
    const bearerToken = bearer[1];
  
    req.token = bearerToken;
    
    next();
  }else{
      
    res.send(403);
  }
}




module.exports = router;
