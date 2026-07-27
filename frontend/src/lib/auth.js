// auth.js
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://hire_loop_db_user:wwiIRfECMOKwPwpl@tilux-server.cltfmst.mongodb.net/?appName=Tilux-server";
const dbName = process.env.AUTH_DB_NAME || "Career_Bridge";

const client = new MongoClient(uri);

export const auth = betterAuth({
  database: mongodbAdapter(client.db(dbName)),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  accountLinking: {
    enabled: true,                    
    trustedProviders: ["google"],  
    disableImplicitLinking: false,
  },

  advanced: {
    useSecureCookies: false, 
  },

  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "seeker" },
      plan: { type: "string", defaultValue: "seeker_free" },
    },
  },
});