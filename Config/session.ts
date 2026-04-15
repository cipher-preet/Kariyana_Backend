import session from "express-session";
import MongoStore from "connect-mongo";
import { v4 as genuuidv4 } from "uuid";


const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;
const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;


export const sessionConfig = session({
  genid: (req) => genuuidv4(),
  name: "b2b.sid",
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI!,
    collectionName: "sessions",
    ttl: THIRTY_DAYS_SECONDS,
  }),

  cookie: {
    httpOnly: true,
    secure: true,
    // sameSite: "lax",
    sameSite: "none",
    maxAge: THIRTY_DAYS_MS,
  },
});
