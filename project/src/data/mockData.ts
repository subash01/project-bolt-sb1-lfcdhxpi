import { Resource, DemandRequest, Role } from '../types';

const FIRST_NAMES = [
  'Sarah', 'Marcus', 'Emily', 'David', 'Priya', 'Alex', 'Jennifer', 'Michael', 'Rachel', 'James',
  'Jessica', 'Daniel', 'Sophia', 'William', 'Olivia', 'Robert', 'Emma', 'John', 'Ava', 'Matthew',
  'Isabella', 'Christopher', 'Mia', 'Andrew', 'Charlotte', 'Joseph', 'Amelia', 'Ryan', 'Harper', 'Kevin',
  'Evelyn', 'Brian', 'Abigail', 'Thomas', 'Elizabeth', 'Charles', 'Sofia', 'Jason', 'Ella', 'Timothy',
  'Madison', 'Joshua', 'Scarlett', 'Eric', 'Grace', 'Jonathan', 'Chloe', 'Justin', 'Victoria', 'Brandon',
  'Lily', 'Samuel', 'Hannah', 'Aaron', 'Zoe', 'Nathan', 'Penelope', 'Patrick', 'Layla', 'Gregory',
  'Aria', 'Dennis', 'Nora', 'Jerry', 'Riley', 'Tyler', 'Ellie', 'Frank', 'Stella', 'Scott',
  'Hazel', 'Paul', 'Aurora', 'Walter', 'Violet', 'Henry', 'Savannah', 'Douglas', 'Brooklyn', 'Peter',
  'Bella', 'Carl', 'Claire', 'Arthur', 'Skylar', 'Raymond', 'Lucy', 'Eugene', 'Paisley', 'Russell',
  'Everly', 'Harold', 'Anna', 'Keith', 'Caroline', 'Lawrence', 'Nova', 'Albert', 'Genesis', 'Willie'
];

const LAST_NAMES = [
  'Chen', 'Johnson', 'Rodriguez', 'Kim', 'Sharma', 'Thompson', 'Liu', 'Brown', 'Green', 'Wilson',
  'Garcia', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Walker',
  'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Adams', 'Baker',
  'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker',
  'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan',
  'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Torres',
  'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett',
  'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson',
  'Hughes', 'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander', 'Russell',
  'Griffin', 'Diaz', 'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Wallace', 'Woods'
];

const AVATAR_URLS = [
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
  'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
  'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
  'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
  'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg',
  'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
  'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg',
  'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
  'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg',
  'https://images.pexels.com/photos/2169434/pexels-photo-2169434.jpeg',
  'https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg',
  'https://images.pexels.com/photos/1906157/pexels-photo-1906157.jpeg',
  'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
  'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg'
];

