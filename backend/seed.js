const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI || "mongodb+srv://hire_loop_db_user:wwiIRfECMOKwPwpl@tilux-server.cltfmst.mongodb.net/?appName=Tilux-server";
const dbName = process.env.AUTH_DB_NAME || "Career_Bridge";

const client = new MongoClient(uri);

const bangladeshiCompanies = [
  {
    name: "Brain Station 23",
    tagline: "Empowering Global Tech Innovations from Bangladesh",
    industry: "Software & Cloud Solutions",
    location: "Dhaka, Bangladesh",
    website: "https://brainstation-23.com",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=150&q=80",
    description: "Brain Station 23 is a global software development company delivering enterprise fintech, cloud, AI, and mobile solutions for top international brands.",
    size: "600+ Employees",
    founded: "2006",
    status: "approved"
  },
  {
    name: "bKash Limited",
    tagline: "Bangladesh's Largest Mobile Financial Services Platform",
    industry: "FinTech & Financial Services",
    location: "Dhaka, Bangladesh",
    website: "https://bkash.com",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=150&q=80",
    description: "bKash provides safe, convenient, and easy mobile payment solutions for millions of consumers and merchant businesses across Bangladesh.",
    size: "2000+ Employees",
    founded: "2011",
    status: "approved"
  },
  {
    name: "Pathao",
    tagline: "Moving Bangladesh with On-Demand Tech & Commerce",
    industry: "Logistics & Mobility Tech",
    location: "Dhaka, Bangladesh",
    website: "https://pathao.com",
    logo: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=150&q=80",
    description: "Pathao is Bangladesh’s leading digital platform for ride-sharing, food delivery, parcel logistics, and digital payments.",
    size: "800+ Employees",
    founded: "2015",
    status: "approved"
  },
  {
    name: "Grameenphone",
    tagline: "Go Beyond with Digital Connectivity",
    industry: "Telecommunications & Digital Services",
    location: "Dhaka, Bangladesh",
    website: "https://grameenphone.com",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80",
    description: "Grameenphone is the pioneer and largest telecommunication network operator in Bangladesh, connecting millions with high-speed digital infrastructure.",
    size: "4000+ Employees",
    founded: "1997",
    status: "approved"
  },
  {
    name: "Chaldal",
    tagline: "Tech-Enabled Everyday Grocery Engine",
    industry: "E-Commerce & Supply Chain Tech",
    location: "Dhaka, Bangladesh",
    website: "https://chaldal.com",
    logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80",
    description: "Chaldal is Bangladesh's pioneering online grocery technology platform optimizing micro-fulfillment warehouses and direct-to-consumer logistics.",
    size: "1500+ Employees",
    founded: "2013",
    status: "approved"
  },
  {
    name: "ShopUp",
    tagline: "Empowering Micro & Small Businesses in Emerging Markets",
    industry: "B2B Commerce & Micro-FinTech",
    location: "Dhaka, Bangladesh",
    website: "https://shopup.com.bd",
    logo: "https://images.unsplash.com/photo-1556742049-0a670fc8078a?auto=format&fit=crop&w=150&q=80",
    description: "ShopUp builds full-stack B2B commerce, logistics, and embedded finance infrastructure for micro and small retailers.",
    size: "1200+ Employees",
    founded: "2017",
    status: "approved"
  },
  {
    name: "Optimizely Bangladesh",
    tagline: "Crafting Global Digital Experience Platforms",
    industry: "Software Engineering & DXP",
    location: "Dhaka, Bangladesh",
    website: "https://optimizely.com",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80",
    description: "Optimizely BD delivers cutting-edge experimentation, content management, and digital commerce software to global enterprise customers.",
    size: "300+ Employees",
    founded: "2010",
    status: "approved"
  },
  {
    name: "TigerIT Bangladesh",
    tagline: "Architecting Biometric Security & National Systems",
    industry: "Identity & Biometrics Tech",
    location: "Dhaka, Bangladesh",
    website: "https://tigerit.com",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&q=80",
    description: "TigerIT specializes in state-of-the-art Automated Biometric Identification Systems (ABIS), national ID security, and large-scale government IT projects.",
    size: "400+ Employees",
    founded: "2000",
    status: "approved"
  },
  {
    name: "Selise Digital Platforms",
    tagline: "Swiss Precision Meets Bangladeshi Engineering Excellence",
    industry: "Enterprise Software & Cloud",
    location: "Dhaka, Bangladesh",
    website: "https://selise.ch",
    logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=150&q=80",
    description: "Selise crafts bespoke enterprise web applications, cloud platforms, and digital products for European corporate clients and global ventures.",
    size: "500+ Employees",
    founded: "2013",
    status: "approved"
  },
  {
    name: "Enosis Solutions",
    tagline: "World-Class Offshore Software Engineering",
    industry: "Custom Software Engineering",
    location: "Dhaka, Bangladesh",
    website: "https://enosisbd.com",
    logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80",
    description: "Enosis Solutions provides dedicated offshore software R&D teams building complex desktop, mobile, and web products for North American firms.",
    size: "450+ Employees",
    founded: "2006",
    status: "approved"
  },
  {
    name: "Craftsmen",
    tagline: "Clean Code & Agile Engineering Consultancy",
    industry: "High-Performance Software Engineering",
    location: "Dhaka, Bangladesh",
    website: "https://craftsmenltd.com",
    logo: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=150&q=80",
    description: "Craftsmen focuses on software engineering excellence, microservices architecture, cloud-native systems, and agile consulting.",
    size: "150+ Employees",
    founded: "2014",
    status: "approved"
  },
  {
    name: "Kaz Software",
    tagline: "Innovative Custom Software & Mobile Products",
    industry: "Product Development & Software",
    location: "Dhaka, Bangladesh",
    website: "https://kaz.com.bd",
    logo: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=150&q=80",
    description: "Kaz Software builds award-winning mobile apps, web portals, and software tools for global startups and Fortune 500 partners.",
    size: "200+ Employees",
    founded: "2004",
    status: "approved"
  },
  {
    name: "DataSoft Systems Bangladesh",
    tagline: "Pioneering Software Solutions for 25+ Years",
    industry: "Enterprise IT & IoT",
    location: "Dhaka, Bangladesh",
    website: "https://datasoft-bd.com",
    logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80",
    description: "DataSoft is CMMI Level 5 software company delivering fintech, microfinance tech, IoT, and port automation systems across Asia.",
    size: "700+ Employees",
    founded: "1998",
    status: "approved"
  },
  {
    name: "Therap BD",
    tagline: "Global SaaS Platform for Care & Health Management",
    industry: "HealthTech & SaaS",
    location: "Dhaka, Bangladesh",
    website: "https://therapbd.com",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=150&q=80",
    description: "Therap BD develops leading web-based SaaS solutions for home and community-based disability service providers in the US and globally.",
    size: "500+ Employees",
    founded: "2004",
    status: "approved"
  },
  {
    name: "Robi Axiata Limited",
    tagline: "Igniting Digital Innovations for Smart Bangladesh",
    industry: "Telecommunications & Digital Services",
    location: "Dhaka, Bangladesh",
    website: "https://robi.com.bd",
    logo: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=150&q=80",
    description: "Robi Axiata is a leading digital service provider offering high-speed mobile network, enterprise cloud solutions, and digital fintech innovations.",
    size: "3000+ Employees",
    founded: "1997",
    status: "approved"
  }
];

