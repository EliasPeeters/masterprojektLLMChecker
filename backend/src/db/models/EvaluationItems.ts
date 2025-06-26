import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

export class EvaluationItem extends Model {
    declare id: string;
    declare type: string;
    declare text: string;
    declare llmResult: string;
}

EvaluationItem.init(
    {
        id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        llmResult: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'llmresult',
        }
    },
    {
        sequelize,
        modelName: 'EvaluationItem',
        tableName: 'evaluation_items',
        timestamps: false,
    }
);