const express = require('express');
const { createJob, getNearbyJobs, getMyEmployerJobs, applyForJob, getMyApplications, acceptApplicant, completeJob, reviewWorker, editJob } = require('../controllers/job.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
    .post(protect, createJob);

router.route('/:id')
    .put(protect, editJob);

router.route('/nearby')
    .get(getNearbyJobs);

router.route('/me')
    .get(protect, getMyEmployerJobs);    

router.route('/my-applications')
    .get(protect, getMyApplications);

router.route('/:id/apply')
    .post(protect, applyForJob);

router.route('/:id/applicants/:userId/accept')
    .put(protect, acceptApplicant);

router.route('/:id/complete')
    .put(protect, completeJob);

router.route('/:id/review')
    .post(protect, reviewWorker);

module.exports = router;
