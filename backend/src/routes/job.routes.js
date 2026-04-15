const express = require('express');
const { createJob, getNearbyJobs, getMyEmployerJobs, applyForJob } = require('../controllers/job.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
    .post(protect, createJob);

router.route('/nearby')
    .get(getNearbyJobs);

router.route('/me')
    .get(protect, getMyEmployerJobs);    

router.route('/:id/apply')
    .post(protect, applyForJob);

module.exports = router;
