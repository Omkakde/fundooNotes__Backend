
import dotenv from "dotenv";
import { INotes } from "../interfaces/note.interface";
import {Notes} from "../models/index";
import redisClient from "../config/redis";

dotenv.config();


class noteServices  {


 
  public createNote = async (body: INotes): Promise<INotes> => {
    try {
        body.isArchive=false;
        body.isTrash=false;
        const newNote = await Notes.create(body);

        return newNote;
    } catch (error) {
        throw new Error('Error creating note');
    }
};

  public getUserNotes  = async (req, res) => {
    const { createdBy } = req.body;
    /// userId 
    const data = await Notes.findAll({where:{ createdBy}});
    
    if(!data){
      throw Error('no note found');
    }
    redisClient.setEx(`Notes?user=${createdBy}`,3600,JSON.stringify(data));// from json to string conver
    // json in form of string
    // three para   key, data and time(3600s)1h
    res.status(200).json({
      data
    })
  }

  public getNoteById = async (noteId, userId) => {
    const data = await Notes.findAll({where:{id: noteId, createdBy:userId}});
    if(!data){
        throw Error ('no note found');
    }
    await redisClient.setEx(`Note?id=${data[0].dataValues.id}&user=${data[0].dataValues.createdBy}`,3600,JSON.stringify(data[0]));
    return data;
}

public updateNotesById = async (req,res) => {
  const id= req.params.id;
  const {userId}= req.body;
  const present = await Notes.findOne({where:{id: id, createdBy: userId}});

  if(!present){
    throw Error('note does not exist');
  }

  const data = await Notes.update(req.body,{where: {id: id, createdBy: userId}});
  res.status(200).json({
    data,
    message: 'note updated'
});
}

public deleteNotesById = async (req, res) => {
  const id = req.params.id;
  const {userId} = req.body;
  const present = await Notes.findOne({where:{id: id, createdBy: userId}});
  if(!present){
      throw Error('note does not exist');
  }
  const data = await Notes.destroy({where: {id: id, createdBy: userId}});
  res.status(200).json({
      data,
      message: 'note deleted'
  });
}
 
public toggleArchiveById = async (noteId: string, userId: any): Promise<INotes | null> => {
  try {
    const note = await Notes.findOne({where:{ id: noteId , createdBy: userId, isTrash: false }}); 
    
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
    const note = await Notes.findOne({where: {id: noteId ,createdBy: userId }});
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