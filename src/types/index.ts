export type Role = 'Developer' | 'QA' | 'PM' | 'Architect';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Sensitivity = 'Low' | 'Medium' | 'High';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type AllocationPercentage = 25 | 50 | 75 | 100;

export interface Skill {
  name: string;
  rating: number;
}

export interface Resource {
  id: string;
  name: string;
  role: Role;
  email: string;
  experience: number;
  skills: Skill[];
  availability: number;
  currentAllocations: Allocation[];
  pastPerformance: number;
  riskIndicators: string[];
  avatar: string;
  cost: number;
  hourlyRate: number;
  benchDate: string | null;
  employeeCtc: number;
  positionCtc: number;
}

export interface Allocation {
  projectName: string;
  projectCode?: string;
  percentage: number;
  startDate: string;
  endDate: string;
  color: string;
  bookingType?: 'hard-booked' | 'soft-booked';
}

export interface MonthlyAvailability {
  month: string;
  year: number;
  availabilityPercentage: number;
  allocations?: Array<{
    projectCode: string;
    projectName: string;
    percentage: number;
  }>;
}

export type RequestStatus = 'Pending' | 'In Progress' | 'On Hold' | 'Cancelled' | 'Allocated' | 'Assigned';
export type SourceType = 'Project' | 'Opportunity';

export interface DemandRequest {
  id: string;
  projectName: string;
  clientName: string;
  customer: string;
  startDate: string;
  endDate: string;
  requestStartDate: string;
  requestEndDate: string;
  expectedClosureDate: string;
  roleRequired: Role;
  requiredSkills: string[];
  minProficiency: number;
  allocationPercentage: AllocationPercentage;
  priority: Priority;
  budgetSensitivity: Sensitivity;
  clientCriticality: Sensitivity;
  notes: string;
  status: 'Open' | 'In Progress' | 'Fulfilled' | 'Cancelled';
  requestStatus: RequestStatus;
  sourceType: SourceType;
  requestedBy: string;
  acceptedBy?: string;
  workLocation: string;
  commercialType: string;
  allocationExecutive: string;
  allocationCoordinator: string;
  region: string;
  legalEntity: string;
  division: string;
  subDivision: string;
  operationModel: string;
  createdAt: string;
}

export interface AIRecommendation {
  resource: Resource;
  skillMatchScore: number;
  availabilityFit: number;
  overallScore: number;
  confidence: ConfidenceLevel;
  explanations: string[];
  riskFlags: string[];
  monthlyAvailability?: MonthlyAvailability[];
  softBookings?: Array<{
    projectName: string;
    allocationPercentage: number;
    bookingType: 'soft-booked' | 'hard-booked';
  }>;
}

export type Page = 'dashboard' | 'ai-results' | 'manual-override' | 'resources' | 'demand-details' | 'demand-detail' | 'settings';

export interface AppState {
  currentPage: Page;
  demandRequests: DemandRequest[];
  currentDemand: DemandRequest | null;
  selectedResource: Resource | null;
  recommendations: AIRecommendation[];
}

export interface OpportunityBookingSetting {
  id: string;
  setting_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface BookingStatusRule {
  id: string;
  setting_id: string;
  opportunity_status: 'Open' | 'In Progress' | 'Closed-Won' | 'Closed-Lost';
  booking_action: 'create_soft' | 'convert_to_confirmed' | 'cancel';
  booking_type: 'soft-booked' | 'hard-booked' | 'cancelled';
  is_enabled: boolean;
  sort_order: number;
  created_at: string;
}

export interface ProbabilityThreshold {
  id: string;
  setting_id: string;
  min_probability: number;
  max_probability: number;
  auto_create_booking: boolean;
  booking_type: 'soft-booked' | 'hard-booked';
  is_enabled: boolean;
  created_at: string;
}
