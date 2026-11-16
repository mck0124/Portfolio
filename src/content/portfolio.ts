export type Metric = { value: string; label: string };

export type CaseStudy = {
  slug: string;
  title: string;
  kicker: string;
  context: string;
  timeline: string;
  status: string;
  summary: string;
  metrics: Metric[];
  stack: string[];
  links: { label: string; href: string }[];
  image?: { src: string; alt: string; width: number; height: number };
  problem?: string;
  built: string[];
  pipeline: string[];
  decisions?: { title: string; body: string }[];
  limits?: string[];
};

export const profile = {
  name: "Minchan Kim",
  role: "Software Engineer",
  location: "Hong Kong",
  coords: "22.2830° N, 114.1371° E",
  email: "minchan0124@gmail.com",
  github: "https://github.com/mck0124",
  linkedin: "https://www.linkedin.com/in/minchankiim/",
  headline: "I build production geospatial and real-time systems.",
  intro:
    "Computer Engineering student at The University of Hong Kong and R&D Software Engineer Intern at WayMe, where I shipped GPS anomaly detection and live race tracking to production.",
  availability: "Open to 2027 summer internships",
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "fairplay",
    title: "FairPlay",
    kicker: "GPS anomaly detection and review",
    context: "WayMe · R&D Software Engineer Intern",
    timeline: "Jul 2026 – Present",
    status: "Production",
    summary:
      "A production system that analyses participants' GPS traces from trail-running, marathon and hiking events, ranks them by review priority, and shows organisers the evidence behind every score.",
    metrics: [
      { value: "3,000+", label: "GPS traces analysed" },
      { value: "7", label: "anomaly categories" },
      { value: "−33.5%", label: "score error (MAE) vs human review" },
      { value: "90%", label: "of scores within ±10 points of human review" },
    ],
    stack: ["Python", "FastAPI", "MongoDB", "Next.js", "TypeScript", "Mapbox GL JS", "AWS Lambda", "API Gateway", "SST", "Docker"],
    links: [],
    problem:
      "The original rule-based engine ran three checks and turned them straight into a verdict, without looking at GPS quality. A noisy trace and a real shortcut could look the same, and an organiser had no way to see why a participant was flagged.",
    built: [
      "Normalisation and quality validation for raw GPS and GPX data: gaps, spikes, missing points and inconsistent timestamps.",
      "Route matching against the planned course using 10–20 m route bins, giving route coverage, the largest missed gap and course progress.",
      "Evidence checks for safety-point passes and their order, off-route and shortcut segments, speed anomalies, reverse movement, GPS data quality and completion.",
      "An admin review interface on Mapbox GL JS: GPS playback from 1× to 100× with interpolation, and an evidence browser that jumps the map and the playback to the moment in question.",
      "Review decisions with edit history, an event-level dashboard with search, sort and filters, and CSV and HTML reports.",
      "A FastAPI service with a MongoDB job queue and a separate Python worker in Docker, deployed on AWS Lambda and API Gateway with SST.",
      "Integration with the activity-finish flow, so every finished activity is analysed automatically.",
    ],
    pipeline: ["GPS / GPX + participant", "Normalise + validate quality", "Geospatial evidence analysis", "Risk · Confidence · Evidence", "Admin review"],
    decisions: [
      {
        title: "A score is a review priority, not a verdict",
        body: "I split the output into three parts. Risk says how urgently a person should look. Confidence says how far the data can be trusted. Evidence is what the reviewer actually reads. The organiser makes the decision.",
      },
      {
        title: "No score is better than a misleading score",
        body: "If an activity is incomplete, the score is null. Completion is judged from evidence near the finish, so a broken recording is not treated as misconduct.",
      },
      {
        title: "Measure against human reviewers",
        body: "I compared scores with human-reviewed ones and iterated. MAE went from 9.40 to 6.25, RMSE from 14.27 to 9.46, the share within ±10 points from 66.7% to 90.0%, and errors above 30 points from three cases to none.",
      },
      {
        title: "Show only what the backend knows",
        body: "The review interface never displays placeholder data. If the backend does not have a value, the screen does not pretend it does.",
      },
    ],
    limits: [
      "The 90% figure is closeness to human review scores. It is not a cheating-detection accuracy.",
      "The human-reviewed set is small, in the tens of cases, so the error figures are indicative.",
    ],
  },
  {
    slug: "live-tracking",
    title: "One Live & N Live",
    kicker: "Real-time race tracking",
    context: "WayMe · R&D Software Engineer Intern",
    timeline: "2026 – Present",
    status: "Production",
    summary:
      "Live GPS tracking for outdoor events. One Live follows a single athlete on a 3D map. N Live shows every participant on a course at once, with estimated ranking and a spectator link per course.",
    metrics: [
      { value: "2", label: "live products in production" },
      { value: "33", label: "runners tracked at the first real race" },
      { value: "7 days", label: "expiring spectator links" },
    ],
    stack: ["Next.js", "React", "TypeScript", "Mapbox GL JS", "AWS AppSync", "WebSockets", "AWS Lambda", "SST", "Node.js", "MongoDB"],
    links: [],
    problem:
      "Spectators and organisers wanted to watch a race as it happens. The existing pipeline could stream one activity at a time, and there was no course-level channel and no way to load everyone's latest position at once.",
    built: [
      "One Live: app GPS telemetry streamed over AWS AppSync WebSockets to a Mapbox map with 3D terrain, satellite and drone views, checkpoint tracking, a broadcast-style HUD and live captions.",
      "N Live web viewing, backend and frontend: share links, a viewing-session API, initial positions and history, course-level participant data and signed subscription tokens.",
      "The AppSync subscription authoriser Lambda, extended from a single activity to event and course level, deployed with SST.",
      "A participants panel with search, filters, favourites and an estimated ranking based on progress along the GPS route.",
      "Marker motion: interpolation, short-range prediction, snapping to the GPX route, and grouping for overlapping runners.",
      "An organiser Live tab: per-course status, GPS pings in the last two minutes, and spectator links that revoke the previous one when regenerated.",
    ],
    pipeline: ["Mobile app GPS ping", "Ping Lambda: store + publish", "AppSync channel per course", "Browser subscribes directly", "Mapbox 3D map"],
    decisions: [
      {
        title: "Browsers subscribe to AppSync directly",
        body: "Lambdas handle sessions, permissions and history. Live positions go from the channel to the browser without a relay in between.",
      },
      {
        title: "An old ping must never overwrite a newer position",
        body: "A ping is published before it is stored, so messages can arrive out of order. The client ignores any ping older than the one it already shows, and reloads everyone's latest position after a reconnect.",
      },
      {
        title: "Ranking is an estimate and says so",
        body: "Progress comes from projecting each GPS point onto the planned route, with handling for overlapping sections and large deviations. Finishers are ordered by finish time. The interface labels the ranking as estimated, because it is not official timing.",
      },
      {
        title: "Agree the contract, then verify each stage",
        body: "A backend teammate owned the mobile ping API. We agreed the data and channel format, then I checked each stage in turn: stored, published, received on the web.",
      },
    ],
    limits: [
      "N Live is designed for 1,000 participants per course. Real use so far is one race with 33 runners.",
      "Load above 100 participants and long-running stability are not yet verified. Cost and latency have not been measured.",
    ],
  },
  {
    slug: "skill-gauge",
    title: "skill-gauge",
    kicker: "Evaluation CLI for LLM skills and prompts",
    context: "Personal project · open source",
    timeline: "Nov 2026",
    status: "Open source",
    summary:
      "A TypeScript CLI that runs an LLM skill or prompt against YAML test cases many times and reports pass rate, score, variance and regressions, so a prompt change can be gated in CI like any other code change.",
    metrics: [
      { value: "20% → 100%", label: "pass rate on one case type after a fix the tool found" },
      { value: "0.07", label: "judge MAE against blind human labels" },
      { value: "0", label: "regressions after the fix" },
    ],
    stack: ["TypeScript", "Node.js", "Vitest", "ESLint strictTypeChecked", "GitHub Actions", "YAML"],
    links: [{ label: "GitHub", href: "https://github.com/mck0124/skill-gauge" }],
    problem:
      "A single run of an LLM tells you very little. The same prompt can pass once and fail the next time, and a fix for one case can quietly break another.",
    built: [
      "Three commands: run, report and compare. Each case runs N times, and the report gives pass rate, mean score and standard deviation to expose flaky cases.",
      "A shell-command provider, so any model or agent that can be called from a terminal can be tested.",
      "An LLM rubric judge that fails closed: if the judge's answer cannot be parsed, the case fails.",
      "Exit codes 0, 1 and 2, so the tool works as a CI gate.",
      "A calibrate command that compares the judge with human scores: MAE, bias and agreement rate.",
      "An isolate option that runs each case in a clean directory.",
    ],
    pipeline: ["YAML test cases", "Run skill N× in isolation", "Assertions + rubric judge", "Pass rate · score · σ", "Compare → CI exit code"],
    decisions: [
      {
        title: "Isolation, after the evaluation contaminated itself",
        body: "The agent under test was reading the repository it ran in, so results depended on the environment. Running each case in a clean directory fixed that, and responses dropped from about 6–7 s to about 4 s.",
      },
      {
        title: "Calibrate the judge before trusting it",
        body: "I labelled 16 outputs blind and compared them with the judge. The first result was MAE 0.20 with 81% agreement. The cause was my own labels: the terminal had truncated the outputs I was scoring. After relabelling from the full text, a fresh run gave MAE 0.07, 100% agreement and r = 0.98.",
      },
      {
        title: "Do not tune the rubric to the results",
        body: "I left the rubric unchanged after seeing the calibration, to avoid fitting it to 16 examples.",
      },
    ],
    limits: ["Calibration used 16 outputs and one judge model. That is enough to catch a broken judge, and not enough to generalise."],
  },
  {
    slug: "zoop",
    title: "ZOOP",
    kicker: "AI-powered recruiting platform",
    context: "KOSA capstone · team of 4",
    timeline: "Jun 2025 – Aug 2025",
    status: "KOSA Excellence Award",
    summary:
      "A multi-service recruiting platform that shortlists developer candidates from their GitHub activity, matches portfolios to job descriptions and generates interview questions for each position.",
    metrics: [
      { value: "100+", label: "candidate profiles processed" },
      { value: "500+", label: "tailored interview questions generated" },
      { value: "~90%", label: "less manual first-round screening" },
    ],
    stack: ["React", "Spring Boot 3", "FastAPI", "MySQL", "Oracle DB", "Docker Compose", "LangChain", "OpenAI API", "JWT / RBAC"],
    links: [{ label: "GitHub", href: "https://github.com/mck0124/zoop.kr" }],
    image: { src: "/projects/zoop/zoop_hero_final.png", alt: "ZOOP recruiting platform landing page", width: 739, height: 623 },
    problem:
      "Recruiting teams review resumes one by one, while a developer's ability is usually visible in their GitHub activity, portfolio and interview answers.",
    built: [
      "Spring Boot REST APIs for company admins, candidates, job postings, interview sessions and scoring progress, with role-based access.",
      "FastAPI AI endpoints for RAG-style portfolio-to-job matching, position-aware interview question generation and answer analysis.",
      "A candidate scoring engine based on GitHub activity, language distribution, repository quality and the requirements of the role.",
      "A React workflow where recruiters review candidates by stage and inspect the AI analysis.",
    ],
    pipeline: ["React recruiter UI", "Spring Boot 3 API · JWT / RBAC", "FastAPI AI service · RAG / LLM", "MySQL / Oracle DB"],
    decisions: [
      {
        title: "AI service separate from the transactional backend",
        body: "LLM workflows change faster than business logic, so they live in their own FastAPI service and the Spring Boot backend stays stable.",
      },
      {
        title: "One command to run everything",
        body: "Spring Boot, FastAPI and the databases run under Docker Compose, so every teammate had the same environment.",
      },
    ],
  },
  {
    slug: "patrol-pro",
    title: "Patrol Pro",
    kicker: "Autonomous safety patrol robot",
    context: "HKU Integrated Design Project · team of 5",
    timeline: "Feb 2026 – Apr 2026",
    status: "Grade A+",
    summary:
      "A patrol robot that follows a route on its own, senses flame and gas, recognises faces when motion is detected and reports telemetry over Wi-Fi.",
    metrics: [
      { value: "A+", label: "course grade" },
      { value: "5", label: "person team" },
    ],
    stack: ["C / C++", "Jetson Nano", "ESP8266", "Sensors", "Servo control"],
    links: [{ label: "GitHub", href: "https://github.com/mck0124/PatrolPro" }],
    built: [
      "Line following with gyro-assisted navigation.",
      "Flame and gas sensing along the patrol route.",
      "Face recognition on a Jetson Nano, triggered by a PIR motion sensor.",
      "Telemetry over an ESP8266 Wi-Fi module, and servo actuation.",
    ],
    pipeline: ["Line + gyro navigation", "Flame / gas / PIR sensors", "Jetson Nano face recognition", "ESP8266 telemetry"],
  },
];

