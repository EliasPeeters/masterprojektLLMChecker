import {Router} from "express";

const router = Router();

// 📍 GET /api/status
// @ts-ignore
router.get('/', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;