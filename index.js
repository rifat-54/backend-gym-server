const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// cluster-01
// yOdQzEuc9JCXe53R

// gym01
// 3BMGdrBC4AO5BFdN

// const uri ="mongodb://localhost:27017"

// const uri =
//   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.umkvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri =
  "mongodb+srv://gym01:3BMGdrBC4AO5BFdN@cluster0.umkvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function Main() {
  try {
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });

    const gymSheduel = client.db("gym-sheduel").collection("sheduel");

    app.post("/sheduel", async (req, res) => {
      const data = req.body;
      const result = await gymSheduel.insertOne(data);
      res.send(result);
    });

    app.get("/sheduel", async (req, res) => {
      const { searchParams } = req.query;
      let option = {};
      if (searchParams) {
        option = { title: { $regex: searchParams, $options: "i" } };
      }
      const result = await gymSheduel.find(option).toArray();
      res.send(result);
    });
    app.get("/sheduel", async (req, res) => {
      const result = await gymSheduel.find().toArray();
      res.send(result);
    });

    app.delete("/sheduel/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gymSheduel.deleteOne(query);
      res.send(result);
    });

    app.get("/sheduel/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gymSheduel.findOne(query);
      res.send(result);
    });

    app.patch("/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          title: data?.title,
          // time:data?.time,
          // day:data?.day,
          // date:data?.date,
        },
      };
      const result = await gymSheduel.updateOne(query, update);
      res.send(result);
    });

    app.patch("/status/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          isComplited: true,
        },
      };
      const result = await gymSheduel.updateOne(query, update);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log(error);
  }
}

Main();

app.get("/", (req, res) => {
  res.send("hello server is running");
});

app.listen(port, () => {
  console.log("server is running");
});