const jobTitles = [
  { title: "Senior Full Stack Engineer (Next.js & Node.js)", category: "Engineering", level: "Senior", min: 140000, max: 200000 },
  { title: "Lead Product Designer (UI/UX)", category: "Design", level: "Lead", min: 130000, max: 180000 },
  { title: "DevOps & Cloud Architect (AWS/Kubernetes)", category: "DevOps", level: "Senior", min: 160000, max: 240000 },
  { title: "Backend Software Engineer (Golang / Microservices)", category: "Engineering", level: "Mid-Level", min: 110000, max: 160000 },
  { title: "Frontend Specialist (React / Next.js)", category: "Engineering", level: "Mid-Level", min: 95000, max: 140000 },
  { title: "Mobile App Engineer (Flutter)", category: "Engineering", level: "Mid-Level", min: 90000, max: 135000 },
  { title: "Senior Data Scientist & AI Engineer", category: "Data & AI", level: "Senior", min: 170000, max: 250000 },
  { title: "QA Automation Engineer (Cypress / Selenium)", category: "Engineering", level: "Mid-Level", min: 80000, max: 120000 },
  { title: "Technical Product Manager", category: "Product", level: "Senior", min: 150000, max: 220000 },
  { title: "Cyber Security Analyst", category: "Engineering", level: "Mid-Level", min: 100000, max: 150000 },
  { title: "iOS Native Engineer (Swift)", category: "Engineering", level: "Senior", min: 130000, max: 190000 },
  { title: "Android Software Engineer (Kotlin)", category: "Engineering", level: "Mid-Level", min: 100000, max: 150000 },
  { title: "Database Administrator (PostgreSQL & MongoDB)", category: "DevOps", level: "Senior", min: 120000, max: 180000 },
  { title: "Engineering Manager", category: "Engineering", level: "Lead", min: 220000, max: 320000 },
  { title: "Junior Web Developer (React)", category: "Engineering", level: "Junior", min: 50000, max: 75000 },
  { title: "Senior UI/UX Researcher", category: "Design", level: "Senior", min: 110000, max: 160000 },
  { title: "Site Reliability Engineer (SRE)", category: "DevOps", level: "Senior", min: 150000, max: 230000 },
  { title: "Node.js API Architect", category: "Engineering", level: "Senior", min: 140000, max: 210000 },
  { title: "Machine Learning Engineer (PyTorch/TensorFlow)", category: "Data & AI", level: "Senior", min: 160000, max: 240000 },
  { title: "Digital Marketing Specialist", category: "Marketing", level: "Mid-Level", min: 70000, max: 110000 }
];

