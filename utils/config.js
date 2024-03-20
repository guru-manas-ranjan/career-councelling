import dotenv from 'dotenv'

dotenv.config();

export const PORT=process.env.PORT;
export const MONGO_URI=process.env.MONGO_URI;
export const DATABASE_NAME='CAREER_GUIDANCE'
export const JWT_KEY=process.env.JWT_KEY;
export const TABLE_NAMES={
    USERS:"USERS"
}