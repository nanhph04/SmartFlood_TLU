import MonitoringArea from '../models/MonitoringArea.js';

const getAllMonitoringAreas = async (req, res, next) => {
    try {
        const areas = await MonitoringArea.find({});
        res.json(areas);
    } catch (err) {
        next(err);
    }
};

export default getAllMonitoringAreas;