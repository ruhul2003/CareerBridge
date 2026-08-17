const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_build';
const stripe = require('stripe')(stripeSecretKey);

const allowedOrigins = [
  "http://localhost:3000",
  "https://career-bridge-live-ten.vercel.app",
  "https://career-bridge-client-xi.vercel.app"
];

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// Parsers (Declared only once)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Health Check Route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// MongoDB Client Initialization
const uri = process.env.MONGODB_URI || "mongodb+srv://hire_loop_db_user:wwiIRfECMOKwPwpl@tilux-server.cltfmst.mongodb.net/?appName=Tilux-server";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Global Database References
let db;
let jobCollection;
let companyCollection;
let userscollection;
let applicationColection;
let plansCollection;
let subscriptionCollection;
let savedJobsCollection;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("Career_Bridge");
    
    // Initialize Collections
    jobCollection = db.collection("jobs");
    companyCollection = db.collection("companies");
    userscollection = db.collection("user");
    applicationColection = db.collection("applications");
    plansCollection = db.collection("plans");
    subscriptionCollection = db.collection("subscriptions");
    savedJobsCollection = db.collection("saved_jobs");
    
    console.log("Connected to MongoDB cluster dynamically.");
  }
  return db;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection runtime failure:", error);
    res.status(500).json({ success: false, message: "Internal Database Connection Error" });
  }
});

// API ROUTES (Synchronously registered outside connection handlers)

