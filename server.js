// Declare dependancies/variables

const express = require('express');
const app = express();
const mysql = require ('mysql2');
const dotenv = require ('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

// Connect to the database (library database)

const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

// Check if database connection works

db.connect((err) => {
    // Failed connection
    if(err) return console.log("Error connecting to mysql db");
    
    // Successful connection achieved
    console.log("Conection to mysql database was successful as id: ", db.threadId)

    //actual code goes here
    //GET method example
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    //data is file name
    app.get('/data', (req,res) => {
        //Retrieve data from database
        db.query('SELECT * from Members', (err,results) => {
            if (err){
                console.error(err);
                res.status(500).send('Error retrieving data');
            } else {
                //Display the records to the browser
                res.render('data', {results: results});
            }
        })
    })

    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);

        // Send a message to the browser

        console.log('Sending message to browser...');
        app.get('/', (req,res) => {
            res.send('Server started successfully!')
        })
    });
});