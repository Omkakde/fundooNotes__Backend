import express, { IRouter } from 'express';
import { userAuth } from '../middlewares/auth.middleware';
import noteControllers from '../controllers/note.controller';
import redisCache from '../middlewares/redis.middleware';


class NoteRoutes {
  private NoteController = new noteControllers();
  private router = express.Router();
  private cache = new redisCache();
  
  constructor() {
    this.routes();
  }

   private routes = () => {

     /**
     * @openapi
     * /api/v1/notes/:
     *   post:
     *     tags:
     *       - Notes
     *     description: Allows a user to create a note.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *                 example: my note title
     *               description:
     *                 type: string
     *                 example: my note description
     *     responses:
     *       200:
     *         description: Note created successfully.
     *       400:
     *         description: Failed to create note.
     */
    this.router.post('/',userAuth,this.NoteController.create);
    

    /**
     * @openapi
     * /api/v1/notes/:
     *   get:
     *     tags:
     *       - Notes
     *     description: Allows a user to get all of his notes.
     *     responses:
     *       200:
     *         description: Data retrieved from database and notes.
     *       400:
     *         description: No notes found for this user or Error retrieving notes.
     */
    this.router.get('/',userAuth,this.cache.getNotes, this.NoteController.getAll);


      /**
     * @openapi
     * /api/v1/notes/{id}:
     *   get:
     *     tags:
     *       - Notes
     *     description: Allows a user to get his note by id.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The ID of the note to retrieve.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: note with id.
     *       400:
     *         description: Error retrieving note or Note not found.
     */
    this.router.get('/:id',userAuth,this.cache.getNote, this.NoteController.getNote);
 
      /**
     * @openapi
     * /api/v1/notes/{id}:
     *   put:
     *     tags:
     *       - Notes
     *     description: Allows a user to update his note by id.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The ID of the note to update.
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *                 example: my new note title
     *               description:
     *                 type: string
     *                 example: my new note description
     *     responses:
     *       200:
     *         description: Note updated.
     *       400:
     *         description: Note not found or unauthorized.
     */
    this.router.put('/:id',userAuth,this.NoteController.update);

      /**
     * @openapi
     * /api/v1/notes/{id}:
     *   delete:
     *     tags:
     *       - Notes
     *     description: Allows a user to delete his note by id.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The ID of the note to delete.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Note permanently deleted.
     *       400:
     *         description: Note not found or not authorized.
     */
    this.router.delete('/:id',userAuth,this.NoteController.delete);

  /**
     * @openapi
     * /api/v1/notes/{id}/archive:
     *   put:
     *     tags:
     *       - Notes
     *     description: Allows a user to archive his note by id.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The ID of the note to archive.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Note archived or Note unarchived.
     *       400:
     *         description: Error toggling archive status.
     */
    this.router.put('/:id/archive', userAuth, this.NoteController.toggleArchive);

       /**
     * @openapi
     * /api/v1/notes/{id}/trash:
     *   put:
     *     tags:
     *       - Notes
     *     description: Allows a user to trash his note by id.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The ID of the note to trash.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Note moved to trash or Note restored from trash.
     *       400:
     *         description: Error toggling trash status.
     */
    this.router.put('/:id/trash', userAuth, this.NoteController.toggleTrash);

  }

  public getRoutes=() : IRouter=>{
    return this.router;
  }
}

export default NoteRoutes;