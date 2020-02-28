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

  interface RegisterUserResponse {
    message: string;
    data: {
      user: {
        email: string;
      };
    };
  }

  interface LoginUserResponse {
    message: string;
    data: {
      user: {
        email: string;
      };
    };
  }
}
