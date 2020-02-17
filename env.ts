import envalid from 'envalid';

export default envalid.cleanEnv(
  process.env,
  {
    APP_NAME: envalid.str({ default: 'pgsupskill_nodejs' }),
    MONGO_URI: envalid.str({ default: 'mongodb://localhost:27017/pgsupskill' }),
    PORT: envalid.str({ default: '3000' }),
  },
  { strict: true }
);
