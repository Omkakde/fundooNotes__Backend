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

    

  
}
export default NoteControllers;