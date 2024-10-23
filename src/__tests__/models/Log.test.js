const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Log = require('../../models/Log');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Log Model Test', () => {
  it('create & save log successfully', async () => {
    const logData = {
      actionType: 'create',
      userId: new mongoose.Types.ObjectId(),
      userRole: 'user',
    };
    const validLog = new Log(logData);
    const savedLog = await validLog.save();
    
    expect(savedLog._id).toBeDefined();
    expect(savedLog.actionType).toBe(logData.actionType);
    expect(savedLog.userId).toEqual(logData.userId);
    expect(savedLog.userRole).toBe(logData.userRole);
    expect(savedLog.isDeleted).toBe(false);
  });
});
