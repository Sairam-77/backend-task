var express = require('express');
var router = express.Router();
let { mongodb, MongoClient, dbURL } = require('../dbConfig')

/* GET users listing. */
router.get('/all', async (req, res,) => {
  const client = await MongoClient.connect(dbURL);
  try {
    const db = await client.db('project1');
    let document = await db.collection('user').find().toArray();
    res.json({ message: "data fetched successfully", users: document })
  } catch (err) {
    res.json({ message: "Internal server error!" })
  }
  finally {
    client.close()
  }
});

// POST user listing
router.post("/register", async (req, res) => {
  const client = await MongoClient.connect(dbURL);
  try {
    const db = await client.db('project1');
    let user = await db.collection('user').findOne({ email: req.body.email });
    if (user) {
      res.json({ message: "user already exist" })
    } else {
      let document = await db.collection('user').insertOne(req.body);
      res.json({ message: "user added successfully", document })
    }
  } catch (error) {
    res.json({ message: "Internal server error!" })
  }
  finally {
    client.close();
  }
})

// PUT request

router.put('/edit/:id', async (req, res) => {
  const client = await MongoClient.connect(dbURL);
  try {
    const db = await client.db('project1');
    let document = await db.collection('user').findOneAndReplace({ _id: mongodb.ObjectId(req.params.id) }, req.body)
    if (document.value) {
      res.json({ message: "user updated successfully", data: document })
    } else {
      res.status(404).json({ message: "invalid id" })
    }

  } catch (err) {
    console.log(err);
    res.json({ message: "internal server error" })
  }
})

// DELETE request

router.delete('/delete/:id', async (req, res) => {
  const client = await MongoClient.connect(dbURL);
  try {
    const db = await client.db('project1');
    let document = await db.collection('user').findOneAndDelete({ _id: mongodb.ObjectId(req.params.id) })
    if (document.value) {
      res.json({ message: "user deleted successfully", data: document })
    } else {
      res.status(404).json({ message: "invalid id" })
    }

  } catch (err) {
    console.log(err);
    res.json({ message: "internal server error" })
  }
})




module.exports = router;
