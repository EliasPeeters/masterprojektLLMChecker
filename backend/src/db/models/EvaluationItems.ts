import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';
import {EvaluationAnswer} from "./EvaluationAnswer";

export class EvaluationItem extends Model {
    declare id: string;
    declare type: string;
    declare text: string;
    declare category: string;
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
        },
        category: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: 'default',
        },
    },
    {
        sequelize,
        modelName: 'EvaluationItem',
        tableName: 'evaluation_items',
        timestamps: false,
    }
);

// create Association with EvaluationAnswer
EvaluationItem.hasMany(EvaluationAnswer, {
    foreignKey: 'itemId',
    sourceKey: 'id',
    as: 'answers',
});

EvaluationAnswer.belongsTo(EvaluationItem, {
    foreignKey: 'itemId',
    targetKey: 'id',
    as: 'item',
});
