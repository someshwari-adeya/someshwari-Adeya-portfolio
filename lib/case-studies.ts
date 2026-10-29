export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  platform: string;
  client?: string;
  location?: string;
  summary: string;
  overview: string[];
  liveUrl?: string;
  fit: "cover" | "contain";
  bg?: string;
  challenge: { text: string; points: string[] };
  solved: string[];
  howWeSolved: { title: string; detail: string; bullets?: string[] }[];
  challengesFaced: { problem: string; handling: string }[];
  results: { stats: { value: string; label: string }[]; points: string[] };
  stack: { group: string; items: string[] }[];
  gallery: { src: string; alt: string; ratio: number }[];
  testimonial?: { quote: string; name: string; role: string; company: string; place: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "zion",
    title: "Zion",
    category: "Events & Entertainment",
    platform: "Mobile App (iOS + Android)",
    client: "Vagsync AI",
    location: "Bengaluru, India (product for the UAE market)",
    summary:
      "An all-in-one event discovery, community and ticketing app that connects event seekers with creators.",
    overview: [
      "Zion is a cross-platform mobile platform for young people in the UAE. It brings AI-assisted event discovery, ticket booking, social feeds, chat and host analytics into a single app.",
      "A single account can act as both a community member and a seller or organizer, similar to how Upwork lets one account be a client and a freelancer.",
    ],
    fit: "contain",
    bg: "radial-gradient(ellipse at center, rgba(30, 27, 75, 0.75) 0%, rgba(10, 10, 15, 0.98) 100%)",
    challenge: {
      text: "Fragmented event discovery, friction-heavy ticket checkout, and complex creator analytics.",
      points: [
        "Event discovery was spread across social apps, chats and ticket sites",
        "Ticket checkout had too many steps and too many screens",
        "Creators had no clear view of how their events were performing",
        "Organizers and attendees needed to live in one account without mixing data",
      ],
    },
    solved: [
      "One place to discover events, follow creators, chat and buy tickets",
      "A short 2-step ticket booking flow that adapts to single or multi-date and single or multi-tier events",
      "A seller side with verification, an 8-step event creation wizard, ticket tiers and analytics",
      "One account that can switch between Community and Seller roles without cross-contaminating data",
      "Offline-cached browsing and search on mobile networks",
    ],
    howWeSolved: [
      {
        title: "One Flutter codebase for iOS and Android",
        detail:
          "Flutter and Dart with Riverpod for state, GoRouter for navigation and Freezed for immutable models, organized feature-first with SOLID principles.",
        bullets: [
          "Shared components: bottom navigation, app bars, gradient headers, onboarding progress bars",
          "Central files for strings, colors and constants, so no hardcoded copy or colors",
          "Responsive from small phones to large tablets",
        ],
      },
      {
        title: "AI-assisted discovery and recommendations",
        detail: "Personalized event suggestions and search so users find relevant events quickly. [CONFIRM details]",
      },
      {
        title: "Ticket purchase flow that adapts to the event",
        detail:
          "Select Tickets, Select Date and Checkout are rendered from the event API response, so one set of reusable screens covers four cases.",
        bullets: [
          "Single date and single tier: go straight to checkout",
          "Single date and multiple tiers: select tickets only",
          "Multiple dates and a single tier: select date only",
          "Multiple dates and multiple tiers: both screens",
        ],
      },
      {
        title: "Community feed and chat",
        detail:
          "Social feed, direct chat, shared event cards and media attachments (images, video, voice, documents).",
        bullets: [
          "Direct-to-storage two-phase upload: start session, upload to storage, complete, send message",
          "Content moderation lifecycle with reporting and an appeals flow",
        ],
      },
      {
        title: "Seller and host tools",
        detail:
          "Two-step identity and business verification before a seller can list events, then an 8-step event creation wizard with categories, schedule, artists, media and ticket tiers, all cached locally.",
      },
      {
        title: "Security",
        detail:
          "Two-factor authentication (authenticator app and SMS) with recovery codes shown once and never stored on the device, plus push notifications with a respectful single permission prompt.",
      },
    ],
    challengesFaced: [
      {
        problem: "One email needed two roles (Community and Seller). The backend had a single exclusive role per user.",
        handling:
          "Moved to an additive multi-role model, added a profile switch that issues a new scoped session, and tracked cached data per role so switching never mixed state.",
      },
      {
        problem: "Slow, blank first launch: the app waited for every service to initialize before showing the first frame.",
        handling:
          "Split startup into a minimal first tier before the first frame and a second tier that initializes concurrently with the splash. The router now holds on the splash until the second tier is ready.",
      },
      {
        problem: "Flaky connections made browsing and creation unreliable.",
        handling:
          "Local caching with Isar across feeds, search and every step of the event wizard, plus an offline queue that replays when connectivity returns.",
      },
      {
        problem: "Large 4K event videos stuttered or crashed on mid-range Android phones.",
        handling:
          "Enforced a strict 4:5 aspect ratio on upload and transcoded to 1080p H.264 on the server for broad device support.",
      },
      {
        problem: "Chat attachments needed to be fast and safe at the same time.",
        handling:
          "Direct-to-storage uploads with a quarantine step: files are only promoted to a permanent public URL after moderation approves them.",
      },
      {
        problem: "Firebase packages required a higher minimum iOS version than the project targeted. [CONFIRM keep or remove]",
        handling: "Raised the iOS deployment target to 15 and documented the dropped device support.",
      },
    ],
    results: {
      stats: [
        { value: "60 FPS", label: "Smooth on iOS and Android" },
        { value: "1", label: "Flutter codebase for both platforms" },
        { value: "2-step", label: "Ticket booking" },
        { value: "Offline", label: "Cached search and browsing" },
      ],
      points: [
        "Fluid 60 FPS performance across iOS and Android",
        "Offline-cached search",
        "High-conversion checkout",
      ],
    },
    stack: [
      { group: "Mobile", items: ["Flutter", "Dart", "Riverpod", "GoRouter", "Freezed", "Isar", "Dio"] },
      { group: "Backend", items: ["NestJS", "PostgreSQL", "Supabase"] },
      { group: "Services", items: ["Firebase", "Sentry", "PostHog", "Stripe"] },
    ],
    gallery: [
      { src: "/images/case-studies/zion/shot-01.png", alt: "Zion event discovery screen", ratio: 0.46 },
      { src: "/images/case-studies/zion/shot-02.png", alt: "Zion ticket selection screen", ratio: 0.46 },
      { src: "/images/case-studies/zion/shot-03.png", alt: "Zion checkout screen", ratio: 0.46 },
    ],
    testimonial: {
      quote:
        "The team worked closely with us on the mobile experience and paid attention to the small details in the ticket flow. Communication was straightforward, and we could discuss changes as we tested.",
      name: "Anush",
      role: "Founder & CEO",
      company: "Vagsync AI (Zion Platform)",
      place: "Bengaluru",
    },
  },

  {
    slug: "masterweg",
    title: "MasterWeg",
    category: "EdTech & Education",
    platform: "SaaS Web Platform",
    client: "MasterWeg",
    location: "Frankfurt, Germany",
    summary:
      "A unified student workspace that guides applicants to German Master's programs.",
    overview: [
      "MasterWeg centralizes profile matching, document preparation, language learning and application tracking for students applying to German Master's programs.",
    ],
    liveUrl: "https://masterweg.com/",
    fit: "cover",
    challenge: {
      text: "Fragmented university requirements, complex document checks, and disjointed application tracking across multiple portals.",
      points: [
        "Every university lists different requirements and formats",
        "Students submit wrong or incomplete documents",
        "Applications are tracked across many separate portals",
        "Language preparation (A1 German) lives in yet another tool",
      ],
    },
    solved: [
      "Matching applicants to suitable programs with AI",
      "Clear document guidelines per program",
      "Interactive A1 German learning inside the same workspace",
      "One place to track every application",
    ],
    howWeSolved: [
      { title: "AI program matching", detail: "Students enter their profile and get program suggestions that fit. [CONFIRM details]" },
      { title: "Document guidance and checks", detail: "Per-program document guidelines so submissions are correct the first time. [CONFIRM details]" },
      { title: "Language learning module", detail: "Interactive A1 German lessons built into the workspace." },
      { title: "Centralized tracking", detail: "One dashboard for statuses, deadlines and next steps across all applications." },
      {
        title: "A backend that supports many workflows",
        detail: "A cleaner foundation designed so several workflows can grow without becoming hard to maintain.",
      },
    ],
    challengesFaced: [
      {
        problem: "Several different workflows (matching, documents, learning, tracking) had to share one backend without turning it into a tangle.",
        handling: "Shaped the requirements with the founder first, then built a cleaner modular backend foundation.",
      },
    ],
    results: {
      stats: [
        { value: "100%", label: "Correct document submissions" },
        { value: "A1", label: "Interactive German learning" },
      ],
      points: [
        "100% correct document submissions",
        "Interactive language learning",
        "A streamlined admission matching process",
      ],
    },
    stack: [
      { group: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { group: "Backend", items: ["Node.js", "Express.js", "PostgreSQL"] },
    ],
    gallery: [
      { src: "/images/case-studies/masterweg/shot-01.png", alt: "MasterWeg dashboard", ratio: 1.6 },
      { src: "/images/case-studies/masterweg/shot-02.png", alt: "MasterWeg program matching", ratio: 1.6 },
    ],
    testimonial: {
      quote:
        "We needed a backend that could support several workflows without becoming difficult to maintain. The team took time to understand the requirements and helped us shape a cleaner foundation.",
      name: "Sandeep Rudra",
      role: "Founder & Managing Director",
      company: "MasterWeg",
      place: "Frankfurt, Germany",
    },
  },

  {
    slug: "freightflow",
    title: "FreightFlow",
    category: "Logistics & Transport",
    platform: "Multi-tenant SaaS + Driver App",
    client: "Built as a TechSonance product, first used by Ashutosh RoadLines",
    location: "Surat, India",
    summary:
      "A multi-tenant SaaS built exclusively for Indian road transport businesses.",
    overview: [
      "FreightFlow replaces disconnected spreadsheets and WhatsApp groups with a single, purpose-built digital system for transporters: consignments, trips, expenses, billing and compliance.",
      "It is positioned in simple Hinglish for transport owners and sold in three tiers with a 14-day free trial.",
    ],
    liveUrl: "https://freightflow.techsonance.co.in/dashboard",
    fit: "cover",
    challenge: {
      text: "Indian transport businesses drowning in paper LRs, manual GST calculations, and zero real-time fleet visibility.",
      points: [
        "Paper lorry receipts (LRs) and expenses kept in registers, spreadsheets and chats",
        "Manual GST and e-Way Bill calculations",
        "No way to see profit per truck or per trip until weeks later",
        "Billing mistakes found too late",
      ],
    },
    solved: [
      "Digital LRs and trip tracking",
      "Automated GST and e-Way Bill handling",
      "Per-trip profit and loss",
      "Drivers update trips from their own mobile app",
      "No missed compliance deadlines",
    ],
    howWeSolved: [
      { title: "Multi-tenant architecture", detail: "Each transport company gets isolated data inside one shared platform on Next.js, React and Supabase (PostgreSQL)." },
      { title: "Compliance automation", detail: "GST and e-Way Bill calculation built into the trip workflow so deadlines are tracked automatically." },
      { title: "Per-trip P&L", detail: "Revenue, expenses and driver costs roll up into profitability per trip and per truck in real time." },
      { title: "React Native driver app", detail: "Drivers log trip updates and expenses from the road, which removes WhatsApp and paper handoffs." },
      { title: "Go-to-market that fits the audience", detail: "India-specific visual language, a Hinglish landing page, and a 14-day free trial with tiered pricing." },
    ],
    challengesFaced: [
      {
        problem: "Compliance rules for GST and e-Way Bills are strict and easy to get wrong. [CONFIRM]",
        handling: "Encoded the rules inside the trip workflow instead of leaving them to manual entry. [CONFIRM]",
      },
    ],
    results: {
      stats: [
        { value: "100%", label: "Digital operations" },
        { value: "0", label: "Missed compliance deadlines" },
        { value: "Live", label: "Profitability per truck" },
      ],
      points: [
        "100% digital operations",
        "Zero missed compliance deadlines",
        "Real-time profitability per truck",
      ],
    },
    stack: [
      { group: "Frontend", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"] },
      { group: "Data", items: ["Supabase", "PostgreSQL"] },
      { group: "Mobile", items: ["React Native", "Expo"] },
    ],
    gallery: [
      { src: "/images/case-studies/freightflow/shot-01.png", alt: "FreightFlow dashboard", ratio: 1.6 },
      { src: "/images/case-studies/freightflow/shot-02.png", alt: "FreightFlow trip profit and loss", ratio: 1.6 },
    ],
    testimonial: {
      quote:
        "We were managing LR details and expenses across spreadsheets and WhatsApp. The new workflow has made it much easier to track each trip and catch billing issues before they become a problem.",
      name: "Ankur Rajput",
      role: "Founder & Managing Director",
      company: "Ashutosh RoadLines",
      place: "Surat, Gujarat",
    },
  },

  {
    slug: "syncserve-pos",
    title: "SyncServe POS",
    category: "Retail & Hospitality",
    platform: "Cloud POS (Web / PWA)",
    client: "Tasty Food Center",
    location: "Surat, Gujarat",
    summary:
      "A cloud-native point of sale with offline-first billing and real-time multi-outlet sync.",
    overview: [
      "SyncServe is a POS for retail and restaurants that keeps billing running when the internet drops, and keeps every outlet's inventory in sync when it returns.",
    ],
    liveUrl: "https://syncserve.techsonance.co.in/",
    fit: "cover",
    challenge: {
      text: "Retail businesses using outdated POS systems with no cloud sync, offline capability, or multi-outlet support.",
      points: [
        "Billing stops when the internet is unstable at rush hour",
        "No shared inventory across outlets",
        "Orders and kitchen tickets (KOTs) were hard to manage on legacy tools",
      ],
    },
    solved: [
      "Zero billing downtime during network outages",
      "Faster checkout",
      "One dashboard across all stores",
      "Real-time inventory sync across outlets",
      "Mobile billing",
    ],
    howWeSolved: [
      { title: "Offline-first architecture", detail: "Every order is saved on the device first, so billing continues without internet. Changes sync to the cloud automatically when the connection returns. [CONFIRM]" },
      { title: "Modular, feature-flagged engine", detail: "Features such as table management or inventory can be switched on or off per business, and only active feature code is loaded to keep the app fast. [CONFIRM]" },
      { title: "Real-time inventory sync", detail: "Stock changes at one outlet show up across all outlets." },
      { title: "Mobile billing and KOT printing", detail: "Orders and kitchen tickets keep printing reliably even when the network fluctuates." },
    ],
    challengesFaced: [
      {
        problem: "Keeping data correct when several devices edit offline and then reconnect. [CONFIRM]",
        handling: "Local-first storage with background delta sync, so conflicts are resolved after reconnect instead of blocking the cashier. [CONFIRM]",
      },
    ],
    results: {
      stats: [
        { value: "0", label: "Billing downtime in outages" },
        { value: "3x", label: "Faster checkout" },
      ],
      points: [
        "Zero billing downtime even during network outages",
        "3x faster checkout",
        "Unified multi-store dashboard",
      ],
    },
    stack: [
      { group: "Frontend", items: ["React", "TypeScript", "Tailwind CSS"] },
      { group: "Backend", items: ["Node.js", "Express.js", "MongoDB"] },
    ],
    gallery: [
      { src: "/images/case-studies/syncserve/shot-01.png", alt: "SyncServe POS billing screen", ratio: 1.6 },
      { src: "/images/case-studies/syncserve/shot-02.png", alt: "SyncServe multi-outlet dashboard", ratio: 1.6 },
    ],
    testimonial: {
      quote:
        "During rush hours when the internet fluctuates, billing can't stop. The offline mode keeps orders and KOTs printing reliably, and everything syncs automatically as soon as the connection is back.",
      name: "Rahul Rajput",
      role: "Founder & Owner",
      company: "Tasty Food Center",
      place: "Surat, Gujarat",
    },
  },

  {
    slug: "techsonance-marketplace",
    title: "TechSonance Marketplace",
    category: "E-Commerce & Retail",
    platform: "Multi-tenant E-Commerce Web App",
    location: "India",
    summary:
      "A multi-vendor marketplace where customers shop, vendors run their stores and admins oversee the platform.",
    overview: [
      "One React application serves three isolated portals: customers, vendors and admins. Vendors can launch a branded storefront and manage products, orders and payouts.",
    ],
    liveUrl: "https://cms.techsonance.co.in/login",
    fit: "cover",
    challenge: {
      text: "Building a scalable multi-vendor marketplace with role-isolated dashboards, real-time cart sync, and vendor onboarding, all in a single SPA.",
      points: [
        "Three roles with completely separate experiences and data",
        "Cart state must stay instant and consistent",
        "Vendors need their own financial reporting",
      ],
    },
    solved: [
      "Three fully isolated role portals",
      "Cart updates in under 200ms",
      "Vendor-level financial reporting",
      "Dark and light mode",
    ],
    howWeSolved: [
      { title: "Redux Toolkit multi-slice architecture", detail: "Separate slices for each domain with localStorage persistence for fast, resilient state." },
      { title: "Role-based routing", detail: "Customers, vendors and admins are routed to separate portals with guarded routes." },
      { title: "Analytics with Recharts", detail: "Sales, orders and revenue trends per vendor." },
      { title: "Storefront and operations features", detail: "Custom branding, product and inventory management, order lifecycle tracking, coupons and payment and shipping integrations (Razorpay, Shiprocket). [CONFIRM]" },
    ],
    challengesFaced: [
      {
        problem: "Keeping three role portals isolated inside one single-page app.",
        handling: "Role-scoped state slices and role-based routing so one portal never leaks data or UI into another.",
      },
    ],
    results: {
      stats: [
        { value: "3", label: "Isolated role portals" },
        { value: "<200ms", label: "Cart updates" },
      ],
      points: [
        "3 fully isolated role portals",
        "Cart updates in under 200ms",
        "Vendor-level financial reporting",
        "Dark and light mode",
      ],
    },
    stack: [
      { group: "Frontend", items: ["React 19", "TypeScript", "Vite 7", "Redux Toolkit", "React Router", "Recharts"] },
      { group: "Services", items: ["Razorpay", "Shiprocket", "Tailwind CSS"] },
    ],
    gallery: [
      { src: "/images/case-studies/marketplace/shot-01.png", alt: "Marketplace vendor dashboard", ratio: 1.6 },
      { src: "/images/case-studies/marketplace/shot-02.png", alt: "Marketplace storefront", ratio: 1.6 },
    ],
    testimonial: {
      quote:
        "Handling multiple vendors, diverse product catalogs, and automated payout splits seemed overwhelming. The platform handles cart updates smoothly and keeps our merchant onboarding straightforward and simple.",
      name: "Ronak Kothari",
      role: "Multi-Brand Merchant Partner",
      company: "TechSonance Marketplace Portfolio",
      place: "Ahmedabad, Gujarat",
    },
  },

  {
    slug: "utsav",
    title: "Utsav",
    category: "Community & Religious Events",
    platform: "Mobile App (Flutter)",
    summary:
      "A centralized mandal management app for festivals, donations, expenses, members and community operations.",
    overview: [
      "Utsav gives festival mandals one mobile app to run the whole year: schedules, finances, committees, vendors, announcements and reports.",
    ],
    fit: "contain",
    bg: "radial-gradient(ellipse at center, rgba(67, 24, 255, 0.15) 0%, rgba(12, 12, 16, 0.98) 100%)",
    challenge: {
      text: "Fragmented mandal operations, manual financial tracking, disconnected festival scheduling, and difficulty coordinating members, vendors, duties, and community communication.",
      points: [
        "Money tracked by hand across donations and expenses",
        "Festival schedules scattered across chats",
        "Hard to coordinate members, vendors and duties",
      ],
    },
    solved: [
      "One digital operating platform for the mandal",
      "Clear donation and expense tracking with reports",
      "Festival scheduling and event management in one place",
      "Role-based access for committee members",
    ],
    howWeSolved: [
      { title: "Festival and event scheduling", detail: "A single calendar for festival programs and events." },
      { title: "Financial management", detail: "Donations, expenses and reporting with analytics." },
      { title: "Committee and operations", detail: "Members, vendors, duties and announcements managed in the app." },
      { title: "Role-based access", detail: "Each person sees only what their role allows." },
      { title: "Flutter architecture", detail: "Flutter and Dart with Riverpod, GoRouter and Freezed, the same architecture used in Zion. [CONFIRM]" },
    ],
    challengesFaced: [
      {
        problem: "Offline mandal operations during dense festival crowds with network congestion. [CONFIRM]",
        handling: "Offline-first sync queue using local SQLite/Isar to persist donations and entries instantly. [CONFIRM]",
      },
    ],
    results: {
      stats: [
        { value: "1", label: "App for the whole mandal" },
      ],
      points: [
        "A unified digital operating platform that brings festival planning, financial management, community coordination and mandal administration into one mobile application",
      ],
    },
    stack: [
      { group: "Mobile", items: ["Flutter", "Dart", "Riverpod", "GoRouter", "Freezed"] },
      { group: "Backend", items: ["Firebase", "Cloud Functions", "Firestore"] },
    ],
    gallery: [
      { src: "/images/case-studies/utsav/shot-01.png", alt: "Utsav home screen", ratio: 0.46 },
      { src: "/images/case-studies/utsav/shot-02.png", alt: "Utsav finance screen", ratio: 0.46 },
    ],
  },

  {
    slug: "accunest",
    title: "Accunest",
    category: "Accounting & FinTech",
    platform: "Web Platform (SaaS)",
    client: "TechSonance Enterprise",
    location: "Surat, India",
    summary:
      "A premium invoicing, inventory management, and digital accounting suite custom-tailored for Indian businesses.",
    overview: [
      "Accunest is a full-stack Indian accounting platform with GST-aware billing, inventory tracking, and automated compliance reporting.",
      "Built with Next.js + MongoDB, it features micro-animations, real-time form validation, and role-based dashboards.",
    ],
    liveUrl: "https://accunest.techsonance.co.in/",
    fit: "cover",
    bg: "radial-gradient(ellipse at center, rgba(0, 137, 123, 0.25) 0%, rgba(10, 12, 14, 0.98) 100%)",
    challenge: {
      text: "Indian SMBs need GST-compliant invoicing with real-time tax calculations, PAN/bank validation, and PDF generation without needing a CA for daily tasks.",
      points: [
        "Intra-state vs inter-state tax rules (CGST+SGST vs IGST) caused constant billing errors",
        "Indian regulatory fields like PAN and GST numbers had no validation in standard software",
        "Billing and inventory were disjointed, causing stock discrepancies and overbooking",
      ],
    },
    solved: [
      "GST vs Non-GST billing engine with automatic CGST/SGST/IGST calculation",
      "Real-time PAN & GST validation on every customer form",
      "Instant professional PDF invoice generation via jsPDF and SheetJS XLSX exports",
      "Recharts dashboards for profit margins, sales trends, and inventory levels",
    ],
    howWeSolved: [
      { title: "Dynamic GST Calculation Engine", detail: "Automated CGST/SGST split for intra-state sales and single IGST for inter-state transactions based on customer GSTIN prefix." },
      { title: "Instant Invoicing & Exports", detail: "Integrated jsPDF with auto-table templates for branded A4 invoices, and SheetJS for one-click Excel exports." },
      { title: "Unified Inventory & Billing", detail: "Real-time stock deduction upon invoice generation with automated reorder alerts." },
    ],
    challengesFaced: [
      {
        problem: "Handling heavy table rendering and client-side PDF compilation without UI freezes.",
        handling: "Offloaded PDF generation to web workers and optimized table renders with virtualization.",
      },
    ],
    results: {
      stats: [
        { value: "0", label: "GST Calculation Errors" },
        { value: "5 min", label: "Invoice Generation" },
        { value: "100%", label: "Real-time Inventory Sync" },
      ],
      points: [
        "Eliminated manual tax calculation errors completely across 500+ generated invoices",
        "Cut average invoice creation time from 20 minutes to under 5 minutes",
      ],
    },
    stack: [
      { group: "Frontend", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "TanStack Query", "Zustand"] },
      { group: "Backend & Database", items: ["Node.js", "Express", "MongoDB", "Mongoose", "Zod"] },
      { group: "Utilities", items: ["jsPDF", "SheetJS", "Recharts"] },
    ],
    gallery: [
      { src: "/images/accunest/accunest-dashboard.png", alt: "Accunest Dashboard", ratio: 1.6 },
    ],
  },

  {
    slug: "nfc-attendance",
    title: "NFC Attendance System",
    category: "Enterprise Hardware & Software",
    platform: "Web Platform & Mobile PWA",
    summary:
      "A production-grade NFC-based attendance management system for IT companies and manufacturing facilities.",
    overview: [
      "Built with Next.js 15 and Turso SQLite, this system handles NFC tag enrollment, real-time attendance tracking, and offline buffering with automatic sync.",
      "Includes a Progressive Web App with Web NFC API for Android tap check-ins and a standalone Node.js daemon for USB/Ethernet desktop readers.",
    ],
    fit: "cover",
    bg: "radial-gradient(ellipse at center, rgba(245, 124, 0, 0.25) 0%, rgba(14, 11, 10, 0.98) 100%)",
    challenge: {
      text: "Manual registers and PIN-based systems were slow, prone to buddy-punching, and dropped check-ins during network outages.",
      points: [
        "Buddy punching in factory environments",
        "Network outages caused lost check-in data",
        "Physical hardware readers couldn't communicate reliably with the cloud",
      ],
    },
    solved: [
      "Sub-second NFC badge tap-to-clock-in",
      "Zero buddy-punching via cryptographically signed hardware reader agent",
      "Offline buffering with service worker and local SQLite sync",
      "Real-time HR analytics dashboard with one-click payroll CSV export",
    ],
    howWeSolved: [
      { title: "Standalone Reader Daemon", detail: "Developed a lightweight Node.js daemon communicating with USB/Ethernet NFC readers over PC/SC protocol with local queueing." },
      { title: "Edge SQLite Architecture", detail: "Powered by Turso edge database for ultra-low latency check-in verification." },
      { title: "Role-Based Access Control", detail: "Enforced strict role separation (Admin, HR, Reader, Employee) using Better Auth." },
    ],
    challengesFaced: [
      {
        problem: "Intermittent factory Wi-Fi causing dropped check-ins at shift change peaks.",
        handling: "Built an offline FIFO buffer in IndexedDB that synchronizes automatically when connectivity resumes.",
      },
    ],
    results: {
      stats: [
        { value: "0", label: "Buddy Punching" },
        { value: "< 250ms", label: "Tap Verification" },
        { value: "100%", label: "Offline Data Retention" },
      ],
      points: [
        "Streamlined check-in for 400+ employees with zero downtime during shift changes",
        "Completely eradicated unauthorized clock-in attempts",
      ],
    },
    stack: [
      { group: "Frontend", items: ["Next.js 15", "TypeScript", "Tailwind CSS", "Web NFC API", "Service Worker"] },
      { group: "Backend & Database", items: ["Turso SQLite", "Drizzle ORM", "Better Auth", "Node.js Agent"] },
    ],
    gallery: [
      { src: "/images/projects/placeholder-nfc-attendance.png", alt: "NFC Attendance Architecture", ratio: 1.6 },
    ],
  },
];

