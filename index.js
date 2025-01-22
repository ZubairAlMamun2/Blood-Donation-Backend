const express=require('express');
const cors=require('cors')
require('dotenv').config()
const cookieParser=require('cookie-parser')
const jwt = require('jsonwebtoken');
const app=express();
const port=process.env.PORT||5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors({
    origin: ['http://localhost:5173','https://academicelit.netlify.app','https://donate-for-people.firebaseapp.com','https://donate-for-people.web.app'], // Allow requests from this frontend
    credentials: true, // Allow cookies and authentication headers
  }));
// app.use(cors())
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ispqqvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {

        const userDB = client.db("userDB").collection("users");
        const donationDB = client.db("userDB").collection("donation");


        app.post("/addnewuser",async(req,res)=>{
            const user =req.body;
            console.log(user)
            const result = await userDB.insertOne(user);
            res.send(result)
        })
        app.post("/createnewdonationrequest",async(req,res)=>{
            const donation =req.body;
            console.log(donation)
            const result = await donationDB.insertOne(donation);
            res.send(result)
        })

        app.get("/login/:email", async(req,res)=>{
            const email=req.params.email
            // console.log("please delete this user",id)
            const query = { email: email };
            const user = await userDB.findOne(query);
            res.send(user)
            
        })
        app.get("/user/:email", async(req,res)=>{
            const email=req.params.email
            // console.log("please delete this user",id)
            const query = { email: email };
            const user = await userDB.findOne(query);
            res.send(user)
            
        })

        // app.put("/updateprofile", async (req, res) => {
        //     try {
        //       const { email, name, avatar, selecteddistrict, selectedupazila, bloodGroup } = req.body;
          
        //       const updatedUser = await userDB.findOneAndUpdate(
        //         { email }, // Find user by email
        //         { name, avatar, selecteddistrict, selectedupazila, bloodGroup }, // Update these fields
        //         { new: true } // Return the updated document
        //       );
          
        //       if (!updatedUser) {
        //         return res.status(404).send({ error: "User not found" });
        //       }
          
        //       res.send(updatedUser);
        //     } catch (error) {
        //       res.status(500).send({ error: "Internal Server Error" });
        //     }
        //   });

          app.put("/updateprofile/:id", async(req,res)=>{
            const id=req.params.id
            const user=req.body
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  name:user.name,
                  avatar:user.photo,
                  selecteddistrict:user.selecteddistrict,
                  selectedupazila:user.selectedupazila,
                  bloodGroup:user.bloodGroup
                },
              };
            // console.log("please update this user",id,updateuser)
            const result = await userDB.updateOne(filter, updateDoc, options);
            res.send(result)
        })
          



      // Connect the client to the server	(optional starting in v4.7)
    //   await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);



app.get("/",(req,res)=>{
    res.send("Blood donation server is running")
})

app.listen(port,()=>{
    console.log(`server is running at ${port} `)
})