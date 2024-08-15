const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
};

PORT = 8080

app.use(cors(corsOptions));

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'museum'
})

app.get("/users", (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
});

app.get("/api", (req, res) => {
    res.json({fruits: ["apple", "orange", "banana"]});
});

app.listen(PORT, () => {
    console.log("Server started on port 8080");
});