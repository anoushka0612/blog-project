import bodyParser from "body-parser";
import express from "express";
import _ from "lodash";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"blogdb",
    password:"postgres2026",
    port:5432
});

db.connect();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

let posts=[];

app.get("/",async (req,res) => {
    try{
        let result = await db.query("SELECT * FROM posts");
        res.render("index.ejs",{Content:result.rows});
    }catch(err){
        console.log(err);
        res.sendStatus(500).send("Error getting posts");
    }
    
})

app.get("/about",(req,res) => {
    res.render("about.ejs");
})

app.get("/create",(req,res) => {
    res.render("create.ejs");
})

app.post("/submit",async (req,res) =>{
    const {title,genre,blogcontent} = req.body;
    try{
        await db.query("INSERT INTO posts (title,genre,body) VALUES ($1,$2,$3);",[title,genre,blogcontent]);
        res.redirect("/");
    }
    catch(err){
        console.log(err);
        res.status(500).send("Error saving post");
    }
})

app.get("/posts/:id", async (req,res) => {
    const id = req.params.id;
    try{
        let results = await db.query("SELECT * FROM posts WHERE ID = $1;",[id]);
        res.render("post.ejs",{content:results.rows[0]});
    }catch(err){
        console.log(err);
        return res.status(500).send("Error opening the post.");
    }

})

app.get("/posts/edit/:id", async (req,res) => {
    const id = req.params.id;
    try{
        const result = await db.query("SELECT * FROM posts WHERE id = $1;",[id]);
        res.render("edit.ejs",{post:result.rows[0]});
    }catch(err){
        console.log(err);
        return res.status(500).send("Error loading the post for editing.");
    }
});

app.post("/posts/edit/:id", async (req, res) => {
    const id = req.params.id;
    const {title,genre,body} = req.body;
    try{
        await db.query("UPDATE posts SET title = $1, genre = $2, body = $3 WHERE id = $4;",[title,genre,body,id]);
        res.redirect("/");
    }catch(err){
        console.log(err);
        return res.status(500).send("Error updating post");
    }
});

app.post("/posts/delete/:id", async (req,res) => {
    const id = req.params.id;
    try{
        await db.query("DELETE FROM posts WHERE id = $1;",[id]);
        res.redirect("/");
    }catch(err){
        console.log(err);
        return res.status(500).send("Error deleting post");
    } 
})

app.listen(port,() => {
    console.log(`Server listening to port ${port}`);
})