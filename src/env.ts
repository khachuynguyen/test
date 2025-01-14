// env.ts
import * as dotenv from 'dotenv';

dotenv.config();

export const SHUTTLE_CODE = process.env.SHUTTLE_CODE || '';