function generateRandomResource(index: number): Resource {
  const roles: Role[] = ['Developer', 'QA', 'PM', 'Architect'];
  const role = roles[Math.floor(Math.random() * roles.length)];

  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const name = `${firstName} ${lastName}`;

  const experience = Math.floor(Math.random() * 15) + 1;
  const availability = [0, 25, 50, 75, 100][Math.floor(Math.random() * 5)];
  const pastPerformance = 3 + Math.random() * 2;

  const baseCost = role === 'Architect' ? 150 : role === 'PM' ? 120 : role === 'Developer' ? 100 : 80;
  const experienceFactor = 1 + (experience * 0.05);
  const cost = Math.round(baseCost * experienceFactor);

  const baseHourlyRate = role === 'Architect' ? 120 : role === 'PM' ? 95 : role === 'Developer' ? 80 : 65;
  const hourlyRate = Math.round(baseHourlyRate * experienceFactor);

  const isBenched = Math.random() > 0.7;
  let benchDate: string | null = null;
  if (isBenched && availability >= 75) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    benchDate = date.toISOString().split('T')[0];
  }

  const allSkills = SKILLS_LIST;
  const numSkills = Math.floor(Math.random() * 4) + 3;
  const skills = [];
  const selectedSkills = new Set<string>();

  while (skills.length < numSkills) {
    const skill = allSkills[Math.floor(Math.random() * allSkills.length)];
    if (!selectedSkills.has(skill)) {
      selectedSkills.add(skill);
      skills.push({
        name: skill,
        rating: Math.floor(Math.random() * 3) + 3
      });
    }
  }

  const currentAllocations = [];
  const numAllocations = availability === 100 ? 0 : Math.floor(Math.random() * 2);

  for (let i = 0; i < numAllocations; i++) {
    const allocationPercentage = [25, 50, 75][Math.floor(Math.random() * 3)];
    const projectIndex = Math.floor(Math.random() * PROJECTS_LIST.length);
    const projectCode = `PRJ${String(projectIndex + 1).padStart(4, '0')}`;
    currentAllocations.push({
      projectName: PROJECTS_LIST[projectIndex],
      projectCode,
      percentage: allocationPercentage,
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EE4961', '#8B5CF6'][Math.floor(Math.random() * 5)],
      bookingType: Math.random() > 0.7 ? 'soft-booked' : 'hard-booked'
    });
  }

  const riskIndicators = [];
  if (availability === 0) {
    riskIndicators.push('Limited availability for new projects');
  }
  if (experience < 3) {
    riskIndicators.push('Junior resource - may need mentorship');
  }

  const baseEmployeeCtc = role === 'Architect' ? 2500 : role === 'PM' ? 2000 : role === 'Developer' ? 1500 : 1200;
  const employeeCtc = Math.round(baseEmployeeCtc * experienceFactor);
  const positionCtc = Math.round(employeeCtc * (0.9 + Math.random() * 0.3));

  return {
    id: `res-${String(index + 1).padStart(4, '0')}`,
    name,
    role,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    experience,
    skills,
    availability,
    currentAllocations,
    pastPerformance: Math.round(pastPerformance * 10) / 10,
    riskIndicators,
    avatar: `${AVATAR_URLS[index % AVATAR_URLS.length]}?auto=compress&cs=tinysrgb&w=150`,
    cost,
    hourlyRate,
    benchDate,
    employeeCtc,
    positionCtc
  };
}

export const PROJECTS_LIST = [
  'Delfi - Sapio Architect', 'HealthSync Mobile App', 'SAPASOW0047 - SANOFI M&S - QcKen roll-out',
  'VectorY: Freezer DB migration', 'Global LV-SDMS Coaching-Berlin, Weimar', 'SAYSSOW0033 - RDDO 4: Benchling - ELN Customization',
  'Phoenix CRM Platform', 'Stellar Analytics Dashboard', 'Atlas Enterprise Suite', 'FinanceFlow API Gateway',
  'Nebula Cloud Infrastructure', 'DataSync Real-time Processing', 'CloudVault Security Suite', 'MobileFirst Framework',
  'DevOps Automation Pipeline', 'API Modernization Initiative', 'Legacy System Migration', 'Blockchain Integration Layer',
  'AI-Powered Recommendation Engine', 'Real-time Monitoring Dashboard', 'Payment Gateway Integration', 'Customer Portal Redesign',
  'Supply Chain Optimization', 'IoT Device Management', 'Machine Learning Pipeline', 'Data Warehouse Migration',
  'Kubernetes Cluster Setup', 'Microservices Architecture Migration', 'GraphQL API Implementation', 'Event-Driven System Design',
  'Container Orchestration Platform', 'Distributed Cache Implementation', 'Message Queue System Setup', 'Load Balancing Solution',
  'Disaster Recovery Planning', 'Security Audit & Hardening', 'Performance Optimization Project', 'Database Optimization',
  'Mobile App Development', 'Web Application Modernization', 'E-Commerce Platform Upgrade', 'Content Management System',
  'Document Management Solution', 'Workflow Automation System', 'Business Intelligence Platform', 'Analytics Engine Development',
  'Customer Relationship Management', 'Enterprise Resource Planning', 'Human Resources Management', 'Project Management Tool',
];

