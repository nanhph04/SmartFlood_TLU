import express from 'express';
import { io } from '../server.js';

const router = express.Router();

// Orion-LD NGSI-LD notification endpoint
// Orion-LD posts a JSON body containing 'data': [entities] in keyValues format
router.post('/orion-notification', (req, res) => {
    const payload = req.body;
    try {
        const entities = payload?.data || [];
        console.log('[Orion Notification] Received:', JSON.stringify(entities, null, 2));
        // Broadcast each entity update to websocket clients based on type
        entities.forEach(ent => {
            if (ent.type === 'FloodSensor') {
                io.emit('floodSensorUpdate', ent);
            } else if (ent.type === 'WeatherObservation') {
                io.emit('weatherUpdate', ent);
            } else {
                console.warn('[Notify] Unknown entity type:', ent.type);
            }
        });
        res.status(204).end();
    } catch (e) {
        console.error('[Notify] Error handling notification:', e.message);
        res.status(500).json({ error: 'Failed to process notification' });
    }
});

export default router;
