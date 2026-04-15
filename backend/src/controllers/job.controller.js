const Job = require('../models/Job');

// @desc    Crear trabajo
// @route   POST /api/jobs
// @access  Private (Contratante)
exports.createJob = async (req, res) => {
    try {
        if (req.userRole !== 'Contratante') {
            return res.status(403).json({ success: false, error: 'Solo los contratantes pueden publicar trabajos' });
        }

        // Add user to req.body
        req.body.employer = req.user.id;

        // Asegurarse de formatear correctamente las coordenadas
        if (req.body.longitude && req.body.latitude) {
            req.body.location = {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude]
            };
        }

        const job = await Job.create(req.body);

        res.status(201).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Obtener trabajos cercanos
// @route   GET /api/jobs/nearby?lng=...&lat=...&distance=10
// @access  Public
exports.getNearbyJobs = async (req, res) => {
    try {
        const { lng, lat, distance } = req.query; // distance in km

        if (!lng || !lat) {
            const jobs = await Job.find().populate('employer', 'name averageRating');
            return res.status(200).json({ success: true, count: jobs.length, data: jobs });
        }

        // Calcular radio en radianes (Tierra radius = 6378 km)
        const radius = distance ? distance / 6378 : 10 / 6378;

        const jobs = await Job.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius]
                }
            }
        }).populate('employer', 'name averageRating');

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Obtener mis trabajos publicados (si es contratante)
// @route   GET /api/jobs/me
// @access  Private (Contratante)
exports.getMyEmployerJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user.id })
            .populate('applicants.user', 'name averageRating skills');
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Aplicar a un trabajo
// @route   POST /api/jobs/:id/apply
// @access  Private (Trabajador)
exports.applyForJob = async (req, res) => {
    try {
        if (req.userRole !== 'Trabajador') {
            return res.status(403).json({ success: false, error: 'Solo los trabajadores pueden aplicar' });
        }

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, error: 'Trabajo no encontrado' });
        }

        // Check if already applied
        const hasApplied = job.applicants.find(app => app.user.toString() === req.user.id);
        if (hasApplied) {
            return res.status(400).json({ success: false, error: 'Ya has aplicado a este trabajo' });
        }

        job.applicants.push({ user: req.user.id });
        await job.save();

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
