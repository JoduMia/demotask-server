const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vluynqu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



const dbConnection = async () => {
    try {
        const database = client.db('taskdb').collection('tasks');


        app.post('/addtask', async (req, res) => {
            const { author, image, taskName,schedule } = req.body;
            const updateDoc = {
                task: taskName,schedule, author, image, status:'incomplete'
            };
            const result = await database.insertOne(updateDoc);
            res.send(result)
            console.log(result);
        })

        app.get('/tasks', async (req, res) => {
            const email = req.query.email;
            const query = { author: email };
            const result = await database.find(query).toArray()
            res.send(result);
            console.log(result);
        })

        app.get('/completedtasks', async (req, res) => {
            const email = req.query.email;
            const query = { author: email, status: 'complete' };
            const result = await database.find(query).toArray()
            res.send(result);
            console.log(result);
        })

        app.delete(`/deletetask/:id`, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await database.deleteOne(query);
            res.send(result);
        })

        app.patch('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const dataToUpdate = {
                $set: {
                    status: 'complete'
                }
            }
            const result = await database.updateOne(query, dataToUpdate);
            res.send(result);
            console.log(result);
        })





    }
    finally { }
}

dbConnection()
    .catch(err => res.send({
        status: 'error',
        data: err
    }))


app.listen(process.env.PORT || 5000, () => {
    console.log(`server is listening on port:${process.env.PORT}`);
})