// GET jobs
app.get("/api/jobs", async (req, res) => {
  try {
    const query = {};

    if (req.query.companyId) {
      query.companyId = req.query.companyId;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.division && req.query.division !== 'All') {
      query.$or = [
        { division: { $regex: req.query.division, $options: "i" } },
        { location: { $regex: req.query.division, $options: "i" } }
      ];
    }

    const cursor = jobCollection.find(query);
    const result = await cursor.toArray();

    res.json(result); 
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST job
app.post("/api/jobs", async (req, res) => {
  try {
    const job = req.body;

    const newJob = {
      ...job,
      createdAt: new Date(),
    };

    console.log("=== JOB PAYLOAD RECEIVED ===");
    console.log(JSON.stringify(job, null, 2));

    if (!job.companyId) {
      return res.status(400).json({
        success: false,
        message: "companyId is required to post a job",
      });
    }

    const result = await jobCollection.insertOne(newJob);

    res.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single job details
app.get("/api/jobs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await jobCollection.findOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Subscription management (Fixed response leak)
app.post("/api/subscription", async (req, res) => {
  try {
    const data = req.body;

    const subInfo = {
      ...data,
      createdAt: new Date(),
    };
    
    const result = await subscriptionCollection.insertOne(subInfo);

    const filter = { email: data.email };
    const updateDocument = {
      $set: {
        plan: data.planId,
      },
    };
    const updateResult = await userscollection.updateOne(filter, updateDocument);
    
    res.json({
      success: true,
      subscriptionResult: result,
      userUpdateResult: updateResult
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET applications
app.get('/api/applications', async (req, res) => {
  try {
    const query = {};
    if (req.query.applicantId) {
      query.applicantId = req.query.applicantId;
    }
    if (req.query.jobId) {
      query.jobId = req.query.jobId;
    }
    if (req.query.companyId) {
      // Find all jobs for this company first, to handle older applications that might not have companyId saved,
      // and also query by companyId directly.
      const jobs = await jobCollection.find({ companyId: req.query.companyId }).toArray();
      const jobIds = jobs.map(j => j._id.toString());
      query.$or = [
        { companyId: req.query.companyId },
        { jobId: { $in: jobIds } }
      ];
    }
    const cursor = applicationColection.find(query);
    let result = await cursor.toArray();

    // Enrich applications with user profile resume/cv if missing in application document
    result = await Promise.all(result.map(async (app) => {
      if ((!app.resume || !app.cv) && app.applicantId) {
        try {
          const userDoc = await userscollection.findOne({ _id: new ObjectId(app.applicantId) });
          if (userDoc) {
            return {
              ...app,
              resume: app.resume || userDoc.resume || userDoc.resumeUrl || "",
              cv: app.cv || userDoc.cv || userDoc.cvUrl || ""
            };
          }
        } catch (e) {
          // ignore invalid objectId format if any
        }
      }
      return app;
    }));

    res.send(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST application
app.post('/api/applications', async (req, res) => {
  try {
    const { jobId, applicantId, applicantEmail, applicantName, resume, cv, coverLetter } = req.body;
    if (!jobId || !applicantId) {
      return res.status(400).json({ success: false, message: "jobId and applicantId are required" });
    }

    const existing = await applicationColection.findOne({ jobId, applicantId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already applied for this job" });
    }

    let jobDetails = {};
    try {
      const job = await jobCollection.findOne({ _id: new ObjectId(jobId) });
      if (job) {
        jobDetails = {
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          jobType: job.jobType,
          isRemote: job.isRemote,
          location: job.location,
          companyId: job.companyId
        };
      }
    } catch (e) {
      console.error("Error fetching job details for application:", e);
    }

    const newApplication = {
      jobId,
      applicantId,
      applicantEmail,
      applicantName,
      resume: resume || "",
      cv: cv || "",
      coverLetter: coverLetter || "",
      ...jobDetails,
      status: "Applied",
      appliedAt: new Date()
    };

    const result = await applicationColection.insertOne(newApplication);
    res.json({
      success: true,
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error("Error posting application:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET user profile
app.get("/api/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let query = { id: id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
    }
    const user = await userscollection.findOne(query);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH update user profile
app.patch("/api/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { fullName, email, title, skills, resume, cv, resumeUrl, cvUrl } = req.body;

    const finalResume = resume !== undefined ? resume : (resumeUrl !== undefined ? resumeUrl : undefined);
    const finalCv = cv !== undefined ? cv : (cvUrl !== undefined ? cvUrl : undefined);

    const updateFields = {
      fullName,
      email,
      title,
      skills: skills || [],
      updatedAt: new Date()
    };

    if (finalResume !== undefined) {
      updateFields.resume = finalResume;
      updateFields.resumeUrl = finalResume;
    }
    if (finalCv !== undefined) {
      updateFields.cv = finalCv;
      updateFields.cvUrl = finalCv;
    }

    let updateQuery = { id: id };
    if (ObjectId.isValid(id)) {
      updateQuery = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
    }

    const result = await userscollection.updateOne(
      updateQuery,
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET saved jobs
app.get('/api/saved-jobs', async (req, res) => {
  try {
    const query = {};
    if (req.query.userId) {
      query.userId = req.query.userId;
    }
    if (req.query.jobId) {
      query.jobId = req.query.jobId;
    }
    const result = await savedJobsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST save job
app.post('/api/saved-jobs', async (req, res) => {
  try {
    const { jobId, userId } = req.body;
    if (!jobId || !userId) {
      return res.status(400).json({ success: false, message: "jobId and userId are required" });
    }

    // Check if already saved
    const existing = await savedJobsCollection.findOne({ jobId, userId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Job already saved" });
    }

    let jobDetails = {};
    try {
      const job = await jobCollection.findOne({ _id: new ObjectId(jobId) });
      if (job) {
        jobDetails = {
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          location: job.location,
          isRemote: job.isRemote,
          minSalary: job.minSalary,
          maxSalary: job.maxSalary,
          currency: job.currency,
          deadline: job.deadline,
          status: job.status || 'active'
        };
      }
    } catch (e) {
      console.error("Error fetching job details for saved job:", e);
    }

    const newSavedJob = {
      jobId,
      userId,
      ...jobDetails,
      savedAt: new Date()
    };

    const result = await savedJobsCollection.insertOne(newSavedJob);
    res.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE saved job
app.delete('/api/saved-jobs', async (req, res) => {
  try {
    const { jobId, userId } = req.query;
    if (!jobId || !userId) {
      return res.status(400).json({ success: false, message: "jobId and userId are required" });
    }

    const result = await savedJobsCollection.deleteOne({ jobId, userId });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET plans
app.get("/api/plans", async (req, res) => {
  try {
    const query = {};
    if (req.query.plan_id) {
      query.id = req.query.plan_id;
    }
    const plan = await plansCollection.findOne(query);
    res.send(plan);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST companies
app.post("/api/companies", async (req, res) => {
  try {
    const company = req.body;
    const newCompany = {
      ...company,
      createdAt: new Date(),
    };
    const result = await companyCollection.insertOne(newCompany);
    res.send(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET companies with search and recruiterId support
app.get("/api/companies", async (req, res) => {
    try {
        const { search, recruiterId } = req.query;

        let query = {};

        if (recruiterId) {
            query.recruiterId = recruiterId;
        }

        if (search && search.trim() !== '') {
            const searchRegex = new RegExp(search.trim(), 'i');

            query.$or = [
                { name: searchRegex },
                { industry: searchRegex },
                { location: searchRegex },
                { description: searchRegex },
                { tagline: searchRegex }
            ];
        }

        const companies = await companyCollection.find(query)
            .sort({ createdAt: -1 })     // Newest first
            .toArray();

        res.json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// ====================== ACTIVATE SUBSCRIPTION ======================
app.post('/api/activate-subscription', async (req, res) => {
    try {
        const { session_id } = req.body;

        if (!session_id) {
            return res.status(400).json({ success: false, message: "Session ID is required" });
        }

        // Initialize Stripe inside the route (safer for Express)
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ success: false, message: "Payment not completed" });
        }

        const planId = session.metadata?.planId;
        const email = session.customer_details?.email;

        if (!planId || !email) {
            return res.status(400).json({ success: false, message: "Missing plan or email data" });
        }

        const subInfo = {
            stripeSessionId: session.id,
            email: email,
            planId: planId,
            status: 'active',
            createdAt: new Date(),
            subscriptionStart: new Date(),
        };

        // Save subscription
        await subscriptionCollection.insertOne(subInfo);

        // Update user plan
        await userscollection.updateOne(
            { email: email },
            { 
                $set: { 
                    plan: planId, 
                    subscriptionStatus: 'active', 
                    updatedAt: new Date() 
                } 
            }
        );

        console.log(`✅ Subscription activated for ${email} - Plan: ${planId}`);

        res.json({ 
            success: true, 
            message: "Subscription activated successfully",
            planId 
        });

    } catch (error) {
        console.error("Activate subscription error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        });
    }
});

// PATCH update job details or status
app.patch("/api/jobs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    delete updateData._id; // Safety check

    const result = await jobCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH update application status
app.patch("/api/applications/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const result = await applicationColection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ====================== ADMIN ENDPOINTS ======================

// GET admin statistics
app.get("/api/admin/stats", async (req, res) => {
  try {
    const totalUsers = await userscollection.countDocuments();
    const totalJobs = await jobCollection.countDocuments();
    const totalCompanies = await companyCollection.countDocuments();
    const totalApplications = await applicationColection.countDocuments();
    const totalSeekers = await userscollection.countDocuments({ role: "seeker" });
    const totalRecruiters = await userscollection.countDocuments({ role: "recruiter" });
    const totalAdmins = await userscollection.countDocuments({ role: "admin" });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalSeekers,
        totalRecruiters,
        totalAdmins,
        totalJobs,
        totalCompanies,
        totalApplications
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all users
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await userscollection.find({}).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH update user role
app.patch("/api/admin/users/:id/role", async (req, res) => {
  try {
    const id = req.params.id;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required" });
    }

    const result = await userscollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE user
app.delete("/api/admin/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await userscollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE job
app.delete("/api/admin/jobs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await jobCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE company
app.delete("/api/admin/companies/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await companyCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Ping configuration for direct backend confirmation
app.get("/api/db-ping", async (req, res) => {
  try {
    await client.db("admin").command({ ping: 1 });
    res.json({ success: true, message: "Database connected and pinged successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ====================== AI ENDPOINTS (GEMINI API) ======================

const { GoogleGenAI } = require("@google/genai");
const geminiApiKey = process.env.GEMINI_API_KEY;
const aiClient = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// AI Chat & Career Coach Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    if (!aiClient) {
      return res.status(500).json({ success: false, message: "Gemini API key is not configured on server" });
    }

    const systemContext = "You are CareerBridge AI Assistant, an expert career advisor, resume consultant, and interview coach for the CareerBridge job portal platform. Provide encouraging, concise, highly relevant, and practical advice. Use markdown styling with clear headings and short bullet points.";

    const fullPrompt = `${systemContext}\n\n${context ? `User Context: ${context}\n\n` : ''}User Question: ${prompt}`;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.0-flash",
      contents: fullPrompt,
    });

    res.json({ success: true, reply: response.text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to generate AI response" });
  }
});

// AI Job Description Generator Endpoint
app.post("/api/ai/generate-job-description", async (req, res) => {
  try {
    const { title, category, jobType, location, companyName } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Job title is required" });
    }

    if (!aiClient) {
      return res.status(500).json({ success: false, message: "Gemini API key is not configured on server" });
    }

    const prompt = `You are an expert HR Specialist writing a job posting for ${companyName || 'our company'}.
Generate a professional, compelling job description for the role:
Position: ${title}
Category: ${category || 'Technology'}
Job Type: ${jobType || 'Full-time'}
Location: ${location || 'Dhaka, Bangladesh'}

Return your response strictly as a raw JSON object (without markdown code block backticks) with the exact keys:
{
  "description": "A 2 paragraph summary describing the role and impact...",
  "responsibilities": "Bullet list of key responsibilities...",
  "requirements": "Bullet list of required qualifications and skills..."
}`;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let resultText = response.text.trim();
    if (resultText.startsWith("```")) {
      resultText = resultText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    const parsedData = JSON.parse(resultText);
    res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error("AI Job Description Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to generate job description" });
  }
});

app.listen(port, () => {
  console.log(`Application listening natively on port ${port}`);
});

module.exports = app;