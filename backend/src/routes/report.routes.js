import { Router } from 'express';
import { createReportHandler, listReportsHandler, getReportByIdHandler, approveReportHandler, rejectReportHandler } from '../controllers/report.controller.js';
import { validate } from '../middleware/validate.js';
import { createReportSchema, listReportSchema, idParamSchema } from '../validators/report.validator.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { reportIpRateLimit } from '../middleware/reportIpRateLimit.js';


const reportRoutes = Router();


// PUBLIC
reportRoutes.post('/', reportIpRateLimit(), validate(createReportSchema), createReportHandler);
reportRoutes.use(requireAuth);

// ADMIN routes trước `/:id` để tránh nuốt đường dẫn
reportRoutes.get('/admin', requireAdmin, validate(listReportSchema, 'query'), listReportsHandler);
reportRoutes.get('/admin/:id', validate(idParamSchema, 'params'), getReportByIdHandler);

// ADMIN actions
reportRoutes.post('/admin/:id/approve', requireAdmin, validate(idParamSchema, 'params'), approveReportHandler);
reportRoutes.post('/admin/:id/reject', requireAdmin, validate(idParamSchema, 'params'), rejectReportHandler);


export default reportRoutes;