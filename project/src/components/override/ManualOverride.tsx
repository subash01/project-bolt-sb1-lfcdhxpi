import { useState, useMemo } from 'react';
import { ArrowLeft, Sparkles, Filter, AlertTriangle, CheckCircle, User, ArrowRight, X, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockResources, calculateSkillMatch } from '../../data/mockData';
import type { DemandRequest, Resource, Role } from '../../types';

interface ManualOverrideProps {
  demand: DemandRequest | null;
  aiRecommendedId?: string;
  onBack: () => void;
  onSelect: (resource: Resource) => void;
  onViewProfile: (resource: Resource) => void;
}

const ITEMS_PER_PAGE = 30;

function calculateBenchDate(resource: Resource): string | null {
  if (resource.availability === 100) return 'Available Now';

  const allocations = resource.currentAllocations.filter(a => a.bookingType !== 'soft-booked');
  if (allocations.length === 0) return 'Available Now';

  const latestEndDate = allocations.reduce((latest, alloc) => {
    const allocEnd = new Date(alloc.endDate);
    return allocEnd > latest ? allocEnd : latest;
  }, new Date(allocations[0].endDate));

  const today = new Date();
  if (latestEndDate <= today) return 'Available Now';

  return latestEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getMonthlyAllocation(resource: Resource): Array<{ month: string; percentage: number; color: string }> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const monthlyData: Array<{ month: string; percentage: number; color: string }> = [];

  // Use resource ID as seed for consistent random values
  const seed = parseInt(resource.id.replace(/\D/g, ''), 10);

  for (let i = 0; i < 6; i++) {
    const targetDate = new Date(today.getFullYear(), today.getMonth() + i, 15);
    const monthName = months[targetDate.getMonth()];

    // Generate deterministic random availability based on resource ID and month
    const randomSeed = (seed * 9301 + i * 49297) % 233280;
    const randomValue = randomSeed / 233280;
    const available = Math.floor(randomValue * 101); // 0-100

    let color = '#10B981';
    if (available < 25) color = '#EF4444';
    else if (available < 50) color = '#F59E0B';
    else if (available < 75) color = '#3B82F6';

    monthlyData.push({
      month: monthName,
      percentage: available,
      color
    });
  }

  return monthlyData;
}