const locations = [
  "Dhaka, Bangladesh",
  "Dhaka (Hybrid)",
  "Remote (Bangladesh)",
  "Gulshan, Dhaka",
  "Banani, Dhaka",
  "Uttara, Dhaka",
  "Dhanmondi, Dhaka"
];

const jobTypes = ["Full-time", "Full-time", "Hybrid", "Remote", "Contract"];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db(dbName);

    const companyCollection = db.collection("companies");
    const jobCollection = db.collection("jobs");

    // 1. Clear existing seed data (optional clean slate)
    console.log("Clearing previous seed records...");
    await companyCollection.deleteMany({});
    await jobCollection.deleteMany({});

    // 2. Insert 15 Bangladeshi Companies
    console.log("Inserting 15 Bangladeshi Popular Companies...");
    const companyDocs = bangladeshiCompanies.map(c => ({
      ...c,
      createdAt: new Date()
    }));
    const insertedCompanies = await companyCollection.insertMany(companyDocs);
    const companyIds = Object.values(insertedCompanies.insertedIds);

    console.log(`Successfully inserted ${companyIds.length} Companies!`);

    // Fetch inserted companies with their _ids
    const createdCompanies = await companyCollection.find({}).toArray();

    // 3. Generate 40 Realistic Job Postings
    console.log("Generating 40 Job Postings linked to Bangladeshi Companies...");
    const jobsToInsert = [];

    for (let i = 0; i < 40; i++) {
      const company = createdCompanies[i % createdCompanies.length];
      const template = jobTitles[i % jobTitles.length];
      const loc = locations[i % locations.length];
      const type = jobTypes[i % jobTypes.length];

      const jobDoc = {
        title: `${template.title} ${i >= jobTitles.length ? `(Team ${Math.floor(i / jobTitles.length) + 1})` : ""}`.trim(),
        companyId: company._id.toString(),
        companyName: company.name,
        companyLogo: company.logo,
        location: loc,
        type: type,
        jobType: type,
        category: template.category,
        experienceLevel: template.level,
        minSalary: template.min,
        maxSalary: template.max,
        salary: `${template.min.toLocaleString()} - ${template.max.toLocaleString()} BDT / month`,
        currency: "BDT",
        description: `Join ${company.name} as a ${template.title}. In this role, you will collaborate with cross-functional product, design, and engineering teams to build modern, scalable digital services impacting thousands of users.`,
        requirements: [
          `3+ years of experience in ${template.category}`,
          "Proficiency in modern JavaScript / TypeScript / modern frameworks",
          "Strong problem-solving and software architecture skills",
          "Experience with RESTful APIs, Git workflows, and CI/CD pipelines",
          "Excellent communication and team collaboration abilities"
        ],
        responsibilities: [
          "Design, develop, and deploy production-grade software features",
          "Collaborate with product designers and engineers to optimize performance",
          "Write clean, maintainable code with automated test coverage",
          "Participate in code reviews and architectural discussions"
        ],
        benefits: [
          "Competitive salary & performance bonuses",
          "Health & Medical Insurance",
          "Flexible work hours & hybrid environment",
          "Festival bonuses (2x per year)",
          "Professional learning stipend"
        ],
        status: "active",
        createdAt: new Date(Date.now() - (i * 3600000 * 12)) // Staggered creation times
      };

      jobsToInsert.push(jobDoc);
    }

    const insertedJobs = await jobCollection.insertMany(jobsToInsert);
    console.log(`Successfully inserted ${insertedJobs.insertedCount} Jobs!`);

    console.log("==========================================");
    console.log("SEEDING COMPLETED SUCCESSFULLY!");
    console.log(`Database: ${dbName}`);
    console.log(`Total Companies: ${companyIds.length}`);
    console.log(`Total Jobs: ${insertedJobs.insertedCount}`);
    console.log("==========================================");

  } catch (error) {
    console.error("Seeding Error:", error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seedDatabase();
