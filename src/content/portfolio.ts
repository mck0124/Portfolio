export type Lens = "AI" | "Backend" | "Frontend" | "Mobile" | "Systems" | "Game" | "Product";

export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  role: string;
  timeline: string;
  location?: string;
  summary: string;
  impact: string[];
  stack: string[];
  lenses: Lens[];
  image?: string;
  links: {
    github?: string;
    demo?: string;
    deck?: string;
    video?: string;
  };
  detail: {
    problem: string;
    contribution: string[];
    technicalDecisions: string[];
    outcome: string;
  };
};

export type EducationItem = {
  school: string;
  program: string;
  timeline: string;
  location: string;
  logo: string;
  image: string;
  imageAlt: string;
  details: string[];
};

export type BrandSignal = {
  name: string;
  label: string;
  detail: string;
  logo: string;
  image?: string;
  imageAlt?: string;
};

export type ExperienceItem = {
  title: string;
  org: string;
  timeline: string;
  location: string;
  logo?: string;
  body: string;
};

export type AwardItem = {
  title: string;
  issuer: string;
  timeline: string;
  logo?: string;
  body: string;
};

export const profile = {
  name: "Minchan Kim",
  title: "AI & Software Engineer",
  location: "Hong Kong",
  email: "minchan0124@gmail.com",
  github: "https://github.com/mck0124",
  linkedin: "https://www.linkedin.com/in/minchankiim/",
  tagline: "I build AI-powered products that turn complex workflows into usable software.",
  intro:
    "Computer Engineering student at The University of Hong Kong, building across Spring Boot, FastAPI, React, SwiftUI, LLM/RAG workflows, databases, and interactive product interfaces.",
};

export const education: EducationItem[] = [
  {
    school: "The University of Hong Kong",
    program: "Bachelor of Engineering, Computer Engineering",
    timeline: "Sep 2022 - Jun 2028 expected",
    location: "Hong Kong",
    logo: "/logos/hku-crest.png",
    image: "/places/hku-engineering.jpg",
    imageAlt: "The University of Hong Kong engineering campus image",
    details: ["Discrete Mathematics", "Computer Organization & Microprocessors", "Linear Algebra", "Probability & Statistical Modelling"],
  },
  {
    school: "Western Academy of Beijing",
    program: "International Baccalaureate Diploma Programme",
    timeline: "Sep 2020 - Jun 2022",
    location: "Beijing, China",
    logo: "/logos/wab.svg",
    image: "/places/wab-campus.jpg",
    imageAlt: "Western Academy of Beijing campus",
    details: ["IB Diploma", "Economics", "Mathematics AA HL"],
  },
];

export const brandSignals: BrandSignal[] = [
  {
    name: "The University of Hong Kong",
    label: "Computer Engineering",
    detail: "Engineering student in Hong Kong",
    logo: "/logos/hku.svg",
    image: "/places/hku-campus.jpeg",
    imageAlt: "The University of Hong Kong campus",
  },
  {
    name: "Microsoft",
    label: "Student Ambassador",
    detail: "AI community and student developer leadership",
    logo: "/logos/microsoft-wordmark.svg",
  },
  {
    name: "Western Academy of Beijing",
    label: "IB Diploma Programme",
    detail: "International school foundation in Beijing",
    logo: "/logos/wab.svg",
    image: "/places/wab-campus-autumn.jpg",
    imageAlt: "Western Academy of Beijing campus in autumn",
  },
];

export const lenses: Lens[] = ["AI", "Backend", "Frontend", "Mobile", "Systems", "Game", "Product"];

