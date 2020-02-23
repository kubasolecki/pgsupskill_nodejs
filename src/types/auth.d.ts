import { Document } from "mongoose";
import { CookieOptions, Request } from "express";

namespace Upskill.Auth {
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
  interface DataStoredInToken {
    _id: string;
  }
}
