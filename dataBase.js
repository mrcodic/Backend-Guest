// Define MongoDB connection parameters
const host = "<hostname>"; // Replace <hostname> with your MongoDB hostname
const port = "<port>"; // Replace <port> with your MongoDB port
const database = "Alkhaldi"; // Replace <database> with your MongoDB database name

// Connect to MongoDB
const conn = new Mongo(`mongodb://${host}:${port}`);
const db = conn.getDB(database);

// Get the list of collections in the database
const collections = db.getCollectionNames();

// Create an array to store all data
let allData = [];

// Iterate over each collection
collections.forEach((collectionName) => {
	const collection = db.getCollection(collectionName);
	// Find all documents in the collection and add them to allData
	allData = allData.concat(collection.find().toArray());
});

// Write the combined data to a JSON file
const outputFilename = "combined_output.json";
print("Writing data to " + outputFilename + "...");
writeFile(outputFilename, JSON.stringify(allData, null, 4));
print("Data written successfully!");