export const moreProjects = [
  {
    title: "asia-tech-internships",
    body: "An open list of tech internships and new-grad roles in Hong Kong, Singapore and South Korea. A daily GitHub Action collects postings from 55 company job boards through public Greenhouse, Lever and Ashby APIs.",
    stack: ["Python", "GitHub Actions"],
    href: "https://github.com/mck0124/asia-tech-internships",
  },
  {
    title: "Phi",
    body: "A location-based safety alert app for iOS, built with the HKU Korean Coding Society: hazard reports, contributor points and safer routes around reported incidents.",
    stack: ["SwiftUI", "MapKit", "Spring Boot"],
    href: "https://github.com/mck0124/Phi-backend",
  },
  {
    title: "Haunted Memories",
    body: "A text-based 2D escape game for Linux written in C and C++ by a team of five, with map rendering, dynamic memory management and save files.",
    stack: ["C", "C++", "Linux"],
    href: "https://github.com/mck0124/ENGG1340-Group55",
  },
];

export const experience = [
  {
    title: "R&D Software Engineer Intern",
    org: "WayMe (uHey Limited)",
    place: "Hong Kong Science Park",
    timeline: "Jul 2026 – Present",
    body: "Built and shipped FairPlay, One Live and N Live: production geospatial analysis and real-time GPS tracking for outdoor events.",
  },
  {
    title: "Microsoft Student Ambassador",
    org: "Microsoft",
    place: "Hong Kong",
    timeline: "Feb 2026 – Jun 2026",
    body: "Student developer community and AI events on campus.",
  },
  {
    title: "AI & Software Engineering Trainee",
    org: "Korea Software Industry Association (KOSA)",
    place: "Seoul",
    timeline: "Feb 2025 – Aug 2025",
    body: "Six months of project-based training in Java and Spring Boot, Python, SQL, React, Docker, cloud deployment and LLM applications. Capstone: ZOOP.",
  },
  {
    title: "Heavy Vehicle Operator",
    org: "Republic of Korea Army",
    place: "11th Infantry Division",
    timeline: "Aug 2023 – Feb 2025",
    body: "Mandatory service as a heavy and armoured vehicle operator.",
  },
];

