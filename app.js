const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// DB CONNECTION
mongoose.connect('mongodb://localhost:27017/node-blog', { useNewUrlParser: true });

// SERVER CONFIG
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MONGOOSE CONFIG
// schema with 1 property 'body' which will be a String
const postSchema = new mongoose.Schema({ 
  title: String,
  description: String, // TODO: use later on
  body: String 
});

// compile schema into a model
// we construct our documents with mongoose models
const Post = mongoose.model('Post', postSchema);

// SERVER ROUTES
app.get('/', (req, res) => {
  // Render index with all posts.
  Post.find({}, (err, posts) => {
    res.render('pages/index', { posts: posts})
  });
});

app.get('/about', (req, res) => {
  // Render about view with all posts and form.
  res.render('pages/about')
});

app.get('/projects', (req, res) => {
  // Render about view with all posts and form.
  Post.find({}, (err, posts) => {
    res.render('pages/projects', { posts: posts})
  });
});

app.post('/addpost', (req, res) => {
  const postData = new Post(req.body); // creating a new Post with body submitted through form
  postData.save().then( result => {
    res.redirect('/projects');
  }).catch(err => {
    res.status(400).send("Unable to save data");
  });
})


app.listen(3000, () => {
  console.log('Server listening at: localhost:3000');
});