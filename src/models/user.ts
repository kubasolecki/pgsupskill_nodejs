import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  name: String,
  email: String,
  password: String,
});

export default model<IUser>('User', UserSchema);
