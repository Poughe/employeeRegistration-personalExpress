const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient, ObjectID } = require('mongodb');
const { render } = require('ejs');
// const MongoClient = require('mongodb').MongoClient
require('dotenv').config({ path: './config/.env' });
const url = process.env.url;

var db, collection;
const dbName = "EmployeeDB";

app.listen(8000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if (error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/view', (req, res) => {
    db.collection('employees').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('view.ejs', { employees: result })
    })
})

app.post('/employees', (req, res) => {
    console.log(req.body)
    db.collection('employees').insertOne({ firstName: req.body.fname, lastName: req.body.lname, email: req.body.uid, phone: req.body.phone, pronoun: req.body.pronoun }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})

app.get('/update', (req, res) => {
    db.collection('employees').findOne({ _id: ObjectID(req.query.id) }, (err, result) => {
        // console.log(result);
        res.render('update.ejs', { employee: result })
    })
})

app.post('/updateEmployee', (req, res) => {
    db.collection('employees').findOneAndUpdate({ _id: ObjectID(req.body.id) }, {
        $set: {
            firstName: req.body.fname,
            lastName: req.body.lname,
            email: req.body.uid,
            phone: req.body.phone,
            pronoun: req.body.pronoun
        }
    }, {},
        (err, result) => {
            if (err) return res.send(err)
            console.log('saved to database')
            res.redirect('/view')
        })
})

app.delete('/employee', (req, res) => {
    db.collection('employees').findOneAndDelete({ _id: ObjectID(req.body.id) }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Employee deleted!')
    })
})



