const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const cacheDir = path.join(__dirname, '..', '.cache', 'mongodb-binaries');
require('fs').mkdirSync(cacheDir, { recursive: true });

// Increase timeout to 60 seconds
jest.setTimeout(60000);

// Setup in-memory MongoDB before tests
beforeAll(async () => {
  // Add this configuration:
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '7.0.14', // Match your MongoDB version
      downloadDir: './.cache/mongodb-binaries' // Cache directory
    },
    instance: {
      dbName: 'testDB'
    }
  });
  
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}, 30000); // Increase timeout to 30 seconds

// Clean up database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Disconnect and stop after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});