import express, { IRouter } from 'express';
import { userAuth } from '../middlewares/auth.middleware';
import noteControllers from '../controllers/note.controller';
import routes from './index';


class NoteRoutes {
  private NoteController = new noteControllers();
  private router = express.Router();

  constructor() {
    this.routes();
  }

   private routes = () => {
    this.router.post('/',userAuth,this.NoteController.create);
    
    

  }

  public getRoutes=() : IRouter=>{
    return this.router;
  }
}

export default NoteRoutes;