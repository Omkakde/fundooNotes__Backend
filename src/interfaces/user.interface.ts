export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  refreshToken:string,
  id?: string | number;
}
