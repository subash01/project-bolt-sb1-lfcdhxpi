import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Calendar, Sparkles, Plus, Copy, Filter, ChevronDown, Users } from 'lucide-react';
import { mockResources, mockDemandRequests } from '../../data/mockData';
import type { Resource, DemandRequest } from '../../types';

interface ResourceGanttViewProps {
  onViewAIMatches: (resource: Resource) => void;
}

type ViewMode = 'D' | 'W' | 'M';
type TabMode = 'members' | 'projects';
type FilterTab = 'All' | 'Soft Booking' | 'Hard Booking';

interface TimeColumn {
  start: Date;
  end: Date;
  label: string;
  subLabel?: string;
}

const getDayColumns = (startDate: Date, days: number): TimeColumn[] => {
  const result: TimeColumn[] = [];
  const current = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const day = new Date(current);
    const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = day.getDate();
    const month = day.toLocaleDateString('en-US', { month: 'short' });

    result.push({
      start: new Date(day),
      end: new Date(day.setHours(23, 59, 59, 999)),
      label: `${dayName} ${dayNum}`,
      subLabel: month,
    });
    current.setDate(current.getDate() + 1);
  }

  return result;
};

const getWeekColumns = (startDate: Date, weeks: number): TimeColumn[] => {
  const result: TimeColumn[] = [];
  const current = new Date(startDate);
  current.setDate(current.getDate() - current.getDay());

  for (let i = 0; i < weeks; i++) {
    const weekStart = new Date(current);
    const weekEnd = new Date(current);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();

    const label = startMonth === endMonth
      ? `${startMonth} ${startDay} - ${endDay}`
      : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;

    result.push({ start: new Date(weekStart), end: new Date(weekEnd), label });
    current.setDate(current.getDate() + 7);
  }

  return result;
};

const getMonthColumns = (startDate: Date, months: number): TimeColumn[] => {
  const result: TimeColumn[] = [];
  const current = new Date(startDate);
  current.setDate(1);

  for (let i = 0; i < months; i++) {
    const monthStart = new Date(current);
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

    const monthName = monthStart.toLocaleDateString('en-US', { month: 'short' });
    const year = monthStart.getFullYear();

    result.push({
      start: new Date(monthStart),
      end: new Date(monthEnd),
      label: monthName,
      subLabel: year.toString(),
    });
    current.setMonth(current.getMonth() + 1);
  }

  return result;
};

const calculateHoursForPeriod = (percentage: number, periodStart: Date, periodEnd: Date, viewMode: ViewMode): number => {
  const daysInPeriod = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const hoursPerDay = 8;

  if (viewMode === 'D') {
    return Math.round((percentage / 100) * hoursPerDay);
  } else if (viewMode === 'W') {
    return Math.round((percentage / 100) * 5 * hoursPerDay);
  } else {
    return Math.round((percentage / 100) * daysInPeriod * hoursPerDay);
  }
};

