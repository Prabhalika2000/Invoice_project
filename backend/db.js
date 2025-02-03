const { MongoClient } = require("mongodb");

async function getConnection() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    //console.log("Connected to MongoDB");

    // Specify the database name (in this case, 'invoices')
    const db = client.db("invoices"); // This specifies the database to use

    return { client, db }; // Return the client and db object
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { getConnection };
