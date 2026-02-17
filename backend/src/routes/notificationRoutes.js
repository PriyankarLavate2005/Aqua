const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    deleteNotification,
    clearAllNotifications,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
    .get(getNotifications)
    .post(createNotification)
    .delete(clearAllNotifications);

router.put('/read-all', markAllAsRead);

router.route('/:id')
    .put(markAsRead)
    .delete(deleteNotification);

module.exports = router;
