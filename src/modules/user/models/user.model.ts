import { Schema, model } from 'mongoose';

import { UserTypes } from '../user';

const UserSchema: Schema = new Schema({
  name: String,
  email: String,
});

export default model<UserTypes.User>('User', UserSchema);
