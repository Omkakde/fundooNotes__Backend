
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
        redisClient.flushAll();
        return newNote;
    } catch (error) {
        throw new Error('Error creating note');
    }
};

  public getUserNotes  = async (req, res) => {
    try {
    const { createdBy } = req.body;
    /// userId 
    const data = await Notes.findAll({where:{ createdBy}});
    if (!data || data.length === 0) {
      throw new Error('No notes found for this user');
  }
    redisClient.setEx(`Notes?user=${createdBy}`,3600,JSON.stringify(data));// from json to string conver
    // json in form of string
    // three para   key, data and time(3600s)1h
    return { data: data, source: 'Data retrieved from database' };
  } catch (error) {
    throw error;
}
  }

  public getNoteById = async (noteId, userId) => {
    try {
    const data = await Notes.findAll({where:{id: noteId, createdBy:userId}});
     if (!data || data.length === 0) {
        throw new Error('Note not found');
      }
    await redisClient.setEx(`Note?id=${data[0].dataValues.id}&user=${data[0].dataValues.createdBy}`,3600,JSON.stringify(data[0]));
    return data;
  } catch (error) {
    console.error('Error in getNoteById:', error);
    throw error;
}
}

public updateNotesById = async (req,res) => {
  try {
  const id= req.params.id;
  const {userId}= req.body;
  const present = await Notes.findOne({where:{id: id, createdBy: userId}});
  if(!present){
    throw Error('note does not exist');
  }
  redisClient.flushAll();
  console.log( id,"check error in update    ",userId)
  const data = await Notes.update(req.body,{where: {id: id, createdBy: userId}});
} catch (error) {
  throw error;
}
}

public deleteNotesById = async (req, res) => {
  try {
  const id = req.params.id;
  const {userId} = req.body;
  const present = await Notes.findOne({where:{id: id, createdBy: userId}});
  if(!present){
    throw new Error('Note not found or not authorized');
  }
  const data = await Notes.destroy({where: {id: id, createdBy: userId}});
  redisClient.flushAll();
} catch (error) {
  throw error;
}
}
 
public toggleArchiveById = async (noteId: string, userId: any): Promise<INotes | null> => {
  try {
    const note = await Notes.findOne({where:{ id: noteId , createdBy: userId, isTrash: false }}); 
    
    if (!note) {
      throw new Error('Note not found or user not authorized'); 
    }
    
    note.isArchive = !note.isArchive; 
    await note.save();
    redisClient.flushAll();
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
    redisClient.flushAll(); 
    return note;
  } catch (error) {
    console.error('Error in toggleTrash:', error);
    throw error;
  }
};
   
}

export default noteServices ;