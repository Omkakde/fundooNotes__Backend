import sequelize, { DataTypes } from '../config/database'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from '../models/user';
import { sendPasswordResetToken } from '../utils/mail.utils';
import { IUser } from '../interfaces/user.interface';

class UserService {
  private User = user(sequelize, DataTypes);


  // create new user
  public newUser = async (body: IUser ) => {
    try {
     
      const exist = await this.User.findOne({ where: { email: body.email } });
      if (exist) {
        throw new Error('User already exists');
      }

      body.password = await bcrypt.hash(body.password, 10);

      const data = await this.User.create(body);

      if (!data) {
        throw new Error('Registration failed');
      }

      return {
        ...data.dataValues,
        message: 'Registration successful',
      };

    } catch (error) {
      throw new Error(`Error during registration: ${error.message}`);
    }
  };



  //Refresh token
  public refreshToken = async (req, res) => {
    const { refreshtoken } = req.body;
    if (!refreshtoken) {
      res.status(400).json({
        message: "refreshtoken required"
      });
    }
    jwt.verify(refreshtoken, process.env.JWT_SECRET_REFRESH, async (error, decoded) => {
      if (error) {
        res.status(404).json({
          message: "invalid refreshtoken"
        });
      }

      const user = await this.User.findOne({ where: { id: decoded.id, refreshToken: refreshtoken } });
      if (!user) {
        res.status(404).json({
          message: "refreshtoken not found in database"
        });
      }

      const newToken = jwt.sign({ email: decoded.email ,id: decoded.id}, process.env.JWT_SECRET_ACCESS, { expiresIn: '1h' });
      res.status(200).json({
        newToken: newToken
      });
    });
  }

  

  //Login
  public userLogin = async (body) => {
    
    try {
      
      const data = await this.User.findOne({ where: {email:body.email } });

      if (!data) {
        return {
          message: 'User not found',
        };
      }

      const match = await bcrypt.compare(body.password, data.password);

      if (!match) {
        return {
          message: 'Invalid password',
        };
      }
    
      const accessToken = jwt.sign(
        {  email: data.dataValues.email, id: data.dataValues.id},
        process.env.JWT_SECRET_ACCESS, 
        { expiresIn: process.env.JWT_ACCESS_EXPIRATION } 
      );

   
      const refreshToken = jwt.sign(
        {  email: data.dataValues.email,  id: data.dataValues.id },
        process.env.JWT_SECRET_REFRESH, 
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION } 
      );
      await this.User.update({ refreshToken }, { where: { id: data.dataValues.id } });

     
      return {
        accessToken,
        refreshToken,
        message: 'Login successful',
      };
      
    } catch (error) {
      throw new Error(`Error during login: ${error.message}`);
    }
  };



  //forgot password
  public forgotPassword = async ({email}): Promise<void> =>{
    const user = await this.User.findOne({where:{email}});
    if(!user){
      throw Error('user not found');
    }
    
    const token = await jwt.sign({userId: user.dataValues.id,email: user.dataValues.email},process.env.JWT_SECRET_ACCESS,{ expiresIn: '1d' });
    try{
    await sendPasswordResetToken(`${user.dataValues.email}`, `${token}`);
    } catch (error){
      throw error;
    }
  }
  
  //reset user password
  public resetPassword = async({newPassword, email}): Promise<void> =>{
    const password = await bcrypt.hash(newPassword, 10);
    const update = await this.User.update({password},{where:{email}});
    if(!update){
      throw Error('could not update password');
    }
  }
}

export default UserService;
