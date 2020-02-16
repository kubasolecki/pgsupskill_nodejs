import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

export default model<IUser & Promise<Document>>('User', UserSchema);
