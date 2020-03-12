import { Document } from 'mongoose';

namespace UserTypes {
  interface User extends Document {
    _id: string;
    name: string;
    email: string;
  }
  interface CreateUser {
    name: string;
    email: string;
  }
}