export const CLIENTS_LIST = [
  'RetailMax Inc.', 'MedTech Solutions', 'Sanofi', 'VectorY Systems', 'Global Logistics Corp', 'RDDO Solutions',
  'TechCorp Global', 'FinanceHub Corporation', 'RetailFlow Systems', 'CloudFirst Industries', 'SecureNet Solutions',
  'DataDrive Analytics', 'InnovateLabs Inc.', 'GlobalTech Enterprises', 'FutureVision Partners', 'TechPulse Holdings',
  'CloudScale Systems', 'NexGen Technologies', 'DigitalWave Solutions', 'IntelliStart Inc.', 'StreamFlow Dynamics',
  'PowerCode Systems', 'QuantumLeap Tech', 'VelocityX Solutions', 'InfoStream Global', 'TechMatrix Corp',
  'SynergyLabs Inc.', 'PrimeTech Solutions', 'EliteCore Systems', 'VortexTech Global', 'ImpactFlow Industries',
  'ZenithTech Partners', 'OptimaCore Solutions', 'NimbusEdge Systems', 'FusionWorks Global', 'AscendTech Inc.',
  'BrightSpark Solutions', 'CatalystEdge Corp', 'DynamicFlow Industries', 'EvoSystems Global', 'FrontierTech Inc.',
  'GravityFlow Solutions', 'HarmonyTech Global', 'InfinityCore Systems', 'JunctionFlow Industries', 'KaleidoSystems Corp',
  'LumaEdge Solutions', 'MomentumTech Global', 'NexusFlow Systems', 'OmniTech Industries', 'PeakFlow Solutions',
];

export const SKILLS_LIST = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'FastAPI',
  'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'GraphQL',
  'REST API', 'Agile', 'Scrum', 'JIRA', 'Git', 'CI/CD',
  'Selenium', 'Jest', 'Cypress', 'System Design', 'Microservices'
];

