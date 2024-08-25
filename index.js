import express from "express";
import pg from "pg";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"notes",
    password:"221b"
});

db.connect();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",async (req,res)=>{
    try{
        let result = await db.query("select * from books;");
        res.render("index.ejs",{bookList: result.rows});
    }catch(err){
        console.log(err);
    }
});

app.get("/add",async (req,res)=>{
    res.render("details.ejs");
});
/*
app.get("/search",async (req,res)=>{
    nm = req.body.
    let result = await db.query("select * from books where name like %($1)%",nm);
})*/

app.post("/submit",async (req,res)=>{
    let title = req.body.bookName;
    let author = req.body.authorName;
    let content = req.body.bookNotes;
    let isbn = req.body.isbn;
   // const response = await axios.get(`https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`);
   // var url = response.data;
   let url = "url";
    await db.query("insert into books (title,author,content,isbn,url)values($1,$2,$3,$4,$5);",[title,author,content,isbn,url]);
    res.redirect("/");
});

app.post("/del",async(req,res)=>{
    let title = req.body.delBookName;
    console.log(title);
    await db.query("delete from books where title=($1)",[title]);
    res.redirect("/");
});


app.listen(port,()=>{
    console.log(`listening to port ${port}`);
});