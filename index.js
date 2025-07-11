const express=require('express');
const cors=require('cors')
require('dotenv').config()
const cookieParser=require('cookie-parser')
const jwt = require('jsonwebtoken');
const app=express();
const port=process.env.PORT||5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors({
    origin: ['http://localhost:5173','https://bloooddonate-1971.netlify.app'], // Allow requests from this frontend
    credentials: true, // Allow cookies and authentication headers
  }));
// app.use(cors()
app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
    const token=req?.cookies?.token
    // console.log('This is token',{token})
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' });
    }

    // verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' });
        }
        req.user = decoded;
        next();
    })
}

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
        const blogsDB = client.db("userDB").collection("blogs");
         const fundsDB = client.db("userDB").collection("funds");


         




        app.post('/jwt',async(req,res)=>{
            const user=req.body;
            const token=jwt.sign(user,process.env.JWT_SECRET,{expiresIn:'1h'})
            // console.log('tis is dskdl',token )
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", });
            res.send({success:true});
        })
        app.post('/logout',(req,res)=>{
            res.clearCookie('token',  { httpOnly: true, secure:false });
            res.send({success:true});
        })

        app.post("/addnewuser",async(req,res)=>{
            const user =req.body;
            console.log(user)
            const result = await userDB.insertOne(user);
            res.send(result)
        })
        app.post("/payment",async(req,res)=>{
            const user =req.body;
            console.log(user)
            const result = await fundsDB.insertOne(user);
            res.send(result)
        })
        app.post("/addnewblog",async(req,res)=>{
            const blog =req.body;
            console.log(blog)
            const result = await blogsDB.insertOne(blog);
            res.send(result)
        })
        app.post("/createnewdonationrequest",async(req,res)=>{
            const donation =req.body;
            console.log(donation)
            const result = await donationDB.insertOne(donation);
            res.send(result)
        })
        app.get("/mydonation",async(req,res)=>{
            const cursor = donationDB.find({});
            const allValues = await cursor.toArray();
            // console.log('cookies',req.cookies)
            res.send(allValues)
        })
        app.get("/all-user",async(req,res)=>{
            const cursor = userDB.find({});
            const allValues = await cursor.toArray();
            // console.log('cookies',req.cookies)
            res.send(allValues)
        })
        app.get("/totalfunds",async(req,res)=>{
            const cursor = fundsDB.find({});
            const allValues = await cursor.toArray();
            // console.log('cookies',req.cookies)
            res.send(allValues)
        })
        app.get("/all-blog",async(req,res)=>{
            const cursor = blogsDB.find({});
            const allValues = await cursor.toArray();
            // console.log('cookies',req.cookies)
            res.send(allValues)
        })
        app.get("/donation/:id",async(req,res)=>{
            const id=req.params.id
        // console.log("please delete  this user",id)
        const query = { _id: new ObjectId(id) };
        const donation = await donationDB.findOne(query);
        res.send(donation)
        })
        app.get("/blog/:id",async(req,res)=>{
            const id=req.params.id
        // console.log("please delete  this user",id)
        const query = { _id: new ObjectId(id) };
        const donation = await blogsDB.findOne(query);
        res.send(donation)
        })
        app.get("/login/:email", async(req,res)=>{
            const email=req.params.email
            // console.log("please  delete this user",id)
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
        app.put("/updateblogstatus/:id", async (req, res) => {
            const id=req.params.id
              const { status } = req.body;
              const filter = { _id: new ObjectId(id) };
              const options = { upsert: true };
              const updateDoc = {
                $set: {
                    status:status,
                },
              };
              const result = await blogsDB.updateOne(filter, updateDoc, options);
                 res.send(result)
          });
        app.put("/updatestatus/:id", async (req, res) => {
            const id=req.params.id
              const { status } = req.body;
              const filter = { _id: new ObjectId(id) };
              const options = { upsert: true };
              const updateDoc = {
                $set: {
                    status:status,
                },
              };
              const result = await userDB.updateOne(filter, updateDoc, options);
                 res.send(result)
          });
        app.put("/updaterole/:id", async (req, res) => {
            const id=req.params.id
              const { role } = req.body;
              const filter = { _id: new ObjectId(id) };
              const options = { upsert: true };
              const updateDoc = {
                $set: {
                    role:role,
                },
              };
              const result = await userDB.updateOne(filter, updateDoc, options);
                 res.send(result)
          });

          
        app.put("/updateprofile/:id", async (req, res) => {
            const id=req.params.id
              const { name, photo, selecteddistrict, selectedupazila, bloodGroup } = req.body;
              const filter = { _id: new ObjectId(id) };
              const options = { upsert: true };
              const updateDoc = {
                $set: {
                    name:name,
                    photo:photo,
                    selecteddistrict:selecteddistrict,
                    selectedupazila:selectedupazila,
                    bloodGroup:bloodGroup,
                 
                },
              };
              
          
              const result = await userDB.updateOne(filter, updateDoc, options);
                 res.send(result)
            
          });

        
        app.put("/updatedonation/:id", async(req,res)=>{
          const id=req.params.id
          const donation=req.body
          const filter = { _id: new ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
              $set: {
                requesterName:donation.requesterName,
                recipientName:donation.recipientName,
                hospitalName:donation.hospitalName,
                address:donation.address,
                date:donation.date,
                time:donation.time,
                requestMessage:donation.requestMessage,
               
                bloodGroup:donation.bloodGroup,
                selecteddistrict:donation.selecteddistrict,
                selectedupazila:donation.selectedupazila,
                donationStatus:donation.donationStatus,
              },
            };
          // console.log("please update this user",id,updateuser)
          const result = await donationDB.updateOne(filter, updateDoc, options);
          res.send(result)
      })
        app.put("/donate/:id", async(req,res)=>{
          const id=req.params.id
          const donation=req.body
          const filter = { _id: new ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
              $set: {
                donorName:donation.donorName,
                donorEmail:donation.donorEmail,
                donationStatus:donation.donationStatus,
              },
            };
          // console.log("please update this user",id,updateuser)
          const result = await donationDB.updateOne(filter, updateDoc, options);
          res.send(result)
      })
        app.put("/changedonatestatus/:id", async(req,res)=>{
          const id=req.params.id
          const donation=req.body
          const filter = { _id: new ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
              $set: {
                donationStatus:donation.donationStatus,
              },
            };
          // console.log("please update this user" ,id,updateuser)
          const result = await donationDB.updateOne(filter, updateDoc, options);
          res.send(result)
      })

      app.delete("/deleterequest/:id",async(req,res)=>{
        const id=req.params.id
        const query = { _id: new ObjectId(id) };
        const deleteResult = await donationDB.deleteOne(query);
        res.send(deleteResult)
    })
      app.delete("/deleteblog/:id",async(req,res)=>{
        const id=req.params.id
        const query = { _id: new ObjectId(id) };
        const deleteResult = await blogsDB.deleteOne(query);
        res.send(deleteResult)
    })



      // Connect the client to the serve            	(optional starting in v4.7)
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