const baseResources: Resource[] = [
  {
    id: 'res-0001',
    name: 'Sarah Chen',
    role: 'Developer',
    email: 'sarah.chen@company.com',
    experience: 6,
    skills: [
      { name: 'React', rating: 5 },
      { name: 'TypeScript', rating: 5 },
      { name: 'Node.js', rating: 4 },
      { name: 'PostgreSQL', rating: 4 },
      { name: 'AWS', rating: 3 },
    ],
    availability: 25,
    currentAllocations: [
      { projectName: 'Phoenix CRM', projectCode: 'PRJ0007', percentage: 25, startDate: '2025-12-01', endDate: '2025-12-31', color: '#3B82F6' },
      { projectName: 'Stellar Platform', projectCode: 'PRJ0008', percentage: 50, startDate: '2025-12-10', endDate: '2026-01-10', color: '#10B981' },
    ],
    pastPerformance: 4.8,
    riskIndicators: [],
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    cost: 130,
    hourlyRate: 104,
    benchDate: null,
    employeeCtc: 1950,
    positionCtc: 2100,
  },
  {
    id: 'res-0002',
    name: 'Marcus Johnson',
    role: 'Architect',
    email: 'marcus.j@company.com',
    experience: 12,
    skills: [
      { name: 'System Design', rating: 5 },
      { name: 'Microservices', rating: 5 },
      { name: 'AWS', rating: 5 },
      { name: 'Java', rating: 5 },
      { name: 'Kubernetes', rating: 4 },
    ],
    availability: 0,
    currentAllocations: [
      { projectName: 'Atlas Platform', projectCode: 'PRJ0009', percentage: 50, startDate: '2025-12-01', endDate: '2026-01-31', color: '#10B981' },
      { projectName: 'FinanceFlow API', projectCode: 'PRJ0010', percentage: 50, startDate: '2025-12-15', endDate: '2026-02-15', color: '#F59E0B' },
    ],
    pastPerformance: 4.9,
    riskIndicators: ['Limited availability for new projects'],
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    cost: 240,
    hourlyRate: 192,
    benchDate: null,
    employeeCtc: 4000,
    positionCtc: 3800,
  },
  {
    id: 'res-0003',
    name: 'Emily Rodriguez',
    role: 'QA',
    email: 'emily.r@company.com',
    experience: 4,
    skills: [
      { name: 'Selenium', rating: 5 },
      { name: 'Cypress', rating: 4 },
      { name: 'Jest', rating: 4 },
      { name: 'Python', rating: 3 },
      { name: 'Agile', rating: 4 },
    ],
    availability: 0,
    currentAllocations: [
      { projectName: 'Sprint Testing', projectCode: 'PRJ0015', percentage: 100, startDate: '2025-12-15', endDate: '2025-12-22', color: '#EE4961' },
    ],
    pastPerformance: 4.5,
    riskIndicators: [],
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    cost: 96,
    hourlyRate: 78,
    benchDate: null,
    employeeCtc: 1440,
    positionCtc: 1500,
  },
  {
    id: 'res-0004',
    name: 'David Kim',
    role: 'Developer',
    email: 'david.kim@company.com',
    experience: 8,
    skills: [
      { name: 'Java', rating: 5 },
      { name: 'FastAPI', rating: 5 },
      { name: 'Python', rating: 5 },
      { name: 'Microservices', rating: 4 },
      { name: 'Docker', rating: 4 },
    ],
    availability: 25,
    currentAllocations: [
      { projectName: 'Enterprise Migration', projectCode: 'PRJ0017', percentage: 75, startDate: '2025-06-01', endDate: '2026-05-31', color: '#8B5CF6' },
    ],
    pastPerformance: 4.7,
    riskIndicators: ['Long-term commitment - limited flexibility'],
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    cost: 140,
    hourlyRate: 112,
    benchDate: null,
    employeeCtc: 2100,
    positionCtc: 2000,
  },
  {
    id: 'res-0005',
    name: 'Priya Sharma',
    role: 'PM',
    email: 'priya.s@company.com',
    experience: 7,
    skills: [
      { name: 'Agile', rating: 5 },
      { name: 'Scrum', rating: 5 },
      { name: 'JIRA', rating: 5 },
      { name: 'REST API', rating: 3 },
    ],
    availability: 50,
    currentAllocations: [
      { projectName: 'Nebula Analytics', projectCode: 'PRJ0011', percentage: 50, startDate: '2025-02-01', endDate: '2025-05-31', color: '#F59E0B' },
    ],
    pastPerformance: 4.6,
    riskIndicators: [],
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
    cost: 162,
    hourlyRate: 128,
    benchDate: null,
    employeeCtc: 2700,
    positionCtc: 2600,
  },
  {
    id: 'res-0006',
    name: 'Alex Thompson',
    role: 'Developer',
    email: 'alex.t@company.com',
    experience: 3,
    skills: [
      { name: 'React', rating: 4 },
      { name: 'TypeScript', rating: 3 },
      { name: 'Node.js', rating: 3 },
      { name: 'MongoDB', rating: 3 },
      { name: 'Git', rating: 4 },
    ],
    availability: 10,
    currentAllocations: [
      { projectName: 'CloudScale MVP', projectCode: 'PRJ0012', percentage: 40, startDate: '2025-01-15', endDate: '2025-04-30', color: '#3B82F6', bookingType: 'soft-booked' },
      { projectName: 'FinanceHub Dashboard', projectCode: 'PRJ0013', percentage: 50, startDate: '2025-03-01', endDate: '2025-06-30', color: '#10B981', bookingType: 'soft-booked' },
    ],
    pastPerformance: 4.2,
    riskIndicators: ['Junior resource - may need mentorship'],
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
    cost: 115,
    hourlyRate: 92,
    benchDate: '2025-11-15',
    employeeCtc: 1725,
    positionCtc: 1800,
  },
  {
    id: 'res-0007',
    name: 'Jennifer Liu',
    role: 'Architect',
    email: 'jennifer.l@company.com',
    experience: 10,
    skills: [
      { name: 'System Design', rating: 5 },
      { name: 'AWS', rating: 5 },
      { name: 'Kubernetes', rating: 5 },
      { name: 'CI/CD', rating: 4 },
      { name: 'Microservices', rating: 5 },
    ],
    availability: 25,
    currentAllocations: [
      { projectName: 'Phoenix CRM', projectCode: 'PRJ0007', percentage: 50, startDate: '2025-01-01', endDate: '2025-04-30', color: '#3B82F6' },
      { projectName: 'Nebula Analytics', projectCode: 'PRJ0011', percentage: 25, startDate: '2025-02-01', endDate: '2025-05-31', color: '#F59E0B' },
    ],
    pastPerformance: 4.9,
    riskIndicators: ['Over-allocated - potential burnout risk'],
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    cost: 225,
    hourlyRate: 180,
    benchDate: null,
    employeeCtc: 3750,
    positionCtc: 3600,
  },
  {
    id: 'res-0008',
    name: 'Michael Brown',
    role: 'QA',
    email: 'michael.b@company.com',
    experience: 5,
    skills: [
      { name: 'Selenium', rating: 4 },
      { name: 'Jest', rating: 5 },
      { name: 'Cypress', rating: 5 },
      { name: 'Agile', rating: 4 },
      { name: 'CI/CD', rating: 3 },
    ],
    availability: 75,
    currentAllocations: [
      { projectName: 'Atlas Platform', projectCode: 'PRJ0009', percentage: 25, startDate: '2025-01-15', endDate: '2025-06-30', color: '#10B981' },
    ],
    pastPerformance: 4.4,
    riskIndicators: [],
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    cost: 100,
    hourlyRate: 81,
    benchDate: '2025-10-01',
    employeeCtc: 1500,
    positionCtc: 1550,
  },
  {
    id: 'res-0009',
    name: 'Rachel Green',
    role: 'Developer',
    email: 'rachel.g@company.com',
    experience: 5,
    skills: [
      { name: 'Python', rating: 5 },
      { name: 'FastAPI', rating: 4 },
      { name: 'PostgreSQL', rating: 4 },
      { name: 'Docker', rating: 4 },
      { name: 'GraphQL', rating: 4 },
    ],
    availability: 50,
    currentAllocations: [
      { projectName: 'Phoenix CRM', projectCode: 'PRJ0007', percentage: 50, startDate: '2025-01-01', endDate: '2025-03-31', color: '#3B82F6' },
    ],
    pastPerformance: 4.6,
    riskIndicators: [],
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
    cost: 125,
    hourlyRate: 100,
    benchDate: null,
    employeeCtc: 1875,
    positionCtc: 1900,
  },
  {
    id: 'res-0010',
    name: 'James Wilson',
    role: 'PM',
    email: 'james.w@company.com',
    experience: 9,
    skills: [
      { name: 'Agile', rating: 5 },
      { name: 'Scrum', rating: 5 },
      { name: 'JIRA', rating: 5 },
      { name: 'System Design', rating: 3 },
    ],
    availability: 100,
    currentAllocations: [],
    pastPerformance: 4.8,
    riskIndicators: [],
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    cost: 174,
    hourlyRate: 138,
    benchDate: '2025-12-01',
    employeeCtc: 2940,
    positionCtc: 2900,
  },
];

