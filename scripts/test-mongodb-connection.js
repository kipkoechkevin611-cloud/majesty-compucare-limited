// MongoDB Connection Diagnostic Script
const { MongoClient } = require('mongodb');

// Get URI from environment or use the provided one
const uri = process.env.DATABASE_URL || 'mongodb+srv://kipkoechkevin611_db_user:kevin123@cluster0.ghh0bgd.mongodb.net/?retryWrites=true&w=majority';

async function diagnoseMongoDB() {
  const client = new MongoClient(uri);

  try {
    console.log('=== MongoDB Connection Diagnostic ===\n');

    // Test connection
    console.log('1. Testing connection to MongoDB Atlas...');
    await client.connect();
    console.log('✓ Connection successful\n');

    // List databases
    console.log('2. Listing all databases on cluster...');
    const admin = client.db().admin();
    const databases = await admin.listDatabases();
    console.log('Available databases:');
    databases.databases.forEach(db => {
      console.log(`  - ${db.name} (size: ${(db.sizeOnDisk / 1024).toFixed(2)} KB)`);
    });
    console.log();

    // Try to connect to specific databases
    const possibleDbNames = ['majesty-compucare', 'majestycompucare', 'majesty', 'test', 'admin'];

    for (const dbName of possibleDbNames) {
      console.log(`3. Checking database: ${dbName}...`);
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();

      if (collections.length > 0) {
        console.log(`✓ Database "${dbName}" exists with ${collections.length} collections:`);
        for (const coll of collections) {
          const count = await db.collection(coll.name).countDocuments();
          console.log(`  - ${coll.name}: ${count} documents`);
        }
        console.log();

        // Sample documents from each collection
        console.log(`Sample documents from "${dbName}":`);
        for (const coll of collections) {
          const sample = await db.collection(coll.name).findOne();
          if (sample) {
            console.log(`  Collection "${coll.name}" sample:`);
            console.log(`    ID: ${sample._id}`);
            console.log(`    Keys: ${Object.keys(sample).slice(0, 5).join(', ')}...`);
          }
        }
        console.log();
      } else {
        console.log(`✗ Database "${dbName}" is empty or doesn't exist\n`);
      }
    }

  } catch (error) {
    console.error('✗ Connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.close();
    console.log('\n=== Diagnostic Complete ===');
  }
}

diagnoseMongoDB();
