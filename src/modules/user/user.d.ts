import { Document } from 'mongoose';

namespace UserTypes {
  interface User extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
  }
  interface CreateUser {
    email: string;
    password: string;
  }
}