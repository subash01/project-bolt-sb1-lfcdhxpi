import { useState } from 'react';
import { ArrowLeft, X, Sparkles } from 'lucide-react';
import { SKILLS_LIST } from '../../data/mockData';
import type { DemandRequest, Role, Priority, Sensitivity, AllocationPercentage } from '../../types';

interface DemandRequestFormProps {
  onSubmit: (demand: DemandRequest) => void;
  onCancel: () => void;
}

export default function DemandRequestForm({ onSubmit, onCancel }: DemandRequestFormProps) {
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    startDate: '',
    endDate: '',
    roleRequired: 'Developer' as Role,
    requiredSkills: [] as string[],
    minProficiency: 3,
    allocationPercentage: 100 as AllocationPercentage,
    priority: 'Medium' as Priority,
    budgetSensitivity: 'Medium' as Sensitivity,
    clientCriticality: 'Medium' as Sensitivity,
    notes: '',
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
      id: `dem-${Date.now()}`,
      ...formData,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSubmit(newDemand);
  };

  const roleSkillSuggestions: Record<Role, string[]> = {
    Developer: ['React', 'TypeScript', 'Node.js', 'Python', 'Java'],
    QA: ['Selenium', 'Cypress', 'Jest', 'Agile'],
    PM: ['Agile', 'Scrum', 'JIRA'],
    Architect: ['System Design', 'Microservices', 'AWS', 'Kubernetes'],
  };

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-secondary-gray hover:text-primary-dark mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-8 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-primary-dark">Create Demand Request</h1>
          <p className="text-secondary-gray mt-1">Fill in the project requirements to find the best resource match</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">
                Project Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.projectName}
                onChange={e => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">
                Client Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={e => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Enter client name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">
                Project Start Date <span className="text-primary">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">
                Project End Date <span className="text-primary">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">
                Role Required <span className="text-primary">*</span>
              </label>
              <select
                value={formData.roleRequired}
                onChange={e => setFormData(prev => ({ ...prev, roleRequired: e.target.value as Role }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
              >
                <option value="Developer">Developer</option>
                <option value="QA">QA Engineer</option>
                <option value="PM">Project Manager</option>
                <option value="Architect">Architect</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">
                Allocation Percentage <span className="text-primary">*</span>
              </label>
              <select
                value={formData.allocationPercentage}
                onChange={e => setFormData(prev => ({ ...prev, allocationPercentage: Number(e.target.value) as AllocationPercentage }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
              >
                <option value={25}>25%</option>
                <option value={50}>50%</option>
                <option value={75}>75%</option>
                <option value={100}>100%</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-primary-dark mb-2">
              Required Skills
            </label>
            <div className="mb-3">
              <p className="text-xs text-secondary-gray mb-2">Suggested for {formData.roleRequired}:</p>
              <div className="flex flex-wrap gap-2">
                {roleSkillSuggestions[formData.roleRequired].map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      formData.requiredSkills.includes(skill)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-primary-dark hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {SKILLS_LIST.filter(s => !roleSkillSuggestions[formData.roleRequired].includes(s)).map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      formData.requiredSkills.includes(skill)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-primary-dark hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            {formData.requiredSkills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-secondary-gray">Selected:</span>
                {formData.requiredSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                  >
                    {skill}
                    <button type="button" onClick={() => handleSkillToggle(skill)} className="hover:text-primary/70">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-primary-dark mb-2">
              Minimum Skill Proficiency: <span className="text-primary font-bold">{formData.minProficiency}/5</span>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={formData.minProficiency}
              onChange={e => setFormData(prev => ({ ...prev, minProficiency: Number(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-secondary-gray mt-1">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">Priority</label>
              <div className="flex flex-wrap gap-2">
                {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: p }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      formData.priority === p
                        ? p === 'Critical' ? 'bg-red-500 text-white' :
                          p === 'High' ? 'bg-amber-500 text-white' :
                          p === 'Medium' ? 'bg-blue-500 text-white' :
                          'bg-gray-500 text-white'
                        : 'bg-gray-100 text-primary-dark hover:bg-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">Budget Sensitivity</label>
              <div className="flex flex-wrap gap-2">
                {(['Low', 'Medium', 'High'] as Sensitivity[]).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, budgetSensitivity: s }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      formData.budgetSensitivity === s
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-primary-dark hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">Client Criticality</label>
              <div className="flex flex-wrap gap-2">
                {(['Low', 'Medium', 'High'] as Sensitivity[]).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, clientCriticality: s }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      formData.clientCriticality === s
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-primary-dark hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-primary-dark mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              placeholder="Additional requirements or context..."
            />
          </div>

          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-secondary-gray hover:text-primary-dark transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.projectName || !formData.clientName || !formData.startDate || !formData.endDate}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Finding Best Matches...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Get AI Recommendations
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
