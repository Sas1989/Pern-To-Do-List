const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");
const yargs = require('yargs');

//middleware
app.use(cors());
app.use(express.json());//req.body

//ROUTES

//create a todo
app.post("/todos", async(req,res) =>{
    try {
        const {description} = req.body;
        const newTodo = await db.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING * ",
            [description]
        );
        res.json(newTodo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

//get all todo
app.get("/todos",async(req,res) =>{
    try {
        const allTodo = await db.query(
            "SELECT * FROM todo"
        );
        res.json(allTodo.rows)
    } catch (error) {
       console.error(error.message); 
    }
})

//get a todo
app.get("/todos/:id", async(req,res) =>{
    try {
        const {id} = req.params;
        const todo = await db.query("SELECT * FROM todo WHERE todo_id = $1",[id]);
        res.json(todo.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
});

//update a todo
app.put("/todos/:id",async(req,res)=>{
    try {
        const {id} = req.params;
        const {description}= req.body;
        const updateTodo = await db.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *",
            [description,id]);
        res.json(updateTodo.rows[0])
    } catch (error) {
        console.log(error.message);
    }
})

//delete a todo
app.delete("/todos/:id",async(req,res) =>{
    try {
        const {id} = req.params;
        const deleteTodo = await db.query("DELETE FROM todo WHERE todo_id = $1",[id]);
        res.json("Todo was deleted")
    } catch (error) {
        console.log(error.message);
    }
} );

const argv = yargs.option("drop",
    {
        alias: "d",
        description:"Drop Existing Database",
        type:"boolean",
    })
    .argv;

app.listen(5000,() => {
    console.log("server has started on port 5000");
    db.initialize(argv.drop);
});