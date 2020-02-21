import { Schema, model } from 'mongoose';
import { auth } from '../types/auth';

const UserSchema: Schema = new Schema({
  name: String,
  email: String,
  password: String,
});

export default model<auth.User>('User', UserSchema);
