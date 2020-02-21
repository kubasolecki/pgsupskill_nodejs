import { Document } from "mongoose";
import { CookieOptions } from "express";

declare namespace auth{
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
  interface TokenData {
    token: string;
    expiresIn: number;
  }
  interface RequestWithUser extends Request {
    user: User;
  }
  interface DataStoredInToken {
    _id: string;
  }
}
