import envalid from 'envalid';

export default envalid.cleanEnv(
  process.env,
  {
    APP_NAME: envalid.str({ devDefault: 'pgsupskill_nodejs' }),
    MONGO_URI: envalid.url({
      devDefault: 'mongodb://localhost:27017/pgsupskill',
    }),
    PORT: envalid.port({ devDefault: 3000 }),
    JWT_SECRET: envalid.str(),
    TOKEN_EXPIRES_IN: envalid.num({ devDefault: 360 }),
  },
  { strict: true }
);
