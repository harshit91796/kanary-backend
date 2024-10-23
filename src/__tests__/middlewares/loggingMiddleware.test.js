const { logAction } = require('../../middlewares/loggingMiddleware');
const Log = require('../../models/Log');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}, 10000);

afterAll(async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
});

describe('Logging Middleware', () => {
  beforeEach(async () => {
    await Log.deleteMany({});
  });

  it('should create a log entry', async () => {
    const req = {
      method: 'POST',
      originalUrl: '/api/users',
      user: { _id: new mongoose.Types.ObjectId(), role: 'user' },
      body: { name: 'Test User' },
    };
    const res = {};
    const next = jest.fn();

    await logAction(req, res, next);

    const logs = await Log.find();
    expect(logs.length).toBe(1);
    expect(logs[0].actionType).toBe('create');
    expect(logs[0].userId.toString()).toBe(req.user._id.toString());
    expect(logs[0].userRole).toBe('user');
    expect(logs[0].additionalData.method).toBe('POST');
    expect(logs[0].additionalData.url).toBe('/api/users');
    expect(logs[0].additionalData.body).toEqual({ name: 'Test User' });

    expect(next).toHaveBeenCalled();
  });
});
