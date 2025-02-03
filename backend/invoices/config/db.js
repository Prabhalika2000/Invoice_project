const { MongoClient } = require("mongodb");
async function getConnection() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
  //  console.log("Connected to MongoDB");

    // Ensure this line correctly assigns the db object
    const db = client.db("invoices");

    return { client, db }; // Ensure db is the correct object
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = { getConnection };
