import httpstatuscodes from 'http-status-codes';
import { Request, Response, NextFunction } from "express";
import noteServices from '../services/note.service';

class NoteControllers {

    private noteServices = new noteServices();

    public create = async (req: Request, res: Response, next: NextFunction) =>{
        try{
            this.noteServices.createNote(req,res);
        }catch(error){
            next(error);
        }
    }

    public getAll = (req: Request, res: Response, next: NextFunction) => {
        try{
            this.noteServices.getUserNotes(req, res);
        } catch(error){
            next(error);
        }
    }

    public get = (req:Request, res:Response, next:NextFunction) => {
        try{
            this.noteServices.getNotesById(req, res);
        }catch(error){
            next(error);
        }
    }

    public update = (req: Request, res: Response, next: NextFunction) => {
        try{
            this.noteServices.updateNotesById(req, res);
        } catch(error){
            next(error);
        }
    }

    public delete = (req:Request, res:Response, next:NextFunction)=>{
        try{
            this.noteServices.deleteNotesById(req,res);

        }catch(error){
            next(error);
        }
    }


  
}
export default NoteControllers;