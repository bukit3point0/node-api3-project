const express = require('express');
const {logger, validateUserId, validatePost} = require('./users-middleware')
const Users = require('./users-model')
const Posts = require('../posts/posts-model')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', logger, (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get(req.query)
  .then(users => {
    res.status(200).json(users)
  })
  .catch(next)
});

router.get('/:id', logger, validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  res.json(req.user)
  // this needs a middleware to verify user id
});

router.post('/', (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  })
  // this needs a middleware to check that the request body is valid
  .catch(next)
});

router.put('/:id', logger, validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  Users.update(req.params.id, req.body)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(next)
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete('/:id', logger, validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  Users.remove(req.params.id)
  .then(() => {
    res.status(200).json({
      message: 'user yeeted'
    })
  })
  .catch(next)
  // this needs a middleware to verify user id
});

router.get('/:id/posts', logger, validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  Users.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts)
  }) 
  .catch(next)
  // this needs a middleware to verify user id
});

router.post('/:id/posts', logger, validatePost, validateUserId, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  const postId = {...req.body, user_id: req.params.id}
  Posts.insert(postId)
  .then(post => {
    res.status(201).json(post)
  })
  .catch(next)
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

// do not forget to export the router
module.exports = router
