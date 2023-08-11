// const express = require("express");

// //TODO: Express app

// const app = express();

// //TODO: listen for request
// app.listen(3000);

// //TODO: send response as a HTML
// app.get('/',(req,res)=>{
//     //res.send('<h1>WEE</h2>');
//     res.sendFile('./views/index.html',{root: __dirname});  // by default express look for computers path so we need to mentioned directory of path
// });

// app.get('/about',(req,res)=>{
//     res.sendFile('./views/about.html',{root: __dirname});
//    // res.send('<h1>About Page</h2>');
// });

// //TODO: redirect
// app.get('/about-us',(req,res)=>{
//     res.redirect('/about');
// });

// //TODO: 404 page  : use fun for every single request doesnot matter what URL it is
// // thismethod is used as a middleware also
// app.use((req,res)=>{      // note that place it in last because it fire for every request
//     res.statusCode(404).sendFile('./views/PageError.html',{root: __dirname})
// })

// // if we put above method in middle of course then request is definetly handle by this method and methods that below this method are not checked

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI =
  "mongodb+srv://chintupatel61098:JQG8YvpUYM3WUZWL@nodedemo.y4to5j5.mongodb.net/nodedemo?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// register view engine
app.set("view engine", "ejs");

// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// blog routes
app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" });
});

app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { blogs: result, title: "All blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/blogs", (req, res) => {
  // console.log(req.body);
  const blog = new Blog(req.body);

  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: "Blog Details" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
