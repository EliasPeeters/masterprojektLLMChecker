import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

export class EvaluationAnswer extends Model {
    declare id: string;
    declare itemId: string;
    declare answer: string;
    declare timestamp: Date;
}

EvaluationAnswer.init(
    {
        id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
        },
        itemId: {
            type: DataTypes.STRING(36),
            allowNull: false,
            field: 'itemid',
        },
        answer: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'EvaluationAnswer',
        tableName: 'evaluation_answers',
        timestamps: false,
    }
);