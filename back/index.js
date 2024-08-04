const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
};

PORT = 8080

app.use(cors(corsOptions));

app.get("/api", (req, res) => {
    res.json({fruits: ["apple", "orange", "banana"]});
});

app.listen(PORT, () => {
    console.log("Server started on port 8080");
});