"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("../models/index");
dotenv_1.default.config();
class noteServices {
    constructor() {
        this.createNote = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                body.isArchive = false;
                body.isTrash = false;
                const newNote = yield index_1.Notes.create(body);
                return newNote;
            }
            catch (error) {
                throw new Error('Error creating note');
            }
        });
        this.getUserNotes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { createdBy } = req.body;
            /// userId 
            const data = yield index_1.Notes.findAll({ where: { createdBy } });
            if (!data) {
                throw Error('no note found');
            }
            res.status(200).json({
                data
            });
        });
        this.getNoteById = (noteId, userId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield index_1.Notes.findAll({ where: { id: noteId, createdBy: userId } });
            if (!data) {
                throw Error('no note found');
            }
            return data;
        });
        this.updateNotesById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { userId } = req.body;
            const present = yield index_1.Notes.findOne({ where: { id: id, createdBy: userId } });
            if (!present) {
                throw Error('note does not exist');
            }
            const data = yield index_1.Notes.update(req.body, { where: { id: id, createdBy: userId } });
            res.status(200).json({
                data,
                message: 'note updated'
            });
        });
        this.deleteNotesById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { userId } = req.body;
            const present = yield index_1.Notes.findOne({ where: { id: id, createdBy: userId } });
            if (!present) {
                throw Error('note does not exist');
            }
            const data = yield index_1.Notes.destroy({ where: { id: id, createdBy: userId } });
            res.status(200).json({
                data,
                message: 'note deleted'
            });
        });
        this.toggleArchiveById = (noteId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const note = yield index_1.Notes.findOne({ where: { id: noteId, createdBy: userId, isTrash: false } });
                if (!note) {
                    throw new Error('Note not found or user not authorized');
                }
                note.isArchive = !note.isArchive;
                yield note.save();
                return note;
            }
            catch (error) {
                console.error('Error in toggleArchive:', error);
                throw error;
            }
        });
        this.toggleTrashById = (noteId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const note = yield index_1.Notes.findOne({ where: { id: noteId, createdBy: userId } });
                if (!note) {
                    throw new Error('Note not found or user not authorized');
                }
                note.isTrash = !note.isTrash;
                if (note.isTrash) {
                    note.isArchive = false;
                }
                yield note.save();
                return note;
            }
            catch (error) {
                console.error('Error in toggleTrash:', error);
                throw error;
            }
        });
    }
}
exports.default = noteServices;
