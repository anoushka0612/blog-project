import bodyParser from "body-parser";
import express from "express";
import _ from "lodash";
const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

let posts=[];

app.get("/",(req,res) => {
    res.render("index.ejs",{Content:posts});
})

app.get("/about",(req,res) => {
    res.render("about.ejs");
})

app.get("/create",(req,res) => {
    res.render("create.ejs");
})

app.post("/submit",(req,res) =>{
    const contentDisplay = {title:req.body.title,
        genre:req.body.genre,
        body:req.body.blogcontent};
    posts.push(contentDisplay)
    res.render("index.ejs",{Content:posts});
})

app.get("/posts/:title", (req,res) => {
    posts.forEach((post) => {
        const element = post.title;
        if(_.lowerCase(element)===_.lowerCase(req.params.title)){
            const contentDisplay = {title:post.title,
                genre:post.genre, body:post.body};
            res.render("post.ejs", {content : contentDisplay});
        }
    })
})

app.get("/posts/edit/:title", (req,res) => {
    const postTitle = req.params.title;
    const post = posts.find(p => p.title === postTitle);
    if (post) {
      res.render("edit.ejs", {post});
    } else {
      res.status(404).send('Post not found');
    }
});

app.post("/posts/edit/:title", (req, res) => {
    const postTitle = req.params.title;
    const index = posts.findIndex(p => ":"+ p.title === postTitle);    
    if (index !== -1) {
      posts[index].title = req.body.title;
      posts[index].genre = req.body.genre;
      posts[index].body = req.body.blogcontent;
      res.redirect('/');
    } else {
      res.status(404).send('Post not found');
    }
});

app.post("/posts/delete/:title", (req,res) => {
    const postTitle = req.params.title;
    posts = posts.filter(p =>p.title != postTitle);
    res.redirect('/');
})

app.listen(port,() => {
    console.log(`Server listening to port ${port}`);
})