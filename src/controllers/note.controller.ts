import httpstatuscodes from 'http-status-codes';
import { Request, Response, NextFunction } from "express";
import noteServices from '../services/note.service';
import httpStatus from 'http-status-codes';

class NoteControllers {

    private noteServices = new noteServices();

    public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const newNote = await this.noteServices.createNote(req.body);
            res.status(httpStatus.CREATED).json({
                code: httpStatus.CREATED,
                message: "Note created successfully",
                data: newNote,
            });

        } catch (error) {
            console.error(`Cannot create note:`, error);
            next({
                code: httpStatus.INTERNAL_SERVER_ERROR,
                message: "Failed to create note",
                error: (error as Error).message,
            });
        }
    };
         
          

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try{
            let notes = await this.noteServices.getUserNotes(req, res);
            res.status(httpStatus.OK).json(notes);
        } catch(error){
            console.error('Error retrieving notes:', error);
            next(error);
        }
    }

    public getNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const noteId = req.params.id;
            const userId = req.body.createdBy;

            const note = await this.noteServices.getNoteById(noteId, userId);

            res.status(httpStatus.OK).json(note);
        } catch (error) {
            console.error('Error retrieving note:', error);

            next({
                code: httpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error retrieving note',
                error: (error as Error).message,
            });
        }
    };

    public update = (req: Request, res: Response, next: NextFunction) => {
        try{
            this.noteServices.updateNotesById(req, res);
            res.status(httpStatus.OK).json({
                code: httpStatus.OK,
                message: 'Note updated',
               
            });
        } catch(error){
            next(error);
        }
    }

    public delete = (req:Request, res:Response, next:NextFunction)=>{
        try{
            this.noteServices.deleteNotesById(req,res);
            res.status(httpStatus.OK).json({
                code: httpStatus.OK,
                message: 'Note permanently deleted',
               
            });
        }catch(error){
            next(error);
        }
    }

    public toggleArchive = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const noteId = req.params.id;
          const userId = req.body.createdBy;
      
          const note = await this.noteServices.toggleArchiveById(noteId, userId);
          if (note) {
            res.status(httpStatus.OK).json({
              message: note.isArchive ? 'Note archived' : 'Note unarchived',
              archivedNote: note
            });
          }
        } catch (error) {
          console.error('Error toggling archive status:', error);
          next({
            code: httpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error toggling archive status',
            error: (error as Error).message
          });
        }
      };
      
     


  
}
export default NoteControllers;