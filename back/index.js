const express = require("express");
const multer = require("multer");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const corsOptions = {
    origin: ["http://localhost:5173"],
};

// Configuration of multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // upload folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

PORT = 8080
const SECRET_KEY = 'jwtsecret';

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

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

app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    // Crypt the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Add the standard user role
    const roleId = 1;

    const query = `INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)`;
    db.query(query, [name, email, hashedPassword, roleId], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'User registered Successfully!' });
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = results[0];

        // Verify password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Create a JWT token
        const token = jwt.sign({
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            role_id: user.role_id,
            profile_picture: user.profile_picture
        }, SECRET_KEY, {
            expiresIn: '1h'
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                profile_picture: user.profile_picture
            }
        });
    });
});

// Middleware function verifying JWT token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing!' });
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
}

app.get("/users/profile", authenticateToken, (req, res) => {
    const userId = req.user.user_id;

    const query = `SELECT user_id, name, email, role_id, profile_picture FROM users WHERE user_id = ?`;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user profile:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];
        res.json({
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                profile_picture: user.profile_picture
            }
        });
    });
});

app.put("/users/profile", authenticateToken, upload.single('profile_picture'), (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.user_id;
    let profilePicturePath = req.body.profile_picture;

    // if another file was upload
    if (req.file) {
        profilePicturePath = req.file.path;
    }

    const query = `UPDATE users SET name = ?, email = ?, profile_picture = ? WHERE user_id = ?`;
    db.query(query, [name, email, profilePicturePath, userId], (err, result) => {
        if (err) {
            console.error('Error updating user profile:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Olds users informations
        const updatedUserQuery = `SELECT user_id, name, email, role_id, profile_picture FROM users WHERE user_id = ?`;
        db.query(updatedUserQuery, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching updated user profile:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const updatedUser = results[0];
            res.json({
                message: 'Profile updated successfully',
                user: {
                    id: updatedUser.user_id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role_id: updatedUser.role_id,
                    profile_picture: updatedUser.profile_picture
                }
            });
        });
    });
});

// aministrator side

// admin signup
app.post("/admin/signup", (req, res) => {
    const { name, email, password, secretKey } = req.body;

    // verify SECRET_KEY
    if (secretKey !== process.env.SECRET_KEY) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    console.log('Received SecretKey:', secretKey);
    console.log('Expected SecretKey:', process.env.SECRET_KEY);

    // Crypt password
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = `INSERT INTO admin_users (name, email, password, role_id) VALUES (?, ?, ?, ?)`;
    db.query(query, [name, email, hashedPassword, 2], (err, result) => {
        if (err) {
            console.error('Error inserting admin:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'Admin registered successfully!' });
    });
});

app.get("/api", (req, res) => {
    res.json({fruits: ["apple", "orange", "banana"]});
});

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});