export const projects: Project[] = [
  {
    slug: "zoop",
    title: "ZOOP - AI-Powered Recruiting Platform",
    shortTitle: "ZOOP",
    role: "Full-stack / AI service developer",
    timeline: "Jun 2025 - Aug 2025",
    location: "Seoul, Korea",
    summary:
      "A full-stack recruiting platform that helps companies shortlist developer candidates, match portfolios to job descriptions, and automate interview preparation.",
    impact: [
      "Processed 100+ candidate profiles for shortlisting and matching.",
      "Reduced first-round resume screening time by 90%.",
      "Generated 500+ tailored interview questions from candidate profiles.",
      "Connected GitHub scoring, portfolio matching, interview scheduling, and admin review flows.",
    ],
    stack: ["React", "Spring Boot 3", "FastAPI", "Oracle DB", "MySQL", "Docker", "LangChain", "OpenAI API"],
    lenses: ["AI", "Backend", "Frontend", "Product", "Systems"],
    image: "/projects/zoop/zoop_hero_final.png",
    links: {
      github: "https://github.com/mck0124/zoop.kr",
    },
    detail: {
      problem:
        "Recruiting teams spend too much time reviewing resumes one by one, while developer ability is often hidden in GitHub activity, portfolios, and interview performance.",
      contribution: [
        "Built Spring Boot REST APIs for company admins, candidates, job postings, interview sessions, scoring progress, and role-based access.",
        "Implemented FastAPI AI endpoints for RAG-style portfolio matching, profile-based interview question generation, and answer analysis.",
        "Designed a GitHub-based ranking engine using repository activity, language distribution, contribution signals, and role requirements.",
        "Integrated a React workflow for recruiters to review candidates by stage and inspect AI analysis results.",
      ],
      technicalDecisions: [
        "Separated the AI services from the Spring Boot backend so LLM workflows could evolve independently from transactional business logic.",
        "Used JWT and RBAC to separate company and candidate flows.",
        "Containerized the Spring Boot, FastAPI, and database services for reproducible local deployment.",
      ],
      outcome:
        "ZOOP became the flagship KOSA capstone project and received an Excellence Award for innovation and technical execution.",
    },
  },
  {
    slug: "phi",
    title: "Phi - Location-Based Safety Alert App",
    shortTitle: "Phi",
    role: "Backend / iOS developer",
    timeline: "Sep 2025 - Present",
    location: "Hong Kong",
    summary:
      "A SwiftUI safety-alert app that ingests hazard reports, scores location risk, rewards contributor activity, and suggests safer routes around reported incidents.",
    impact: [
      "Built Spring Boot APIs and database schemas for hazard reports, user profiles, contributor scoring, and geospatial risk data.",
      "Integrated MapKit and CoreLocation routing with risk overlays for safer navigation options.",
      "Used Git PRs, reviews, and weekly milestones to coordinate backend and mobile delivery.",
    ],
    stack: ["Spring Boot", "SwiftUI", "Swift", "MapKit", "CoreLocation", "MySQL"],
    lenses: ["Mobile", "Backend", "Product", "Systems"],
    links: {},
    detail: {
      problem:
        "People need fast, local, and credible safety information when moving through unfamiliar or high-risk areas.",
      contribution: [
        "Built a map-centric iOS experience with real-time incident browsing.",
        "Modeled hazard reports, user profiles, contributor scores, and nearby incident retrieval.",
        "Implemented risk overlays and safer-route concepts around reported incidents.",
      ],
      technicalDecisions: [
        "Used MapKit and CoreLocation for native map interactions and route-aware context.",
        "Modeled alert credibility, contributor activity, and geospatial retrieval as first-class backend concerns.",
      ],
      outcome:
        "The project emphasizes production-level public safety design, extensible architecture, and location-aware UX.",
    },
  },
  {
    slug: "haunted-memories",
    title: "Haunted Memories - C++ Text-Based Game",
    shortTitle: "Haunted Memories",
    role: "Core game engine developer",
    timeline: "Mar 2023 - May 2023",
    location: "Hong Kong",
    summary:
      "A C/C++ Linux game project focused on movement, interaction, map rendering, dynamic memory management, and file-saving systems.",
    impact: [
      "Led core game loop and rendering responsibilities.",
      "Managed character movement, interactions, and gameplay mechanics.",
      "Built progress tracking with dynamic memory and file persistence.",
    ],
    stack: ["C", "C++", "Linux", "Makefile", "CMake", "Bash"],
    lenses: ["Game", "Systems"],
    links: {
      github: "https://github.com/mck0124/ENGG1340-Group55",
      video: "https://www.youtube.com/watch?v=49U8a92DLWA",
    },
    detail: {
      problem:
        "The project required a playable game experience under low-level programming constraints instead of a high-level engine.",
      contribution: [
        "Led game screen rendering, movement logic, and interaction mechanics.",
        "Implemented save/load behavior with file persistence.",
        "Worked within C/C++ memory constraints and Linux build tooling.",
      ],
      technicalDecisions: [
        "Kept the engine simple and explicit so game state transitions were easy to test.",
        "Used dynamic memory where the map and gameplay state needed to evolve over time.",
      ],
      outcome:
        "The project became an early proof of low-level systems thinking and game-style interaction design.",
    },
  },
  {
    slug: "movie-booking-web",
    title: "Movie Booking Web",
    shortTitle: "Movie Booking",
    role: "Web developer",
    timeline: "Apr 2025",
    location: "Seoul, Korea",
    summary:
      "A web booking project built during KOSA training to practice end-to-end web UI, database flows, and service logic.",
    impact: [
      "Practiced web UI structure, booking flows, and database-driven state.",
      "Established foundation for later full-stack project work.",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Java", "SQL"],
    lenses: ["Frontend", "Backend", "Product"],
    links: {
      github: "https://github.com/mck0124/web_mini",
    },
    detail: {
      problem:
        "Booking systems require clear state transitions, inventory logic, and predictable user flows.",
      contribution: [
        "Built the booking flow and UI structure.",
        "Connected frontend interactions with backend and database logic.",
      ],
      technicalDecisions: ["Kept the flow explicit to make booking state easy to inspect and debug."],
      outcome: "The project served as a practical foundation before larger AI and full-stack systems.",
    },
  },
  {
    slug: "hotel-booking-java",
    title: "Hotel Booking Java System",
    shortTitle: "Hotel Booking",
    role: "Java system developer",
    timeline: "Foundation project",
    summary:
      "A Java mini project focused on object-oriented modeling, reservation logic, and maintainable console or service-style structure.",
    impact: [
      "Practiced Java object modeling and system state management.",
      "Built a foundation for backend service architecture.",
    ],
    stack: ["Java", "OOP", "CLI", "Git"],
    lenses: ["Backend", "Systems"],
    links: {
      github: "https://github.com/mck0124/Java-MiniProject",
    },
    detail: {
      problem:
        "Reservation systems need durable state modeling and clear responsibilities between users, rooms, and bookings.",
      contribution: ["Modeled core booking entities and interactions.", "Practiced maintainable Java structure and control flow."],
      technicalDecisions: ["Used object-oriented boundaries to separate data, operations, and user flow."],
      outcome: "The project strengthened fundamentals used later in Spring Boot service work.",
    },
  },
];

export const experience: ExperienceItem[] = [
  {
    title: "Microsoft Student Ambassador",
    org: "Microsoft",
    timeline: "Feb 2026 - Present",
    location: "Hong Kong SAR",
    logo: "/logos/microsoft.svg",
    body:
      "Campus technology leadership, AI community building, and student developer support in Hong Kong.",
  },
  {
    title: "Full-stack / iOS Developer - Citizen Alert App",
    org: "HKU Korean Coding Society - CMM",
    timeline: "Sep 2025 - Present",
    location: "Hong Kong SAR",
    logo: "/logos/hku-crest.png",
    body:
      "Co-building Phi, a SwiftUI and Spring Boot safety-alert app for hazard reporting, geospatial risk, safer routing, and contributor scoring.",
  },
  {
    title: "AI & Software Engineering Trainee",
    org: "Korea Software Industry Association",
    timeline: "Feb 2025 - Aug 2025",
    location: "Seoul, Korea",
    logo: "/logos/kosa-mark.png",
    body:
      "Completed project-based training across Java/Spring Boot, Python, SQL databases, cloud/server deployment, Docker, and LLM application development.",
  },
  {
    title: "Heavy Vehicle Operator",
    org: "Republic of Korea Army",
    timeline: "Aug 2023 - Feb 2025",
    location: "Hongcheon, Korea",
    logo: "/logos/rok-army.svg",
    body:
      "Served in the 11th Infantry Division as a heavy and combat vehicle operator and maintenance specialist.",
  },
];

export const awards: AwardItem[] = [
  {
    title: "KOSA Excellence Award",
    issuer: "NXT Cloud / 2025 KOSA ICT Program",
    timeline: "Sep 2025",
    logo: "/logos/kosa-mark.png",
    body: "Recognized for ZOOP capstone innovation, project contribution, and technical execution.",
  },
  {
    title: "3rd Place - 2025 AWS Hackathon",
    issuer: "AWS Korea, Ministry of Science and ICT, NIPA, KOSA",
    timeline: "Aug 2025",
    body: "Awarded for developing an AI-powered solution within a 2-day nationwide challenge.",
  },
  {
    title: "Microsoft Student Ambassador",
    issuer: "Microsoft",
    timeline: "2026 - Present",
    logo: "/logos/microsoft.svg",
    body: "Selected for student developer leadership and community-building activities.",
  },
  {
    title: "Science Gifted Class",
    issuer: "Ministry of Education, Korea / Daejeon Seo-Gu Office of Education",
    timeline: "2017 - 2018",
    body: "Early science and engineering-track program recognition.",
  },
  {
    title: "IB Diploma",
    issuer: "International Baccalaureate",
    timeline: "Sep 2022",
    body: "International curriculum foundation across analytical writing, mathematics, and economics.",
  },
];

export const skillGroups = [
  {
    title: "Languages",
    items: ["Java", "Python", "C/C++", "JavaScript", "Swift", "SQL", "Bash"],
  },
  {
    title: "Backend & APIs",
    items: ["Spring Boot 3", "Spring Security", "JWT", "FastAPI", "REST APIs", "RBAC"],
  },
  {
    title: "AI / ML",
    items: ["LangChain", "LangGraph", "OpenAI API", "Hugging Face", "RAG", "Pandas"],
  },
  {
    title: "Frontend & Mobile",
    items: ["React", "Tailwind CSS", "SwiftUI", "Swift", "MapKit", "CoreLocation"],
  },
  {
    title: "Data & DevOps",
    items: ["MySQL", "PostgreSQL", "Oracle DB", "Docker", "Docker Compose", "Linux", "Git", "AWS S3"],
  },
];

export const languages = ["Korean - Native", "English - Professional"];

export const homeStats = [
  { value: "100+", label: "profiles processed" },
  { value: "500+", label: "AI questions generated" },
  { value: "90%", label: "screening time reduction" },
];