export default function ManualOverride({
  demand,
  aiRecommendedId,
  onBack,
  onSelect,
  onViewProfile,
}: ManualOverrideProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'partial'>('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isAISearching, setIsAISearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredResources = useMemo(() => {
    if (!searchQuery) {
      return mockResources.filter(resource => {
        const matchesRole = roleFilter === 'All' || resource.role === roleFilter;
        const matchesAvailability = availabilityFilter === 'all' ||
          (availabilityFilter === 'available' && resource.availability >= 75) ||
          (availabilityFilter === 'partial' && resource.availability >= 25 && resource.availability < 75);
        return matchesRole && matchesAvailability;
      });
    }

    setIsAISearching(true);
    const query = searchQuery.toLowerCase();

    // Parse natural language query for conditions
    const parseQuery = (q: string) => {
      const conditions: {
        skills: string[];
        availability?: { operator: string; value: number };
        role?: string;
        experience?: { operator: string; value: number };
        cost?: { operator: string; value: number };
        hourlyRate?: { operator: string; value: number };
        benchDate?: { operator: string; value: string };
        keywords: string[];
      } = {
        skills: [],
        keywords: []
      };

      // Extract availability conditions with all operators
      const availabilityPatterns = [
        /availability\s*(?:is\s*)?(?:>=|greater than or equal to|greater or equal)\s*(\d+)/i,
        /availability\s*(?:is\s*)?(?:<=|less than or equal to|less or equal)\s*(\d+)/i,
        /availability\s*(?:is\s*)?(?:>|greater than|more than|above)\s*(\d+)/i,
        /availability\s*(?:is\s*)?(?:<|less than|below)\s*(\d+)/i,
        /availability\s*(?:is\s*)?(?:=|equals?|is)\s*(\d+)/i,
        /available\s*(?:>=|greater than or equal to|greater or equal)\s*(\d+)/i,
        /available\s*(?:<=|less than or equal to|less or equal)\s*(\d+)/i,
        /available\s*(?:>|greater than|more than|above)\s*(\d+)/i,
        /available\s*(?:<|less than|below)\s*(\d+)/i,
      ];

      availabilityPatterns.forEach((pattern, idx) => {
        const match = q.match(pattern);
        if (match) {
          const value = parseInt(match[1], 10);
          if (idx === 0 || idx === 5) conditions.availability = { operator: '>=', value };
          else if (idx === 1 || idx === 6) conditions.availability = { operator: '<=', value };
          else if (idx === 2 || idx === 7) conditions.availability = { operator: '>', value };
          else if (idx === 3 || idx === 8) conditions.availability = { operator: '<', value };
          else conditions.availability = { operator: '=', value };
        }
      });

      // Extract role conditions
      const rolePatterns = [
        /role\s*(?:is|=)\s*(developer|architect|qa|pm)/i,
        /\b(developer|architect|qa|pm)\b/i,
      ];

      rolePatterns.forEach(pattern => {
        const match = q.match(pattern);
        if (match) {
          const role = match[1].toLowerCase();
          if (role === 'developer') conditions.role = 'Developer';
          else if (role === 'architect') conditions.role = 'Architect';
          else if (role === 'qa') conditions.role = 'QA';
          else if (role === 'pm') conditions.role = 'PM';
        }
      });

      // Extract experience conditions with all operators
      const experiencePatterns = [
        /experience\s*(?:>=|greater than or equal to|greater or equal)\s*(\d+)/i,
        /experience\s*(?:<=|less than or equal to|less or equal)\s*(\d+)/i,
        /experience\s*(?:>|greater than|more than|above)\s*(\d+)/i,
        /experience\s*(?:<|less than|below)\s*(\d+)/i,
        /experience\s*(?:=|equals?|is)\s*(\d+)/i,
        /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
      ];

      experiencePatterns.forEach((pattern, idx) => {
        const match = q.match(pattern);
        if (match) {
          const value = parseInt(match[1], 10);
          if (idx === 0) conditions.experience = { operator: '>=', value };
          else if (idx === 1) conditions.experience = { operator: '<=', value };
          else if (idx === 2) conditions.experience = { operator: '>', value };
          else if (idx === 3) conditions.experience = { operator: '<', value };
          else if (idx === 4) conditions.experience = { operator: '=', value };
          else conditions.experience = { operator: '>=', value };
        }
      });

      // Extract cost conditions with all operators
      const costPatterns = [
        /cost\s*(?:>=|greater than or equal to|greater or equal)\s*\$?(\d+)/i,
        /cost\s*(?:<=|less than or equal to|less or equal)\s*\$?(\d+)/i,
        /cost\s*(?:>|greater than|more than|above)\s*\$?(\d+)/i,
        /cost\s*(?:<|less than|below)\s*\$?(\d+)/i,
        /cost\s*(?:=|equals?|is)\s*\$?(\d+)/i,
      ];

      costPatterns.forEach((pattern, idx) => {
        const match = q.match(pattern);
        if (match) {
          const value = parseInt(match[1], 10);
          if (idx === 0) conditions.cost = { operator: '>=', value };
          else if (idx === 1) conditions.cost = { operator: '<=', value };
          else if (idx === 2) conditions.cost = { operator: '>', value };
          else if (idx === 3) conditions.cost = { operator: '<', value };
          else conditions.cost = { operator: '=', value };
        }
      });

      // Extract hourly rate conditions with all operators
      const hourlyRatePatterns = [
        /(?:hourly\s*rate|hourly)\s*(?:>=|greater than or equal to|greater or equal)\s*\$?(\d+)/i,
        /(?:hourly\s*rate|hourly)\s*(?:<=|less than or equal to|less or equal)\s*\$?(\d+)/i,
        /(?:hourly\s*rate|hourly)\s*(?:>|greater than|more than|above)\s*\$?(\d+)/i,
        /(?:hourly\s*rate|hourly)\s*(?:<|less than|below)\s*\$?(\d+)/i,
        /(?:hourly\s*rate|hourly)\s*(?:=|equals?|is)\s*\$?(\d+)/i,
      ];

      hourlyRatePatterns.forEach((pattern, idx) => {
        const match = q.match(pattern);
        if (match) {
          const value = parseInt(match[1], 10);
          if (idx === 0) conditions.hourlyRate = { operator: '>=', value };
          else if (idx === 1) conditions.hourlyRate = { operator: '<=', value };
          else if (idx === 2) conditions.hourlyRate = { operator: '>', value };
          else if (idx === 3) conditions.hourlyRate = { operator: '<', value };
          else conditions.hourlyRate = { operator: '=', value };
        }
      });

      // Extract bench date conditions
      const benchDatePatterns = [
        /bench\s*date\s*(?:before|<)\s*(\d{4}-\d{2}-\d{2})/i,
        /bench\s*date\s*(?:after|>)\s*(\d{4}-\d{2}-\d{2})/i,
        /bench\s*date\s*(?:=|is)\s*(\d{4}-\d{2}-\d{2})/i,
        /benched\s*(?:before|<)\s*(\d{4}-\d{2}-\d{2})/i,
        /benched\s*(?:after|>)\s*(\d{4}-\d{2}-\d{2})/i,
        /benched/i,
      ];

      benchDatePatterns.forEach((pattern, idx) => {
        const match = q.match(pattern);
        if (match) {
          if (idx === 0 || idx === 3) {
            conditions.benchDate = { operator: '<', value: match[1] };
          } else if (idx === 1 || idx === 4) {
            conditions.benchDate = { operator: '>', value: match[1] };
          } else if (idx === 2) {
            conditions.benchDate = { operator: '=', value: match[1] };
          } else if (idx === 5) {
            conditions.benchDate = { operator: 'exists', value: '' };
          }
        }
      });

      // Extract skills (check against known skills and common tech terms)
      const allSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'Java', 'FastAPI',
        'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'GraphQL',
        'REST API', 'Agile', 'Scrum', 'JIRA', 'Git', 'CI/CD',
        'Selenium', 'Jest', 'Cypress', 'System Design', 'Microservices'];

      allSkills.forEach(skill => {
        if (q.includes(skill.toLowerCase())) {
          conditions.skills.push(skill);
        }
      });

      // General keywords
      if (q.includes('senior')) conditions.keywords.push('senior');
      if (q.includes('junior')) conditions.keywords.push('junior');
      if (q.includes('cheap') || q.includes('budget')) conditions.keywords.push('cheap');
      if (q.includes('expensive')) conditions.keywords.push('expensive');
      if (q.includes('available') || q.includes('free')) conditions.keywords.push('available');

      return conditions;
    };

    const conditions = parseQuery(query);

    const scoredResources = mockResources.map(resource => {
      let score = 0;
      let meetsAllConditions = true;

      // Check availability condition
      if (conditions.availability) {
        const { operator, value } = conditions.availability;
        if (operator === '>' && resource.availability <= value) meetsAllConditions = false;
        else if (operator === '<' && resource.availability >= value) meetsAllConditions = false;
        else if (operator === '>=' && resource.availability < value) meetsAllConditions = false;
        else if (operator === '<=' && resource.availability > value) meetsAllConditions = false;
        else if (operator === '=' && resource.availability !== value) meetsAllConditions = false;
        else score += 100;
      }

      // Check role condition
      if (conditions.role) {
        if (resource.role !== conditions.role) meetsAllConditions = false;
        else score += 100;
      }

      // Check experience condition
      if (conditions.experience) {
        const { operator, value } = conditions.experience;
        if (operator === '>' && resource.experience <= value) meetsAllConditions = false;
        else if (operator === '<' && resource.experience >= value) meetsAllConditions = false;
        else if (operator === '>=' && resource.experience < value) meetsAllConditions = false;
        else if (operator === '<=' && resource.experience > value) meetsAllConditions = false;
        else if (operator === '=' && resource.experience !== value) meetsAllConditions = false;
        else score += 80;
      }

      // Check cost condition
      if (conditions.cost) {
        const { operator, value } = conditions.cost;
        if (operator === '>' && resource.cost <= value) meetsAllConditions = false;
        else if (operator === '<' && resource.cost >= value) meetsAllConditions = false;
        else if (operator === '>=' && resource.cost < value) meetsAllConditions = false;
        else if (operator === '<=' && resource.cost > value) meetsAllConditions = false;
        else if (operator === '=' && resource.cost !== value) meetsAllConditions = false;
        else score += 70;
      }

      // Check hourly rate condition
      if (conditions.hourlyRate) {
        const { operator, value } = conditions.hourlyRate;
        if (operator === '>' && resource.hourlyRate <= value) meetsAllConditions = false;
        else if (operator === '<' && resource.hourlyRate >= value) meetsAllConditions = false;
        else if (operator === '>=' && resource.hourlyRate < value) meetsAllConditions = false;
        else if (operator === '<=' && resource.hourlyRate > value) meetsAllConditions = false;
        else if (operator === '=' && resource.hourlyRate !== value) meetsAllConditions = false;
        else score += 90;
      }

      // Check bench date condition
      if (conditions.benchDate) {
        const { operator, value } = conditions.benchDate;
        if (operator === 'exists') {
          if (!resource.benchDate) meetsAllConditions = false;
          else score += 100;
        } else if (resource.benchDate) {
          const resourceDate = new Date(resource.benchDate);
          const compareDate = new Date(value);
          if (operator === '<' && resourceDate >= compareDate) meetsAllConditions = false;
          else if (operator === '>' && resourceDate <= compareDate) meetsAllConditions = false;
          else if (operator === '=' && resourceDate.getTime() !== compareDate.getTime()) meetsAllConditions = false;
          else score += 100;
        } else {
          meetsAllConditions = false;
        }
      }

      // Check skills
      if (conditions.skills.length > 0) {
        const matchingSkills = conditions.skills.filter(skill =>
          resource.skills.some(s => s.name === skill)
        );
        if (matchingSkills.length === 0) meetsAllConditions = false;
        else score += 90 * matchingSkills.length;
      }

      // Apply keyword bonuses
      conditions.keywords.forEach(keyword => {
        if (keyword === 'senior' && resource.experience >= 8) score += 50;
        if (keyword === 'junior' && resource.experience < 3) score += 50;
        if (keyword === 'cheap' && resource.cost < 100) score += 40;
        if (keyword === 'expensive' && resource.cost > 200) score += 40;
        if (keyword === 'available' && resource.availability >= 75) score += 60;
      });

      // Fallback to simple search if no conditions matched
      if (score === 0) {
        const nameMatch = resource.name.toLowerCase().includes(query);
        if (nameMatch) score += 100;

        const roleMatch = resource.role.toLowerCase().includes(query);
        if (roleMatch) score += 80;

        const skillMatches = resource.skills.filter(s =>
          s.name.toLowerCase().includes(query)
        );
        if (skillMatches.length > 0) {
          score += 60 * skillMatches.length;
        }
      }

      const matchesRole = roleFilter === 'All' || resource.role === roleFilter;
      const matchesAvailability = availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && resource.availability >= 75) ||
        (availabilityFilter === 'partial' && resource.availability >= 25 && resource.availability < 75);

      if (!matchesRole || !matchesAvailability || !meetsAllConditions) return null;

      return { resource, score };
    }).filter(item => item !== null && item.score > 0);

    scoredResources.sort((a, b) => b!.score - a!.score);

    setTimeout(() => setIsAISearching(false), 300);

    return scoredResources.map(item => item!.resource);
  }, [searchQuery, roleFilter, availabilityFilter]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, availabilityFilter]);

  const getWarnings = (resource: Resource): string[] => {
    const warnings: string[] = [];

    if (demand) {
      if (resource.role !== demand.roleRequired) {
        warnings.push(`Role mismatch: ${resource.role} (required: ${demand.roleRequired})`);
      }

      if (resource.availability < demand.allocationPercentage) {
        warnings.push(`Insufficient availability: ${resource.availability}% (required: ${demand.allocationPercentage}%)`);
      }

      const skillMatch = calculateSkillMatch(resource, demand.requiredSkills, demand.minProficiency);
      if (skillMatch < 50) {
        warnings.push(`Low skill match: ${skillMatch}%`);
      }
    }

    return warnings;
  };

  const handleSelectResource = (resource: Resource) => {
    setSelectedResource(resource);
    const warnings = getWarnings(resource);
    if (warnings.length > 0) {
      setShowConfirmation(true);
    } else {
      onSelect(resource);
    }
  };

  const confirmSelection = () => {
    if (selectedResource) {
      onSelect(selectedResource);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-secondary-gray hover:text-primary-dark mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to AI Results
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Manual Resource Selection</h1>
          <p className="text-secondary-gray mt-1">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredResources.length)} of {filteredResources.length.toLocaleString()} employees
          </p>
        </div>
      </div>

      {demand && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-600 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="font-medium text-amber-800">Manual Override Mode</p>
              <p className="text-sm text-amber-700 mt-1">
                Selecting a resource manually will override AI recommendations. Constraints violations will be flagged but allowed.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Sparkles size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isAISearching ? 'text-primary animate-pulse' : 'text-secondary-gray'}`} />
              <input
                type="text"
                placeholder="AI Search: React and availability >= 50 and role is architect and hourly rate < 100"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              {searchQuery && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-xs text-secondary-gray">
                    {filteredResources.length} found
                  </span>
                </div>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-secondary-gray mt-1.5 ml-1">
                Try: "React and availability &gt;= 50", "hourly rate &lt;= 100 and benched", "architect and experience &gt; 5"
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-secondary-gray" />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as Role | 'All')}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
            >
              <option value="All">All Roles</option>
              <option value="Developer">Developer</option>
              <option value="QA">QA Engineer</option>
              <option value="PM">Project Manager</option>
              <option value="Architect">Architect</option>
            </select>

            <select
              value={availabilityFilter}
              onChange={e => setAvailabilityFilter(e.target.value as 'all' | 'available' | 'partial')}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
            >
              <option value="all">All Availability</option>
              <option value="available">Fully Available (75%+)</option>
              <option value="partial">Partial (25-75%)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedResources.map(resource => {
          const warnings = getWarnings(resource);
          const isAIRecommended = resource.id === aiRecommendedId;
          const skillMatch = demand ? calculateSkillMatch(resource, demand.requiredSkills, demand.minProficiency) : 0;
          const benchDate = calculateBenchDate(resource);
          const monthlyAllocation = getMonthlyAllocation(resource);

          return (
            <div
              key={resource.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md ${
                isAIRecommended ? 'ring-2 ring-emerald-500' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <img
                      src={resource.avatar}
                      alt={resource.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-primary-dark truncate">{resource.name}</h3>
                        {isAIRecommended && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                            AI Pick
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary-gray">{resource.role}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-secondary-gray">Bench Date</p>
                    <p className={`text-xs font-medium mt-0.5 ${benchDate === 'Available Now' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {benchDate}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-secondary-gray">Availability</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            resource.availability >= 75 ? 'bg-emerald-500' : resource.availability >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${resource.availability}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{resource.availability}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-gray">Hourly Rate</p>
                    <div className="flex items-center gap-1 mt-1">
                      <DollarSign size={12} className="text-emerald-600" />
                      <span className="text-xs font-medium">{resource.cost}/hr</span>
                    </div>
                  </div>
                </div>

                {demand && (
                  <div className="mt-3">
                    <p className="text-xs text-secondary-gray">Skill Match</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            skillMatch >= 70 ? 'bg-emerald-500' : skillMatch >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${skillMatch}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{skillMatch}%</span>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-1">
                  {resource.skills.slice(0, 4).map(skill => (
                    <span
                      key={skill.name}
                      className={`px-2 py-0.5 rounded text-xs ${
                        demand?.requiredSkills.includes(skill.name)
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-secondary-gray'
                      }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                  {resource.skills.length > 4 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-secondary-gray rounded text-xs">
                      +{resource.skills.length - 4}
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-xs text-secondary-gray mb-2">Next 6 Months Availability</p>
                  <div className="flex rounded-lg overflow-hidden h-12 shadow-sm">
                    {monthlyAllocation.map((month, idx) => (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center justify-center text-white font-semibold text-sm transition-all hover:brightness-110 relative group"
                        style={{ backgroundColor: month.color }}
                      >
                        <span className="text-xs font-bold drop-shadow-sm">{month.percentage}%</span>
                        <span className="text-[10px] opacity-90 drop-shadow-sm">{month.month}</span>

                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {month.month}: {month.percentage}% available
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {warnings.length > 0 && (
                  <div className="mt-3 p-2 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-1 text-amber-700 text-xs">
                      <AlertTriangle size={12} />
                      <span>{warnings.length} constraint warning{warnings.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                <button
                  onClick={() => onViewProfile(resource)}
                  className="inline-flex items-center gap-1 text-sm text-secondary-gray hover:text-primary-dark transition-colors"
                >
                  <User size={14} />
                  Profile
                </button>
                <button
                  onClick={() => handleSelectResource(resource)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Select
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={24} className="text-secondary-gray" />
          </div>
          <h3 className="text-lg font-semibold text-primary-dark mb-2">No Resources Found</h3>
          <p className="text-secondary-gray mb-3">
            Try adjusting your search or filter criteria
          </p>
          <div className="text-xs text-secondary-gray space-y-1">
            <p className="font-medium mb-2">AI Search Examples:</p>
            <p>"React and availability &gt;= 50"</p>
            <p>"TypeScript and role is architect and hourly rate &lt; 100"</p>
            <p>"developer and experience &gt; 5 and cost &lt;= 150"</p>
            <p>"Python and availability = 100 and benched"</p>
            <p>"architect and hourly rate &gt;= 120"</p>
          </div>
        </div>
      )}

      {filteredResources.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
          <div className="text-sm text-secondary-gray">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-secondary-gray hover:bg-gray-100 hover:text-primary-dark'
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-primary text-white'
                      : 'text-secondary-gray hover:bg-gray-100 hover:text-primary-dark'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-secondary-gray hover:bg-gray-100 hover:text-primary-dark'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="text-sm text-secondary-gray">
            {startIndex + 1}-{Math.min(endIndex, filteredResources.length)} of {filteredResources.length.toLocaleString()}
          </div>
        </div>
      )}

      {showConfirmation && selectedResource && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setShowConfirmation(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-50 fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary-dark">Confirm Selection</h3>
              <button
                onClick={() => setShowConfirmation(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-secondary-gray" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
              <img
                src={selectedResource.avatar}
                alt={selectedResource.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-primary-dark">{selectedResource.name}</p>
                <p className="text-sm text-secondary-gray">{selectedResource.role}</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-amber-700 mb-2">
                <AlertTriangle size={16} />
                <span className="font-medium text-sm">Constraint Warnings</span>
              </div>
              <ul className="space-y-2">
                {getWarnings(selectedResource).map((warning, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-amber-800">
                    <AlertTriangle size={12} className="mt-1 flex-shrink-0" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-secondary-gray mb-4">
              Are you sure you want to proceed with this selection despite the warnings?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-secondary-gray hover:text-primary-dark transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmSelection}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <CheckCircle size={16} />
                Confirm Selection
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
