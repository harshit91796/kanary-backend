const Log = require('../models/Log');
const { logFilterSchema } = require('../validator/log.joi');
const mongoose = require('mongoose');

const getLogs = async (req, res) => {
    try {
        console.log('User object:', JSON.stringify(req.user));
        console.log('Is admin?', req.user.isAdmin);

        const { error, value } = logFilterSchema.validate(req.query);
        if (error) {
            return res.status(400).json({ message: 'Invalid query parameters', error: error.details });
        }

        const { page = 1, limit = 10, actionType, startDate, endDate, includeDeleted = false, userName, userRole, userId, logId, objectId } = value;
        
        // Construct the base query
        let query = {};

        // Add filters
        if (actionType) {
            query.actionType = actionType;
        }

        if (startDate && endDate) {
            query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        if (!includeDeleted) {
            query.isDeleted = false;
        }

        if (userName) {
            query.userName = userName;
        }

        if (userRole) {
            query.userRole = userRole;
        }

        if (userId) {
            query.userId = userId;
        }

        if (logId) {
            query._id = logId;
        }

        if (objectId) {
            if (mongoose.Types.ObjectId.isValid(objectId)) {
                query.$or = [
                    { _id: objectId },
                    { userId: objectId }
                ];
            } else {
                // If not a valid ObjectId, treat it as a username
                query.$or = [
                    { userName: new RegExp(objectId, 'i') }  // Case-insensitive username search
                ];
            }
        }

        // Apply user-specific filter for non-admin users
        if (!req.user.isAdmin) {
            if (query.$or) {
                query.$and = [
                    { $or: query.$or },
                    { userId: new mongoose.Types.ObjectId(req.user._id) }
                ];
                delete query.$or;
            } else {
                query.userId = new mongoose.Types.ObjectId(req.user._id);
            }
            console.log('Applying user-specific filter');
        } else {
            console.log('User is admin, not applying user-specific filter');
        }

        console.log('Final query:', JSON.stringify(query));

        // Single database call to get total count and logs
        const [totalLogs, logs] = await Promise.all([
            Log.countDocuments(query),
            Log.find(query)
                .sort({ timestamp: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .allowDiskUse(true)
        ]);
        
        console.log('Total logs found:', totalLogs);
        console.log('Logs retrieved:', logs.length);

        // Log the structure of the first log
        if (logs.length > 0) {
            console.log('Sample log structure:', JSON.stringify(logs[0]));
        }

        res.json({
            logs,
            totalPages: Math.ceil(totalLogs / limit),
            currentPage: page,
            totalLogs,
            includeDeleted
        });
    } catch (error) {
        console.error('Error in getLogs:', error);
        res.status(500).json({ message: 'Error fetching logs', error: error.message });
    }
};

const searchLogs = async(req,res)=>{

}


const softDeleteLog = async (req, res) => {
    try {
      const log = await Log.findById(req.params.id);
      if (!log) {
        return res.status(404).json({ message: 'Log not found' });
      }
      log.isDeleted = true;
      await log.save();
      res.json({ message: 'Log soft deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting log', error: error.message });
    }
}

module.exports = {
    getLogs,
    softDeleteLog,
}
