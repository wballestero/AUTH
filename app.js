//=======================var and const==============
const express = require('express')
const app = express()
app.use(express.urlencoded({
    extended: true
}))
const userRoutes = require('./routes/user')
//const mongoose = require('mongoose')
const mongo = require('mongodb')
const { MongoClient, ServerApiVersion } = require('mongodb');
const env = require('dotenv/config')

const client = new MongoClient(process.env.db, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const port =  3000
//=======================init server==============
app.use(express.json())

app.listen('3000', () => {
    console.log('Server is  running!!!');
})
//=======================init mongodb==============
async function run() {
    try {

       // await client.connect();
       // await deleteLogin(client,"will")  
     //console.log("Connected to MongoDB!");
            } finally {
        // Ensures that the client will close when you finish/error
         //await client.close();
    }
}
run().catch(console.dir);

async function listDatabases(client){

    const databases = await client.db().admin().listDatabases();
    console.log(databases);
    databases.databases.forEach(db => {
        console.log(db.name)
    });

}
async function createLogin(client, Login){
    const result = await client.db(process.env.mongodatabase).collection(process.env.user).
    insertOne(Login);
    console.log(result.insertedId)
}

async function authLogin(client, Login){
    const result = await client.db("gembakaiUser").collection("user").
    findOne({correo: Login});
    console.log(result)
}

async function findStates(client, {
    estado = String
}={}){
    const cursor = client.db("gembakaiUser").collection("user").
    find({estado:{$gte:estado}});
   const result = await cursor.toArray();
    console.log(result)
}

async function updateLogin(client,login,estado){
    const result = await client.db("gembakaiUser").collection("user").
    updateOne({correo: login},{$set:estado});
 
    console.log(result)
}


async function deleteLogin(client, Login){
    const result = await client.db("gembakaiUser").collection("user").
    deleteOne({correo:Login});
    console.log(result.insertedId)
}
app.use('/api/v1/', userRoutes);