export const mockResources: Resource[] = [
  ...baseResources,
  ...Array.from({ length: 2490 }, (_, i) => generateRandomResource(i + 10))
];

export const mockDemandRequests: DemandRequest[] = [
  {
    id: '001',
    projectName: 'Delfi - Sapio Architect',
    clientName: 'RetailMax Inc.',
    customer: 'RetailMax Inc.',
    startDate: '2025-03-01',
    endDate: '2025-08-31',
    requestStartDate: '2025-03-01',
    requestEndDate: '2025-08-31',
    expectedClosureDate: '2026-12-31',
    roleRequired: 'Developer',
    requiredSkills: ['React', 'TypeScript', 'Node.js'],
    minProficiency: 4,
    allocationPercentage: 100,
    priority: 'High',
    budgetSensitivity: 'Medium',
    clientCriticality: 'High',
    notes: 'Strategic account - need senior frontend expertise',
    status: 'Open',
    requestStatus: 'Pending',
    sourceType: 'Project',
    requestedBy: 'Prakash Dhandapani',
    workLocation: 'Remote',
    commercialType: 'Fixed',
    allocationExecutive: 'Sarah Martinez',
    allocationCoordinator: 'John Smith',
    region: 'North America',
    legalEntity: 'TechCorp Inc.',
    division: 'Digital Solutions',
    subDivision: 'E-Commerce',
    operationModel: 'Dedicated Team',
    createdAt: '2025-02-15',
  },
  {
    id: '002',
    projectName: 'HealthSync Mobile App',
    clientName: 'MedTech Solutions',
    customer: 'MedTech Solutions',
    startDate: '2025-04-01',
    endDate: '2025-09-30',
    requestStartDate: '2025-04-01',
    requestEndDate: '2025-09-30',
    expectedClosureDate: '2026-08-31',
    roleRequired: 'QA',
    requiredSkills: ['Selenium', 'Cypress', 'Agile'],
    minProficiency: 3,
    allocationPercentage: 75,
    priority: 'Medium',
    budgetSensitivity: 'Low',
    clientCriticality: 'Medium',
    notes: 'Healthcare compliance testing required',
    status: 'In Progress',
    requestStatus: 'In Progress',
    sourceType: 'Project',
    requestedBy: 'Prakash Dhandapani',
    acceptedBy: 'Emily Rodriguez',
    workLocation: 'Hybrid',
    commercialType: 'T&M',
    allocationExecutive: 'Michael Johnson',
    allocationCoordinator: 'Lisa Wong',
    region: 'Europe',
    legalEntity: 'GlobalTech GmbH',
    division: 'Healthcare Solutions',
    subDivision: 'Mobile Apps',
    operationModel: 'Augmented Team',
    createdAt: '2025-02-10',
  },
  {
    id: '003',
    projectName: 'SAPASOW0047 - SANOFI M&S - QcKen roll-out',
    clientName: 'Sanofi',
    customer: 'Sanofi',
    startDate: '2025-03-15',
    endDate: '2025-12-31',
    requestStartDate: '2025-03-15',
    requestEndDate: '2025-12-31',
    expectedClosureDate: '2026-07-19',
    roleRequired: 'Architect',
    requiredSkills: ['System Design', 'Microservices', 'AWS'],
    minProficiency: 5,
    allocationPercentage: 50,
    priority: 'Critical',
    budgetSensitivity: 'Low',
    clientCriticality: 'High',
    notes: 'Needs architect with financial services experience',
    status: 'Open',
    requestStatus: 'Allocated',
    sourceType: 'Project',
    requestedBy: 'Maxime Zuberbuhler',
    acceptedBy: 'Marcus Johnson',
    workLocation: 'On-site',
    commercialType: 'FP',
    allocationExecutive: 'David Chen',
    allocationCoordinator: 'Emma Brown',
    region: 'Europe',
    legalEntity: 'EuroTech Ltd.',
    division: 'Enterprise Solutions',
    subDivision: 'Architecture',
    operationModel: 'Dedicated Team',
    createdAt: '2025-02-18',
  },
  {
    id: '004',
    projectName: 'VectorY: Freezer DB migration',
    clientName: 'VectorY Systems',
    customer: 'VectorY Systems',
    startDate: '2025-05-01',
    endDate: '2025-10-31',
    requestStartDate: '2025-05-01',
    requestEndDate: '2025-10-31',
    expectedClosureDate: '2026-08-29',
    roleRequired: 'Developer',
    requiredSkills: ['PostgreSQL', 'Python', 'Docker'],
    minProficiency: 4,
    allocationPercentage: 75,
    priority: 'High',
    budgetSensitivity: 'Medium',
    clientCriticality: 'High',
    notes: 'Database migration specialist needed',
    status: 'Open',
    requestStatus: 'Pending',
    sourceType: 'Project',
    requestedBy: 'Peter Korres',
    workLocation: 'Remote',
    commercialType: 'T&M',
    allocationExecutive: 'Rachel Green',
    allocationCoordinator: 'Tom Wilson',
    region: 'APAC',
    legalEntity: 'AsiaTech Pte Ltd.',
    division: 'Infrastructure',
    subDivision: 'Database Services',
    operationModel: 'Project Based',
    createdAt: '2025-02-20',
  },
  {
    id: '005',
    projectName: 'Global LV-SDMS Coaching-Berlin, Weimar',
    clientName: 'Global Logistics Corp',
    customer: 'Global Logistics Corp',
    startDate: '2025-06-01',
    endDate: '2026-01-31',
    requestStartDate: '2025-06-01',
    requestEndDate: '2026-01-31',
    expectedClosureDate: '2026-07-25',
    roleRequired: 'PM',
    requiredSkills: ['Agile', 'Scrum', 'JIRA'],
    minProficiency: 4,
    allocationPercentage: 100,
    priority: 'High',
    budgetSensitivity: 'Low',
    clientCriticality: 'Critical',
    notes: 'Large-scale coaching program',
    status: 'Open',
    requestStatus: 'Allocated',
    sourceType: 'Opportunity',
    requestedBy: 'Peter Korres',
    acceptedBy: 'James Wilson',
    workLocation: 'On-site',
    commercialType: 'Fixed',
    allocationExecutive: 'Anna Schmidt',
    allocationCoordinator: 'Klaus Mueller',
    region: 'Europe',
    legalEntity: 'EuroTech Ltd.',
    division: 'Professional Services',
    subDivision: 'Coaching',
    operationModel: 'Dedicated Team',
    createdAt: '2025-02-22',
  },
  {
    id: '006',
    projectName: 'SAYSSOW0033 - RDDO 4: Benchling - ELN Customization',
    clientName: 'RDDO Solutions',
    customer: 'RDDO Solutions',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    requestStartDate: '2025-07-01',
    requestEndDate: '2025-12-31',
    expectedClosureDate: '2025-10-31',
    roleRequired: 'Developer',
    requiredSkills: ['TypeScript', 'React', 'APIs'],
    minProficiency: 3,
    allocationPercentage: 50,
    priority: 'Medium',
    budgetSensitivity: 'Medium',
    clientCriticality: 'Medium',
    notes: 'Scientific software customization',
    status: 'Open',
    requestStatus: 'Pending',
    sourceType: 'Project',
    requestedBy: 'Tim Stoltmann',
    workLocation: 'Remote',
    commercialType: 'T&M',
    allocationExecutive: 'Sophie Laurent',
    allocationCoordinator: 'Marc Dubois',
    region: 'Europe',
    legalEntity: 'EuroTech Ltd.',
    division: 'Custom Solutions',
    subDivision: 'Labs',
    operationModel: 'Dedicated Team',
    createdAt: '2025-02-25',
  },
];

