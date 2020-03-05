import { Document } from "mongoose";
import { CookieOptions, Request } from "express";

namespace AuthTypes {
  interface TokenData {
    token: string;
    expiresIn: number;
  }
  interface DataStoredInToken {
    _id: string;
  }

  interface LoginUser {
    email: string;
    password: string;
  }
}