const formatHours = (hours: number): string => {
  if (hours >= 1) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`;
  }
  return `${Math.round(hours * 60)}m`;
};

const getAllocationForPeriod = (
  allocations: Resource['currentAllocations'],
  periodStart: Date,
  periodEnd: Date,
  viewMode: ViewMode
): { projects: { name: string; percentage: number; hours: number; color: string }[]; totalHours: number } => {
  const projects: { name: string; percentage: number; hours: number; color: string }[] = [];
  let totalHours = 0;

  allocations.forEach(alloc => {
    const allocStart = new Date(alloc.startDate);
    const allocEnd = new Date(alloc.endDate);

    if (allocStart <= periodEnd && allocEnd >= periodStart) {
      const hours = calculateHoursForPeriod(alloc.percentage, periodStart, periodEnd, viewMode);
      projects.push({
        name: alloc.projectName,
        percentage: alloc.percentage,
        hours,
        color: alloc.color
      });
      totalHours += hours;
    }
  });

  return { projects, totalHours };
};

export default function ResourceGanttView({ onViewAIMatches }: ResourceGanttViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('W');
  const [filterTab, setFilterTab] = useState<FilterTab>('All');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabMode>('members');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set());

  const columns = useMemo(() => {
    switch (viewMode) {
      case 'D':
        return getDayColumns(currentDate, 14);
      case 'W':
        return getWeekColumns(currentDate, 6);
      case 'M':
        return getMonthColumns(currentDate, 12);
      default:
        return getWeekColumns(currentDate, 6);
    }
  }, [currentDate, viewMode]);

  const filteredResources = useMemo(() => {
    return mockResources.filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.role.toLowerCase().includes(searchQuery.toLowerCase());

      if (filterTab === 'Hard Booking') {
        return matchesSearch && resource.currentAllocations.length > 0;
      }
      if (filterTab === 'Soft Booking') {
        return matchesSearch && resource.currentAllocations.length === 0;
      }
      return matchesSearch;
    });
  }, [searchQuery, filterTab]);

  const openDemands = useMemo(() => {
    return mockDemandRequests.filter(d => d.status === 'Open' || d.status === 'In Progress');
  }, []);

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'D':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'W':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'M':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 3 : -3));
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getColumnWidth = () => {
    switch (viewMode) {
      case 'D':
        return 'w-20';
      case 'W':
        return 'w-28';
      case 'M':
        return 'w-24';
      default:
        return 'w-28';
    }
  };

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  const toggleResource = (resourceId: string) => {
    setExpandedResources(prev => {
      const next = new Set(prev);
      if (next.has(resourceId)) {
        next.delete(resourceId);
      } else {
        next.add(resourceId);
      }
      return next;
    });
  };

  const getMatchingResources = (demand: DemandRequest): Resource[] => {
    return mockResources
      .filter(r => r.role === demand.roleRequired && r.availability > 0)
      .sort((a, b) => b.availability - a.availability)
      .slice(0, 5);
  };

  const renderGanttBar = (percentage: number, hours: number, color: string) => {
    const bgLight = `${color}30`;
    const bgDark = `${color}50`;

    return (
      <div
        className="relative px-1 py-0.5 rounded-sm text-[9px] font-semibold text-gray-700 overflow-hidden whitespace-nowrap"
        style={{
          background: `repeating-linear-gradient(135deg, ${bgLight}, ${bgLight} 3px, ${bgDark} 3px, ${bgDark} 6px)`,
          border: `1px solid ${color}80`,
        }}
      >
        <span className="relative z-10">{percentage}% ({formatHours(hours)})</span>
      </div>
    );
  };

  const renderEmptyCell = () => {
    return (
      <div
        className="h-5 rounded-sm"
        style={{
          background: 'repeating-linear-gradient(135deg, #e5e7eb, #e5e7eb 3px, #f3f4f6 3px, #f3f4f6 6px)',
        }}
      />
    );
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Resource Center</h1>
          <p className="text-secondary-gray mt-1">View and manage resource allocations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-gray" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors w-56"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('members')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'members'
                    ? 'text-primary border-primary'
                    : 'text-secondary-gray border-transparent hover:text-primary-dark'
                }`}
              >
                Team Members
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'projects'
                    ? 'text-primary border-primary'
                    : 'text-secondary-gray border-transparent hover:text-primary-dark'
                }`}
              >
                Projects
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-6 py-2 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-gray">Views</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                {(['All', 'Soft Booking', 'Hard Booking'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      filterTab === tab
                        ? 'bg-primary text-white'
                        : 'text-primary-dark hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-secondary-gray hover:text-primary-dark">
                <Filter size={14} />
                Filters
              </button>
              <span className="text-sm text-secondary-gray">
                {activeTab === 'members' ? `${filteredResources.length} Results` : `${openDemands.length} Projects`}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary-dark">{currentDate.getFullYear()}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate('prev')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <ChevronLeft size={16} className="text-secondary-gray" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <Calendar size={16} className="text-secondary-gray" />
                  </button>
                  <button
                    onClick={() => navigate('next')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <ChevronRight size={16} className="text-secondary-gray" />
                  </button>
                </div>
                <button
                  onClick={goToToday}
                  className="px-2 py-1 text-sm text-primary hover:bg-primary/10 rounded transition-colors"
                >
                  Today
                </button>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white ml-2">
                  {(['D', 'W', 'M'] as ViewMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1 text-sm font-medium transition-colors ${
                        viewMode === mode
                          ? 'bg-primary text-white'
                          : 'text-secondary-gray hover:bg-gray-50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'members' ? (
            <table className="w-full" style={{ minWidth: viewMode === 'M' ? '1400px' : viewMode === 'D' ? '1200px' : '1100px' }}>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="w-10 px-3 py-3 text-left sticky left-0 bg-gray-50 z-10"></th>
                  <th className="w-44 px-3 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider sticky left-10 bg-gray-50 z-10">
                    Team Member
                  </th>
                  <th className="w-32 px-3 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">
                    Role
                  </th>
                  <th className="w-12 px-3 py-3 text-center text-xs font-medium text-secondary-gray uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="w-20 px-2 py-3 text-center text-xs font-medium text-secondary-gray uppercase tracking-wider">
                    Actions
                  </th>
                  {columns.map((col, idx) => (
                    <th key={idx} className={`${getColumnWidth()} px-1 py-2 text-center text-xs font-medium text-secondary-gray border-l border-gray-200`}>
                      <div>{col.label}</div>
                      {col.subLabel && <div className="text-[10px] text-gray-400">{col.subLabel}</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredResources.map(resource => {
                  const isExpanded = expandedResources.has(resource.id);
                  const periodAllocations = columns.map(col =>
                    getAllocationForPeriod(resource.currentAllocations, col.start, col.end, viewMode)
                  );

                  return (
                    <>
                      <tr key={resource.id} className="hover:bg-gray-50/50 transition-colors border-t border-gray-100">
                        <td className="px-3 py-1.5 sticky left-0 bg-white" rowSpan={2}>
                          <button
                            onClick={() => toggleResource(resource.id)}
                            className={`text-secondary-gray hover:text-primary-dark transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          >
                            <ChevronRight size={14} />
                          </button>
                        </td>
                        <td className="px-3 py-1.5 sticky left-10 bg-white" rowSpan={2}>
                          <div className="flex items-center gap-2">
                            <img
                              src={resource.avatar}
                              alt={resource.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <span className="font-medium text-primary-dark text-sm truncate">
                              {resource.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-1.5 text-sm text-secondary-gray" rowSpan={2}>{resource.role}</td>
                        <td className="px-3 py-1.5 text-center" rowSpan={2}>
                          {resource.skills.length > 0 && (
                            <span className="text-sm text-secondary-gray">{resource.skills.length}</span>
                          )}
                        </td>
                        <td className="px-2 py-1.5" rowSpan={2}>
                          <div className="flex items-center justify-center gap-0.5">
                            <button
                              onClick={() => onViewAIMatches(resource)}
                              className="p-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                              title="View AI-matched demands"
                            >
                              <Sparkles size={12} />
                            </button>
                            <button className="p-1 rounded-full hover:bg-gray-100 text-secondary-gray transition-colors">
                              <Plus size={12} />
                            </button>
                            <button className="p-1 rounded-full hover:bg-gray-100 text-secondary-gray transition-colors">
                              <Copy size={12} />
                            </button>
                          </div>
                        </td>
                        {periodAllocations.map((alloc, idx) => (
                          <td key={idx} className={`${getColumnWidth()} px-0.5 py-0.5 border-l border-gray-200 align-middle`}>
                            {alloc.projects.length > 0 ? (
                              <div className="space-y-0.5">
                                {alloc.projects.map((project, pIdx) => (
                                  <div key={pIdx} title={project.name}>
                                    {renderGanttBar(project.percentage, project.hours, project.color)}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              renderEmptyCell()
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr key={`${resource.id}-hours`} className="bg-gray-50/30">
                        {periodAllocations.map((alloc, idx) => (
                          <td key={idx} className={`${getColumnWidth()} px-0.5 py-0.5 border-l border-gray-200 text-center`}>
                            <span className="text-[10px] text-secondary-gray font-medium">
                              {alloc.totalHours > 0 ? formatHours(alloc.totalHours) : ''}
                            </span>
                          </td>
                        ))}
                      </tr>
                      {isExpanded && (
                        <tr key={`${resource.id}-expanded`}>
                          <td colSpan={5 + columns.length} className="bg-blue-50/30 px-6 py-4">
                            <h4 className="text-sm font-semibold text-primary-dark mb-3">Current Project Allocations</h4>
                            {resource.currentAllocations.length > 0 ? (
                              <div className="grid grid-cols-1 gap-2">
                                {resource.currentAllocations.map((allocation, idx) => {
                                  const startDate = new Date(allocation.startDate);
                                  const endDate = new Date(allocation.endDate);
                                  const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                                  const totalHours = Math.round((allocation.percentage / 100) * durationDays * 8);

                                  return (
                                    <div
                                      key={idx}
                                      className="bg-white rounded-lg px-4 py-2 border-l-4 flex items-center justify-between hover:shadow-sm transition-all"
                                      style={{ borderLeftColor: allocation.color }}
                                    >
                                      <div className="flex items-center gap-4 flex-1">
                                        <div className="flex-1">
                                          <span className="font-medium text-primary-dark text-sm">{allocation.projectName}</span>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm">
                                          <div>
                                            <span className="text-secondary-gray">Allocation:</span>
                                            <span className="ml-2 font-bold text-primary">{allocation.percentage}%</span>
                                          </div>
                                          <div>
                                            <span className="text-secondary-gray">Total Hours:</span>
                                            <span className="ml-2 font-bold text-primary-dark">{formatHours(totalHours)}</span>
                                          </div>
                                          <div>
                                            <span className="text-secondary-gray">Duration:</span>
                                            <span className="ml-2 text-primary-dark">
                                              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-secondary-gray text-sm">
                                No active project allocations
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full" style={{ minWidth: '1100px' }}>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="w-10 px-3 py-3 text-left"></th>
                  <th className="w-56 px-3 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">
                    Project
                  </th>
                  <th className="w-40 px-3 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">
                    Client
                  </th>
                  <th className="w-28 px-3 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">
                    Role Needed
                  </th>
                  <th className="w-24 px-3 py-3 text-center text-xs font-medium text-secondary-gray uppercase tracking-wider">
                    Allocation
                  </th>
                  <th className="w-24 px-3 py-3 text-center text-xs font-medium text-secondary-gray uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="w-28 px-3 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="w-24 px-3 py-3 text-center text-xs font-medium text-secondary-gray uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {openDemands.map(demand => {
                  const isExpanded = expandedProjects.has(demand.id);
                  const matchingResources = isExpanded ? getMatchingResources(demand) : [];
                  const startDate = new Date(demand.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const endDate = new Date(demand.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                  return (
                    <>
                      <tr
                        key={demand.id}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50/50' : ''}`}
                        onClick={() => toggleProject(demand.id)}
                      >
                        <td className="px-3 py-3">
                          <button className={`text-secondary-gray transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                            <ChevronRight size={16} />
                          </button>
                        </td>
                        <td className="px-3 py-3">
                          <span className="font-medium text-primary-dark">{demand.projectName}</span>
                        </td>
                        <td className="px-3 py-3 text-sm text-secondary-gray">{demand.clientName}</td>
                        <td className="px-3 py-3 text-sm text-secondary-gray">{demand.roleRequired}</td>
                        <td className="px-3 py-3 text-center">
                          <span className="text-sm font-medium text-primary-dark">{demand.allocationPercentage}%</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            demand.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                            demand.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                            demand.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {demand.priority}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-secondary-gray">
                          {startDate} - {endDate}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            demand.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                            demand.status === 'In Progress' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {demand.status}
                          </span>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${demand.id}-expanded`}>
                          <td colSpan={8} className="bg-blue-50/30 px-6 py-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles size={16} className="text-primary" />
                              <span className="text-sm font-semibold text-primary-dark">AI Recommended Resources</span>
                              <span className="text-xs text-secondary-gray">({matchingResources.length} matches)</span>
                            </div>
                            {matchingResources.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {matchingResources.map(resource => {
                                  const skillMatch = resource.skills.filter(s =>
                                    demand.requiredSkills.includes(s.name)
                                  ).length;
                                  const matchScore = Math.round(
                                    (skillMatch / demand.requiredSkills.length) * 50 +
                                    (resource.availability / 100) * 30 +
                                    (resource.pastPerformance / 5) * 20
                                  );

                                  return (
                                    <div
                                      key={resource.id}
                                      className="bg-white rounded-lg p-3 border border-gray-200 hover:border-primary/50 hover:shadow-sm transition-all"
                                    >
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={resource.avatar}
                                          alt={resource.name}
                                          className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-primary-dark text-sm">{resource.name}</div>
                                          <div className="text-xs text-secondary-gray">{resource.role} | {resource.experience}y exp</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-lg font-bold text-primary">{matchScore}</div>
                                          <div className="text-[10px] text-secondary-gray">AI Score</div>
                                        </div>
                                      </div>
                                      <div className="mt-2 flex items-center justify-between text-xs">
                                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                          {resource.availability}% available
                                        </span>
                                        <span className="text-secondary-gray">
                                          {skillMatch}/{demand.requiredSkills.length} skills match
                                        </span>
                                      </div>
                                      <div className="mt-2 flex gap-2">
                                        <button className="flex-1 px-2 py-1 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90 transition-colors">
                                          Assign
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onViewAIMatches(resource);
                                          }}
                                          className="px-2 py-1 border border-gray-200 rounded text-xs font-medium hover:bg-gray-50 transition-colors"
                                        >
                                          View Profile
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-secondary-gray">
                                <Users size={24} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No matching resources with availability found</p>
                                <p className="text-xs mt-1">Try adjusting the requirements or check back later</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs">
              <span className="text-secondary-gray font-medium">Legend:</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-16 h-4 rounded-sm px-1 flex items-center text-[8px] font-semibold text-gray-600"
                  style={{
                    background: 'repeating-linear-gradient(135deg, #3B82F630, #3B82F630 3px, #3B82F650 3px, #3B82F650 6px)',
                    border: '1px solid #3B82F680',
                  }}
                >
                  100% (40h)
                </div>
                <span className="text-secondary-gray">Allocated</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-12 h-4 rounded-sm"
                  style={{
                    background: 'repeating-linear-gradient(135deg, #e5e7eb, #e5e7eb 3px, #f3f4f6 3px, #f3f4f6 6px)',
                  }}
                />
                <span className="text-secondary-gray">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-16 h-4 rounded-sm px-1 flex items-center text-[8px] font-semibold text-gray-600"
                  style={{
                    background: 'repeating-linear-gradient(135deg, #F9731630, #F9731630 3px, #F9731650 3px, #F9731650 6px)',
                    border: '1px solid #F9731680',
                  }}
                >
                  50% (20h)
                </div>
                <span className="text-secondary-gray">Secondary</span>
              </div>
            </div>
            <div className="text-xs text-secondary-gray">
              View: {viewMode === 'D' ? 'Daily (14 days)' : viewMode === 'W' ? 'Weekly (6 weeks)' : 'Monthly (12 months)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
