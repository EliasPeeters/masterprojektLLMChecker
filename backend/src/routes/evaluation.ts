import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import {EvaluationItem} from "../db/models/EvaluationItems";
import {sequelize} from "../db/db";
import {EvaluationAnswer} from "../db/models/EvaluationAnswer";
import {Op} from "sequelize";

const router = Router();

// 📍 GET /api/evaluation/next
// @ts-ignore
router.get('/next', async (req: Request, res: Response) => {
    try {
        const item = await EvaluationItem.findOne({
            where: {
                type: {
                    [Op.or]: ['priceSensitivity', 'ecoConsciousness']
                }
            },
            order: [sequelize.fn('RANDOM')]
        });
        if (!item) {
            return res.status(404).json({ error: 'No evaluation items found' });
        }
        res.json(item);
    } catch (err) {
        res.status(500).json({
            error: 'Something went wrong',
            details: err instanceof Error ? err.message : String(err),
        });
    }
});

// 📍 POST /api/evaluation/answer
// @ts-ignore
router.post('/answer', async (req: Request, res: Response) => {
    const { itemId, answer } = req.body;

    if (!itemId || !answer) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // check if itemId exists
        const item = await EvaluationItem.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Evaluation item not found' });
        }

        await EvaluationAnswer.create({
            id: randomUUID(),
            itemId,
            answer,
        });

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({
            error: 'Failed to save answer',
            details: err instanceof Error ? err.message : String(err),
        });
    }
});

export default router;