"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize, DataTypes) => {
    class Note extends sequelize_1.Model {
    }
    Note.init({
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        createdBy: DataTypes.INTEGER,
        isArchive: DataTypes.BOOLEAN,
        isTrash: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'notes'
    });
    return Note;
};
