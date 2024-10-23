const logger = require('../config/logger');
const Log = require('../models/Log');

const logAction = async (req, res, next) => {
  const { method, originalUrl, user } = req;
  console.log('originalUrl', originalUrl , "user", req.user);

  // action type based on the request
  let actionType;
  if (originalUrl.includes('/api/logs')) {
    if (method === 'GET') {
      actionType = 'read';
    } else if (method === 'DELETE') {
      actionType = 'delete';
    }
  } else if (originalUrl.includes('/api/users/signup')) {
    actionType = 'signup';
  } else if (originalUrl.includes('/api/users/login')) {
    actionType = 'login';
  } else if (originalUrl.includes('/api/users/logout')) {
    actionType = 'logout';
  } else {
    
    switch (method) {
      case 'GET':
        actionType = 'read';
        break;
      case 'POST':
        actionType = 'create';
        break;
      case 'PUT':
      case 'PATCH':
        actionType = 'update';
        break;
      case 'DELETE':
        actionType = 'delete';
        break;
      default:
        actionType = 'unknown';
    }
  }

  
  const originalJson = res.json;

  // Override the json function
  res.json = function(body) {
    // Restore the original json function
    res.json = originalJson;

    // Create the log entry
    const logData = {
      actionType,
      userId: user ? user._id : body._id, // Use body._id for login action
      userName: user ? user.name : body.name || 'anonymous', // Use body.name for login action
      userRole: user ? user.role : body.role || 'anonymous', // Use body.role for login action
      additionalData: {
        url: originalUrl,
        method,
        statusCode: res.statusCode,
        requestBody: req.body,
        // Only include responseBody if it's not a logs request
        responseBody: !originalUrl.includes('/api/logs') ? body : undefined
      }
    };

    // create the log entry
    Log.create(logData).catch(error => {
      console.error('Error creating log:', error);
      logger.error('Failed to create log entry', { error: error.message, logData });
    });

    // Call the original json function
    return originalJson.call(this, body);
  };

  next();
};

module.exports = { logAction };
