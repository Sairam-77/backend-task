var express = require('express');
var router = express.Router();
let { mongodb, MongoClient, dbURL } = require('../dbConfig');
const { hashing, hashCompare } = require('../hashing');
const { log } = require('debug/src/node');


router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const client = await MongoClient.connect(dbURL);
    const db = client.db('devship');

    let existingUser = await db.collection('user').findOne({ $or: [{ userName: req.body.userName }, { email: req.body.email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with same username or email" });
    }

    let { password } = req.body;
    let hash = await hashing(password);
    req.body.password = hash;

    let newUser = await db.collection('user').insertOne(req.body);
    res.json({ message: "User added successfully", document: newUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  const client = await MongoClient.connect(dbURL);
  try {
    const db = await client.db('devship');
    let user = await db.collection('user').findOne({ $or: [{ userName: req.body.name }, { email: req.body.name }] });
    if (!user) {
      res.status(400).json({ message: "user not exist" })
    }
    let { password } = req.body
    let hash = await hashCompare(password, user.password);
    console.log(hash, user);
    if (!hash) {
      res.status(400).json({ message: "password was worng" })
    }


    res.status(200).json({ message: "user logged in successfully", user })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" })
  }

})

router.get('/', (req, res) => {
  return res.send("dhvkdhv")
})



module.exports = router;
