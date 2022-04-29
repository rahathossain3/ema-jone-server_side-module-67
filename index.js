const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bggeb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('emaJohn').collection('product');

        //get all product
        app.get('/product', async (req, res) => {
            // for get query 
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const query = {};
            const cursor = productCollection.find(query);

            // for pagination
            let products;
            if (page || size) {
                // 0 --> skip : 0 get: 0-10 (10):
                // 1 --> skip : 1*10 get: 11-20 (10):
                // 2 --> skip : 2*10 get: 21-30 (10):
                // 3 --> skip : 3*10 get: 31-40 (10):
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }

            res.send(products);

        });

        // for pagination
        app.get('/productCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            // res.json(count)
            res.send({ count });

        })



    }
    finally {

    }

}
run().catch(console.dir);



// client.connect(err => {
//     const collection = client.db("emaJohn").collection("product");
//     // perform actions on the collection object
//     console.log('mongo is connected')
//     client.close();
// });





app.get('/', (req, res) => {
    res.send('john is running waiting for ema');
});

app.listen(port, () => {
    console.log('john is  running on port', port);
});