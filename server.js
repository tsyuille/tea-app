const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 4000
require('dotenv').config()

let db, 
dbStr = process.env.dbConnectionStr,
dbName = 'tea'

MongoClient.connect(dbStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded( { extended: true }))
app.use(express.json())

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/', (req, res) => {
    db.collection('tea').find().toArray()
    .then(data => {
        res.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.post('/addTea', (req, res) => {
    db.collection('tea').insertOne(req.body)
    .then(res => {
        console.log('Tea Added')
        res.redirect('/')
    })
    .catch(error => console.error(error))
})