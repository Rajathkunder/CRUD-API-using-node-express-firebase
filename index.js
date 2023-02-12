const express = require('express');
const bodyParser = require('body-parser');
//const firebase = require("firebase");
const firebase = require('firebase-admin');

const app = express();
app.use(bodyParser.json());

const firebaseConfig = {
    apiKey: "AIzaSyBHaNuttGXFRcRd2bZIwcApjpdc7QeKINs",
    authDomain: "new-try-2ad9e.firebaseapp.com",
    databaseURL: "https://new-try-2ad9e-default-rtdb.firebaseio.com",
    projectId: "new-try-2ad9e",
    storageBucket: "new-try-2ad9e.appspot.com",
    messagingSenderId: "348439755714",
    appId: "1:348439755714:web:731ddfc69b6350344ab45b",
    measurementId: "G-7XJY5F12B0"
  };

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
//adding
app.post('/posts', async (req, res) => {
    try {
      const post = req.body;
      post.userId = req.user.uid;
      const newPost = await db.collection('posts').add(post);
      res.status(201).json({
        message: 'Post created successfully',
        postId: newPost.id
      });
    } catch (error) {
      res.status(500).json({ error: 'Error creating post' });
    }
  });
//retrieving all posts
app.get('/posts', async (req, res) => {
    try {
      const posts = [];
      const snapshot = await db.collection('posts').get();
      snapshot.forEach((doc) => {
        posts.push({
          postId: doc.id,
          ...doc.data()
        });
      });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching posts' });
    }
  });
  //updating
  app.put('/posts/:postId', async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = req.body;
      const postRef = db.collection('posts').doc(postId);
      const doc = await postRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Post not found' });
    }
    if (doc.data().userId !== req.user.uid) {
    return res.status(403).json({ error: 'Unauthorized access' });
    }
    await postRef.update(post);
    res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
    res.status(500).json({ error: 'Error updating post' });
    }
    });
    //deleting
    app.delete('/posts/:postId', async (req, res) => {
        try {
        const postId = req.params.postId;
        const postRef = db.collection('posts').doc(postId);
        const doc = await postRef.get();
        if (!doc.exists) {
        return res.status(404).json({ error: 'Post not found' });
        }
        if (doc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: 'Unauthorized access' });
        }
        await postRef.delete();
        res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
        res.status(500).json({ error: 'Error deleting post' });
        }
        });
//fetch a post by id
app.get('/posts/:postId', async (req, res) => {
    try {
      const postId = req.params.postId;
      const postRef = db.collection('posts').doc(postId);
      const doc = await postRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.status(200).json({ post: doc.data() });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching post' });
    }
  });

  //. Fetch all posts of a specific userId
  app.get('/posts', async (req, res) => {
    try {
      const userId = req.query.userId;
      const postsRef = db.collection('posts').where('userId', '==', userId);
      const snapshot = await postsRef.get();
      const posts = [];
      snapshot.forEach(doc => {
        posts.push(doc.data());
      });
      res.status(200).json({ posts });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching posts' });
    }
  });
  


app.listen(3000, () => {
  console.log('Server started on port 3000');
});