export const generateAIExplanations = (
  resource: Resource,
  demand: DemandRequest
): { explanations: string[]; riskFlags: string[]; softBookings: Array<{ projectName: string; allocationPercentage: number; bookingType: string }> } => {
  const explanations: string[] = [];
  const riskFlags: string[] = [];

  const matchingSkills = resource.skills.filter(s =>
    demand.requiredSkills.includes(s.name)
  );

  if (matchingSkills.length > 0) {
    const highRatedSkills = matchingSkills.filter(s => s.rating >= 4);
    if (highRatedSkills.length > 0) {
      explanations.push(
        `Strong proficiency in ${highRatedSkills.map(s => s.name).join(', ')} (rated ${highRatedSkills[0].rating}/5)`
      );
    }
  }

  if (resource.availability >= demand.allocationPercentage) {
    explanations.push(
      `Full availability (${resource.availability}%) matches the ${demand.allocationPercentage}% allocation requirement`
    );
  } else if (resource.availability > 0) {
    riskFlags.push(
      `Limited availability (${resource.availability}%) - may require schedule adjustment`
    );
  }

  if (resource.pastPerformance >= 4.5) {
    explanations.push(
      `Excellent track record with ${resource.pastPerformance}/5 performance rating`
    );
  }

  if (resource.experience >= 5) {
    explanations.push(
      `${resource.experience} years of experience provides project stability`
    );
  } else if (resource.experience < 3) {
    riskFlags.push(
      `Junior resource (${resource.experience} years) - may need senior oversight`
    );
  }

  if (resource.role === demand.roleRequired) {
    explanations.push(`Role alignment: ${resource.role} matches demand requirement`);
  }

  resource.riskIndicators.forEach(risk => {
    riskFlags.push(risk);
  });

  const softBookings = resource.currentAllocations
    .filter(alloc => alloc.bookingType === 'soft-booked')
    .map(alloc => ({
      projectName: alloc.projectName,
      allocationPercentage: alloc.percentage,
      bookingType: alloc.bookingType || 'soft-booked'
    }));

  if (softBookings.length > 0) {
    riskFlags.push(
      `Resource has been soft booked in ${softBookings.length} opportunit${softBookings.length > 1 ? 'ies' : 'y'}`
    );
  }

  return { explanations, riskFlags, softBookings };
};

