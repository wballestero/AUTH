const express = require('express')
const router = express.Router()

const mongo = require('mongodb')
const { MongoClient, ServerApiVersion } = require('mongodb');
const env = require('dotenv/config')
const client = new MongoClient(process.env.DB, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

router.get('/home', (req, res) => {
    // const salesOnApril4th = db.getCollection('user').find({
    //     date: { $gte: new Date('2014-04-04'), $lt: new Date('2014-04-05') }
    //   }).count();
    res.json({
        body: {
            message: 'Home Api'
        }
    })
})

router.post('/addLogin', async (req, res) => {

    try {
        await client.connect();
        const login = {
            correo: req.body.correo,
            estado: req.body.estado,
            iDate: req.body.iDate,
            fDate: req.body.fDate
        }
        const result = await client.db(process.env.MONGODATABASE).collection(process.env.COLLECTION).
            insertOne(login);
        console.log(result.insertedId)

        res.status(200).json(result)


    } catch (err) {
      //  console.log(err)
        res.status(202).json({
            "ERROR": err.message
        })
        handleError(error);
    }

    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

});

router.post('/authLogin', async (req, res) => {
    try {
        const result = await viewLoginMongo(req.body.correo);
        if (result) {
            res.status(200).json(result.estado)
        } else {
            res.status(200).json("false")
        }

    } catch (err) {
       // console.log(err)
        res.status(202).json({
            "ERROR": err.message
        })
        handleError(error);
    }
});

router.get('/login', async (req, res) => {
    try {
        const result = await viewLoginMongo(req.query.correo);
        if (result) {
            res.status(200).json(result.estado)
        } else {
            res.status(200).json("false")
        }
    } catch (err) {
      //  console.log(err)
        res.status(202).json({
            "ERROR": err.message
        })
        handleError(error);
    }
});

router.post('/updateLogin', async (req, res) => {
    try {
        await client.connect();
        const login = {
            estado: req.body.estado,
            iDate: req.body.iDate,
            fDate: req.body.fDate
        }
        const result = await client.db(process.env.MONGODATABASE).collection(process.env.COLLECTION).
            updateOne({ correo: req.body.correo }, { $set: login });
        const result2 = await viewLoginMongo(req.body.correo)
     //   console.log(result.insertedId)
        res.status(200).json(result2)
    } catch (err) {
      //  console.log(err)
        res.status(202).json({
            "ERROR": err.message
        })
        handleError(error);
    }

    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

router.post('/viewLogin', async (req, res) => {
    try {
        const result = await viewLoginMongo(req.body.correo)
        res.status(200).json(result)
    } catch (err) {
      //  console.log(err)
        res.status(202).json({
            "ERROR": err.message
        });
        handleError(error);
    }
});

async function viewLoginMongo(login) {

    try {
        const timestamp = Date.now();
        const fechaHora = new Date(timestamp);
        const formatoFechaHora = fechaHora.toLocaleString();

        await client.connect();
        const result = await client.db(process.env.MONGODATABASE).collection(process.env.COLLECTION).
            findOne({ correo: login });
        console.log("Evento login ", login, " hora: ", formatoFechaHora)
        return result;
    } catch (err) {
        console.log(err);
        res.status(202).json({
            "ERROR": err.message
        })
        handleError(error);
    }
    finally {
        await client.close();
    }
}

async function viewAllLoginMongo({
    estado = String
} = {}) {

    try {
        await client.connect();
        const cursor = await client.db(process.env.MONGODATABASE).collection(process.env.COLLECTION).
            find({ estado: { $gte: estado } });

        const result = await cursor.toArray();
        return result
    } catch (err) {
        console.log(err);
        res.status(202).json({
            "ERROR": err.message
        })
        handleError(error);
    }
    finally {
        await client.close();
    }
}

router.post('/viewAllLogin', async (req, res) => {

    try {
        const result = await viewAllLoginMongo({ estado: req.body.estado })
        res.status(200).json(result)
    } catch (err) {
        //console.log(err)
        res.status(202).json({
            "ERROR": err.message
        })
        handleError(error);
    }

});

module.exports = router