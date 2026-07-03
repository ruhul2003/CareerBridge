// auth.js
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.AUTH_DB_NAME)),

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