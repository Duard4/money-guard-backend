import mongoose from 'mongoose';
import { DB } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
  try {
    const user = getEnvVar(DB.USER);
    const pwd = getEnvVar(DB.PASSWORD);
    const url = getEnvVar(DB.URL);
    const db = getEnvVar(DB.DB);

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};
