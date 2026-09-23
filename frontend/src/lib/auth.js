import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { sendVerificationEmail } from "./email-service.js";

const uri = process.env.MONGODB_URI || "mongodb+srv://hire_loop_db_user:wwiIRfECMOKwPwpl@tilux-server.cltfmst.mongodb.net/?appName=Tilux-server";
const dbName = process.env.AUTH_DB_NAME || "Career_Bridge";

const client = new MongoClient(uri);

export const auth = betterAuth({
  database: mongodbAdapter(client.db(dbName)),

  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";
        // Provide link to our interactive verification page with token
        const verifyPageUrl = `${appBaseUrl}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`;

        await sendVerificationEmail({
          to: user.email,
          name: user.name,
          verifyUrl: verifyPageUrl,
          token,
        });
      } catch (err) {
        console.error("[BetterAuth] Failed to dispatch verification email:", err.message);
      }
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: false,
      disableImplicitLinking: false,
    },
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