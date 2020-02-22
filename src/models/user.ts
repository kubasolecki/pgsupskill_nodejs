import { Schema, model } from 'mongoose';
import { Upskill } from '../types/auth';

const UserSchema: Schema = new Schema({
  name: String,
  email: String,
  password: String,
});

export default model<Upskill.Auth.User>('User', UserSchema);
