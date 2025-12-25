import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { SKILLS_LIST, PROJECTS_LIST, CLIENTS_LIST, generateRequestId } from '../../data/mockData';
import OpportunityBasedDemandRequest from './OpportunityBasedDemandRequest';
import type { DemandRequest, Role, Priority, Sensitivity, AllocationPercentage } from '../../types';

interface DemandRequestModalProps {
  isOpen: boolean;
  sourceType: 'Project' | 'Opportunity' | null;
  existingDemands: DemandRequest[];
  onClose: () => void;
  onSubmit: (demand: DemandRequest) => void;
}

export default function DemandRequestModal({ isOpen, sourceType, existingDemands, onClose, onSubmit }: DemandRequestModalProps) {
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    customer: '',
    startDate: '',
    endDate: '',
    requestStartDate: '',
    requestEndDate: '',
    expectedClosureDate: '',
    roleRequired: 'Developer' as Role,
    requiredSkills: [] as string[],
    minProficiency: 3,
    allocationPercentage: 100 as AllocationPercentage,
    priority: 'Medium' as Priority,
    budgetSensitivity: 'Medium' as Sensitivity,
    clientCriticality: 'Medium' as Sensitivity,
    notes: '',
    sourceType: (sourceType || 'Project') as 'Project' | 'Opportunity',
    requestedBy: '',
    workLocation: 'Remote' as const,
    commercialType: 'T&M' as const,
    allocationExecutive: '',
    allocationCoordinator: '',
    region: 'North America' as const,
    legalEntity: '',
    division: '',
    subDivision: '',
    operationModel: 'Dedicated Team' as const,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter(s => s !== skill)
        : [...prev.requiredSkills, skill],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const newDemand: DemandRequest = {
      id: generateRequestId(existingDemands),
      ...formData,
      status: 'Open',
      requestStatus: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSubmit(newDemand);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      projectName: '',
      clientName: '',
      customer: '',
      startDate: '',
      endDate: '',
      requestStartDate: '',
      requestEndDate: '',
      expectedClosureDate: '',
      roleRequired: 'Developer',
      requiredSkills: [],
      minProficiency: 3,
      allocationPercentage: 100,
      priority: 'Medium',
      budgetSensitivity: 'Medium',
      clientCriticality: 'Medium',
      notes: '',
      sourceType: 'Project',
      requestedBy: '',
      workLocation: 'Remote',
      commercialType: 'T&M',
      allocationExecutive: '',
      allocationCoordinator: '',
      region: 'North America',
      legalEntity: '',
      division: '',
      subDivision: '',
      operationModel: 'Dedicated Team',
    });
    setIsSubmitting(false);
    onClose();
  };

  const roleSkillSuggestions: Record<Role, string[]> = {
    Developer: ['React', 'TypeScript', 'Node.js', 'Python', 'Java'],
    QA: ['Selenium', 'Cypress', 'Jest', 'Agile'],
    PM: ['Agile', 'Scrum', 'JIRA'],
    Architect: ['System Design', 'Microservices', 'AWS', 'Kubernetes'],
  };

  if (!isOpen || !sourceType) return null;

  if (sourceType === 'Opportunity') {
    return (
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300" onClick={handleReset}>
        <div className="fixed right-0 top-0 bottom-0 w-full md:w-2/3 lg:w-3/5 bg-white shadow-lg z-50 flex flex-col animate-in slide-in-from-right-0 duration-300 overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold text-primary-dark">Resource Request from Opportunity</h2>
            <button
              onClick={handleReset}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-secondary-gray" />
            </button>
          </div>
          <div className="flex-1 p-6">
            <OpportunityBasedDemandRequest
              onBack={handleReset}
              onSubmit={(demand) => {
                onSubmit(demand);
                handleReset();
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300" onClick={handleReset} />
      <div className="fixed right-0 top-0 bottom-0 w-1/2 bg-white shadow-lg z-50 flex flex-col animate-in slide-in-from-right-0 duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-primary-dark">Create Demand Request</h2>
            <p className="text-xs text-secondary-gray mt-0.5">From {sourceType}</p>
          </div>
          <button
            onClick={handleReset}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-secondary-gray" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1.5">
                Project Name <span className="text-primary">*</span>
              </label>
              <select
                required
                value={formData.projectName}
                onChange={e => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
              >
                <option value="">Select a project</option>
                {PROJECTS_LIST.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1.5">
                Client Name <span className="text-primary">*</span>
              </label>
              <select
                required
                value={formData.clientName}
                onChange={e => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
              >
                <option value="">Select a client</option>
                {CLIENTS_LIST.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1.5">Role Required <span className="text-primary">*</span></label>
              <select
                value={formData.roleRequired}
                onChange={e => {
                  setFormData(prev => ({ ...prev, roleRequired: e.target.value as Role, requiredSkills: [] }));
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
              >
                <option value="Developer">Developer</option>
                <option value="QA">QA Engineer</option>
                <option value="PM">Project Manager</option>
                <option value="Architect">Architect</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1.5">
                Allocation % <span className="text-primary">*</span>
              </label>
              <select
                value={formData.allocationPercentage}
                onChange={e => setFormData(prev => ({ ...prev, allocationPercentage: Number(e.target.value) as AllocationPercentage }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
              >
                <option value={25}>25%</option>
                <option value={50}>50%</option>
                <option value={75}>75%</option>
                <option value={100}>100%</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1.5">
                Start Date <span className="text-primary">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1.5">
                End Date <span className="text-primary">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1.5">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1.5">Requested By</label>
              <input
                type="text"
                value={formData.requestedBy}
                onChange={e => setFormData(prev => ({ ...prev, requestedBy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                placeholder="Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-dark mb-2">Required Skills</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {roleSkillSuggestions[formData.roleRequired].map(skill => (
                <label key={skill} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requiredSkills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-primary-dark">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-dark mb-1.5">Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-primary-dark border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Create Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
