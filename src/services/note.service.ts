import sequelize, { DataTypes } from "../config/database";
import note from "../models/notes";
import dotenv from "dotenv";
import { INotes } from "../interfaces/note.interface";

dotenv.config();


class noteServices  {

  private note =  note(sequelize,DataTypes);
  
  public createNote = async (body: INotes): Promise<INotes> => {
    try {
        body.isArchive=false;
        body.isTrash=false;
        const newNote = await this.note.create(body);

        return newNote;
    } catch (error) {
        throw new Error('Error creating note');
    }
};

  public getUserNotes  = async (req, res) => {
    const { createdBy } = req.body;
    /// userId 
    const data = await this.note.findAll({where:{ createdBy}});
    
    if(!data){
      throw Error('no note found');
    }

    res.status(200).json({
      data
    })
  }

  public getNoteById = async (noteId, userId) => {
    const data = await this.note.findAll({where:{id: noteId, createdBy:userId}});
    if(!data){
        throw Error ('no note found');
    }
    return data;
}

public updateNotesById = async (req,res) => {
  const id= req.params.id;
  const {userId}= req.body;
  const present = await this.note.findOne({where:{id: id, createdBy: userId}});

  if(!present){
    throw Error('note does not exist');
  }

  const data = await this.note.update(req.body,{where: {id: id, createdBy: userId}});
  res.status(200).json({
    data,
    message: 'note updated'
});
}

public deleteNotesById = async (req, res) => {
  const id = req.params.id;
  const {userId} = req.body;
  const present = await this.note.findOne({where:{id: id, createdBy: userId}});
  if(!present){
      throw Error('note does not exist');
  }
  const data = await this.note.destroy({where: {id: id, createdBy: userId}});
  res.status(200).json({
      data,
      message: 'note deleted'
  });
}
 
public toggleArchiveById = async (noteId: string, userId: any): Promise<INotes | null> => {
  try {
    const note = await this.note.findOne({where:{ id: noteId , createdBy: userId, isTrash: false }}); 
    
    if (!note) {
      throw new Error('Note not found or user not authorized'); 
    }
    
    note.isArchive = !note.isArchive; 
    await note.save();
    return note;
  } catch (error) {
    console.error('Error in toggleArchive:', error); 
    throw error;
  }
};

public toggleTrashById = async (noteId: string, userId: any): Promise<INotes | null> => {
  try {
    const note = await this.note.findOne({where: {id: noteId ,createdBy: userId }});
    if (!note) {
      throw new Error('Note not found or user not authorized');
    }
    note.isTrash = !note.isTrash;
    if (note.isTrash) {
      note.isArchive = false;
    }
    await note.save(); 
    return note;
  } catch (error) {
    console.error('Error in toggleTrash:', error);
    throw error;
  }
};
   
}

export default noteServices ;