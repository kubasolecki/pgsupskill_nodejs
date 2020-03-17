import { Schema, model } from 'mongoose';

import { AuthTypes } from '../auth';

const UserSchema: Schema = new Schema({
  email: String,
  password: String,
});

export default model<AuthTypes.User>('AuthUser', UserSchema);