export const education = [
  {
    school: "The University of Hong Kong",
    program: "BEng in Computer Engineering",
    timeline: "2022 – 2028 (expected)",
    note: "Exchange at the Australian National University, Feb – Jun 2027",
  },
  {
    school: "Western Academy of Beijing",
    program: "IB Diploma, 41 / 45",
    timeline: "2020 – 2022",
    note: "Mathematics AA HL 7, Physics HL 7",
  },
];

export const awards = [
  { title: "3rd Place, AWS Hackathon", detail: "Excellence Award, two-day nationwide challenge", timeline: "Aug 2025" },
  { title: "KOSA Excellence Award", detail: "For the ZOOP capstone project", timeline: "Sep 2025" },
  { title: "Microsoft Student Ambassador", detail: "Microsoft", timeline: "2026" },
  { title: "Computer Engineering Student Ambassador", detail: "The University of Hong Kong", timeline: "2025" },
];

export const skillGroups = [
  { title: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "C / C++", "SQL", "Swift", "Bash"] },
  { title: "Frontend + Geospatial", items: ["React", "Next.js", "Tailwind CSS", "Mapbox GL", "MapKit", "CoreLocation"] },
  { title: "Backend", items: ["Node.js", "NestJS", "FastAPI", "Spring Boot 3", "REST", "JWT / RBAC"] },
  { title: "Data + AI", items: ["MongoDB", "MySQL", "PostgreSQL", "Oracle DB", "Pandas", "LangChain", "LangGraph", "RAG"] },
  { title: "Cloud + Tools", items: ["AWS Lambda", "AppSync", "EC2", "S3", "SST", "Docker", "Git", "Linux"] },
  { title: "Embedded", items: ["Jetson Nano", "ESP8266", "ARM assembly", "Sensors"] },
];
