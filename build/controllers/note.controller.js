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
const note_service_1 = __importDefault(require("../services/note.service"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class NoteControllers {
    constructor() {
        this.noteServices = new note_service_1.default();
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newNote = yield this.noteServices.createNote(req.body);
                res.status(http_status_codes_1.default.CREATED).json({
                    code: http_status_codes_1.default.CREATED,
                    message: "Note created successfully",
                    data: newNote,
                });
            }
            catch (error) {
                console.error(`Cannot create note:`, error);
                next({
                    code: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
                    message: "Failed to create note",
                    error: error.message,
                });
            }
        });
        this.getAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let notes = yield this.noteServices.getUserNotes(req, res);
                res.status(http_status_codes_1.default.OK).json(notes);
            }
            catch (error) {
                console.error('Error retrieving notes:', error);
                next(error);
            }
        });
        this.getNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params.id;
                const userId = req.body.createdBy;
                const note = yield this.noteServices.getNoteById(noteId, userId);
                res.status(http_status_codes_1.default.OK).json(note);
            }
            catch (error) {
                console.error('Error retrieving note:', error);
                next({
                    code: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
                    message: 'Error retrieving note',
                    error: error.message,
                });
            }
        });
        this.update = (req, res, next) => {
            try {
                this.noteServices.updateNotesById(req, res);
                res.status(http_status_codes_1.default.OK).json({
                    code: http_status_codes_1.default.OK,
                    message: 'Note updated',
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.delete = (req, res, next) => {
            try {
                this.noteServices.deleteNotesById(req, res);
                res.status(http_status_codes_1.default.OK).json({
                    code: http_status_codes_1.default.OK,
                    message: 'Note permanently deleted',
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.toggleArchive = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params.id;
                const userId = req.body.createdBy;
                const note = yield this.noteServices.toggleArchiveById(noteId, userId);
                if (note) {
                    res.status(http_status_codes_1.default.OK).json({
                        message: note.isArchive ? 'Note archived' : 'Note unarchived',
                        archivedNote: note
                    });
                }
            }
            catch (error) {
                console.error('Error toggling archive status:', error);
                next({
                    code: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
                    message: 'Error toggling archive status',
                    error: error.message
                });
            }
        });
        this.toggleTrash = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params.id;
                const userId = req.body.createdBy;
                const note = yield this.noteServices.toggleTrashById(noteId, userId);
                if (note) {
                    res.status(http_status_codes_1.default.OK).json({
                        message: note.isTrash ? 'Note moved to trash' : 'Note restored from trash',
                        trashedNote: note
                    });
                }
            }
            catch (error) {
                console.error('Error toggling trash status:', error);
                next({
                    code: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
                    message: 'Error toggling trash status',
                    error: error.message
                });
            }
        });
    }
}
exports.default = NoteControllers;