export const calculateSkillMatch = (resource: Resource, requiredSkills: string[], minProficiency: number): number => {
  if (requiredSkills.length === 0) return 0;

  let totalScore = 0;
  let maxPossible = requiredSkills.length * 5;

  requiredSkills.forEach(skill => {
    const resourceSkill = resource.skills.find(s => s.name === skill);
    if (resourceSkill && resourceSkill.rating >= minProficiency) {
      totalScore += resourceSkill.rating;
    } else if (resourceSkill) {
      totalScore += resourceSkill.rating * 0.5;
    }
  });

  return Math.round((totalScore / maxPossible) * 100);
};

export const calculateOverallScore = (
  skillMatch: number,
  availability: number,
  performance: number,
  priority: string
): number => {
  const priorityWeight = priority === 'Critical' ? 1.2 : priority === 'High' ? 1.1 : 1;
  const baseScore = (skillMatch * 0.4) + (availability * 0.3) + (performance * 20 * 0.3);
  return Math.min(100, Math.round(baseScore * priorityWeight));
};

export const getConfidenceLevel = (score: number): 'High' | 'Medium' | 'Low' => {
  if (score >= 80) return 'High';
  if (score >= 60) return 'Medium';
  return 'Low';
};

export const generateMonthlyAvailability = (resource: Resource, demand: DemandRequest): Array<{ month: string; year: number; availabilityPercentage: number; allocations?: Array<{ projectCode: string; projectName: string; percentage: number }> }> => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const demandStart = new Date(demand.startDate);
  const demandEnd = new Date(demand.endDate);

  const monthlyData: Array<{ month: string; year: number; availabilityPercentage: number; allocations?: Array<{ projectCode: string; projectName: string; percentage: number }> }> = [];

  for (let d = new Date(demandStart); d <= demandEnd; d.setMonth(d.getMonth() + 1)) {
    const currentMonth = d.getMonth();
    const currentYear = d.getFullYear();
    const monthName = months[currentMonth];

    let allocated = 0;
    const allocationsForMonth: Array<{ projectCode: string; projectName: string; percentage: number }> = [];

    resource.currentAllocations.forEach(alloc => {
      const allocStart = new Date(alloc.startDate);
      const allocEnd = new Date(alloc.endDate);

      if (allocStart <= d && allocEnd >= d) {
        allocated += alloc.percentage;
        allocationsForMonth.push({
          projectCode: alloc.projectCode || 'N/A',
          projectName: alloc.projectName,
          percentage: alloc.percentage
        });
      }
    });

    const available = Math.max(0, 100 - allocated);
    monthlyData.push({
      month: monthName,
      year: currentYear,
      availabilityPercentage: available,
      allocations: allocationsForMonth.length > 0 ? allocationsForMonth : undefined,
    });
  }

  return monthlyData;
};

export const generateRequestId = (existingDemands: DemandRequest[]): string => {
  if (existingDemands.length === 0) return '001';
  const lastId = Math.max(...existingDemands.map(d => parseInt(d.id, 10)));
  return String(lastId + 1).padStart(3, '0');
};
