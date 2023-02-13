const express = require('express');
const bodyParser = require('body-parser');
//const firebase = require("firebase");
const firebase = require('firebase-admin');
var serviceAccount = require("./new-try-2ad9e-firebase-adminsdk-z1lk1-79e54c61cd.json");
const app = express();
app.use(bodyParser.json());

const firebaseConfig = {
  credential: firebase.credential.cert(serviceAccount),
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
const db= firebase.database();
//adding
app.post('/posts', async (req, res) => {
    
      const userId = req.body.userId;
      const posts = req.body.post;
      //post.userId = req.user.uid;
      //const {userId,post}=posts;
      console.log(userId,posts);
      const postsRef = db.ref("posts");
postsRef.push({
  userId,
  posts
});
     
  });
//retrieving all posts
app.get('/posts', async (req, res) => {
  const posts = [];
  const snapshot = await db.ref('posts').once('value');
  snapshot.forEach((childSnapshot) => {
    const post = childSnapshot.val();
    posts.push({
      postId: childSnapshot.key,
      ...post
    });
  });
  res.status(200).json(posts);
});
  //updating
  app.put('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;
    const userId = req.body.userId;
    const postData = req.body.post;
    const postRef = db.ref(`posts/${postId}`);
    const postSnapshot = await postRef.once('value');
    if (postSnapshot.val().userId !== userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await postRef.update({ ...postData });
    res.status(200).json({ postId, ...postData });
  });
    //deleting
    app.delete('/posts/:postId', async (req, res) => {
      const postId = req.params.postId;
      const userId = req.body.userId;
      const postRef = db.ref(`posts/${postId}`);
      const postSnapshot = await postRef.once('value');
      if (postSnapshot.val().userId !== userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      await postRef.remove();
      res.status(200).json({ message: 'Post deleted successfully' });
    });
    
//fetch a post by id
app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const postRef = db.ref(`posts/${postId}`);
  const post = await postRef.once('value');

  if (post.exists()) {
    res.status(200).json({
      postId: post.key,
      ...post.val()
    });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});


  //. Fetch all posts of a specific userId
  app.get('/userposts/:userId', async (req, res) => {
    const userId = req.params.userId;
    const posts = [];
    const snapshot = await db.ref('posts').orderByChild('userId').equalTo(userId).once('value');
    snapshot.forEach((childSnapshot) => {
        posts.push({
            postId: childSnapshot.key,
            ...childSnapshot.val()
        });
    });
    res.status(200).json(posts);
});

  


app.listen(3000, () => {
  console.log('Server started on port 3000');
});


