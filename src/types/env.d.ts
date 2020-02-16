declare module NodeJS {
  export interface ProcessEnv {
    MONGO_URI: string;
    PORT: string;
    APP_NAME: string;
  }
}
