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
    
    this.router.get('/',userAuth,this.NoteController.getAll);

    this.router.get('/:id',userAuth,this.NoteController.getNote);
 
    this.router.put('/:id',userAuth,this.NoteController.update);

    this.router.delete('/:id',userAuth,this.NoteController.delete);


    this.router.put('/archive/:id', userAuth, this.NoteController.toggleArchive);

    

  }

  public getRoutes=() : IRouter=>{
    return this.router;
  }
}

export default NoteRoutes;