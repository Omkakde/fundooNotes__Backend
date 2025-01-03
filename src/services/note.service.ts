import sequelize, { DataTypes } from "../config/database";
import note from "../models/notes";
import dotenv from "dotenv";
dotenv.config();

class noteServices  {

  private note =  note(sequelize,DataTypes);
  
  public createNote = async(req,res) => {
    // reduce code
    const {title, description, userId}= req.body;

    const data = await this.note.create({
      title: title,
      description: description,
      createdBy: userId,
      color:null,
      isArchive: false,
      isTrash: false

      });

      if(!data){
        throw Error('cannot create note');
      }
      
      res.status(200).json({
        noteId: data.dataValues.id,
        title: data.dataValues.title,
        description: data.dataValues.description,
        message: 'note created Sucessfully'
    });
  }

  public getUserNotes  = async (req, res) => {
    const { userId } = req.body;
    /// userId 
    const data = await this.note.findAll({where:{ createdBy: userId}});
    
    if(!data){
      throw Error('no note found');
    }

    res.status(200).json({
      data
    })
  }

  public getNotesById = async (req, res) => {
    
    const id = req.params.id;
    const {userId} = req.body;
    const data = await this.note.findAll({where:{id: id, createdBy: userId}});
    if(!data){
        res.status(200).json({
            message: 'no note found'
        });
    }
    res.status(200).json({
        data
    });
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
   
}

export default noteServices ;