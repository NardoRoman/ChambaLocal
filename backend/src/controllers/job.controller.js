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
            const jobs = await Job.find({ status: 'Abierto' }).populate('employer', 'name averageRating');
            return res.status(200).json({ success: true, count: jobs.length, data: jobs });
        }

        // Calcular radio en radianes (Tierra radius = 6378 km)
        const radius = distance ? distance / 6378 : 10 / 6378;

        const jobs = await Job.find({
            status: 'Abierto',
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

        const { message } = req.body;

        job.applicants.push({ user: req.user.id, message });
        await job.save();

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Obtener mis postulaciones (si es trabajador)
// @route   GET /api/jobs/my-applications
// @access  Private (Trabajador)
exports.getMyApplications = async (req, res) => {
    try {
        if (req.userRole !== 'Trabajador') {
            return res.status(403).json({ success: false, error: 'Solo los trabajadores tienen postulaciones' });
        }

        // Buscar trabajos donde el usuario actual esté en el arreglo de applicants
        const jobs = await Job.find({ 'applicants.user': req.user.id })
            .populate('employer', 'name email averageRating'); // email visible solo si es aceptado en frontend

        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Aceptar postulante
// @route   PUT /api/jobs/:id/applicants/:userId/accept
// @access  Private (Contratante)
exports.acceptApplicant = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, error: 'Trabajo no encontrado' });

        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'No autorizado' });
        }

        const applicant = job.applicants.find(app => app.user.toString() === req.params.userId);
        if (!applicant) return res.status(404).json({ success: false, error: 'Postulante no encontrado' });

        // Cambiar estatus de este applicant a Aceptado, y los demás a Rechazado
        job.applicants.forEach(app => {
            if (app.user.toString() === req.params.userId) {
                app.status = 'Aceptado';
            } else {
                app.status = 'Rechazado';
            }
        });

        job.worker = req.params.userId;
        job.status = 'En Progreso';
        
        await job.save();

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Completar trabajo
// @route   PUT /api/jobs/:id/complete
// @access  Private (Contratante)
exports.completeJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, error: 'Trabajo no encontrado' });

        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'No autorizado' });
        }

        job.status = 'Completado';
        await job.save();

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Añadir reseña al trabajador
// @route   POST /api/jobs/:id/review
// @access  Private (Contratante)
exports.reviewWorker = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const job = await Job.findById(req.params.id);
        
        if (!job) return res.status(404).json({ success: false, error: 'Trabajo no encontrado' });
        if (job.employer.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'No autorizado' });
        if (job.status !== 'Completado') return res.status(400).json({ success: false, error: 'El trabajo debe estar completado para dejar reseña' });
        if (!job.worker) return res.status(400).json({ success: false, error: 'No hay un trabajador asignado a este trabajo' });

        const User = require('../models/User'); // Requerimos User aquí
        const worker = await User.findById(job.worker);

        // Verificar si ya dejó reseña para este trabajo
        const hasReviewed = worker.reviews.find(r => r.job.toString() === job._id.toString());
        if (hasReviewed) {
            return res.status(400).json({ success: false, error: 'Ya has calificado a este trabajador por este trabajo' });
        }

        const review = {
            rating: Number(rating),
            comment,
            reviewer: req.user.id,
            job: job._id
        };

        worker.reviews.push(review);

        // Recalcular promedio
        const totalRating = worker.reviews.reduce((acc, r) => acc + r.rating, 0);
        worker.averageRating = totalRating / worker.reviews.length;

        await worker.save();

        job.reviewed = true;
        await job.save();

        res.status(200).json({ success: true, data: worker });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Editar trabajo
// @route   PUT /api/jobs/:id
// @access  Private (Contratante)
exports.editJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, error: 'Trabajo no encontrado' });

        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'No autorizado' });
        }

        if (job.status !== 'Abierto') {
            return res.status(400).json({ success: false, error: 'No puedes editar un trabajo que ya está En Progreso o Completado' });
        }

        const { title, description, category, budget } = req.body;
        
        job.title = title || job.title;
        job.description = description || job.description;
        job.category = category || job.category;
        job.budget = budget !== undefined ? budget : job.budget;

        await job.save();

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
