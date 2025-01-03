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

   
}

export default noteServices ;