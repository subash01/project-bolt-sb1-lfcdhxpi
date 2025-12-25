import { Briefcase, Target, X } from 'lucide-react';

interface DemandSourceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (source: 'Project' | 'Opportunity') => void;
}

export default function DemandSourceSelector({ isOpen, onClose, onSelect }: DemandSourceSelectorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-primary-dark">Create Demand Request</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-secondary-gray" />
          </button>
        </div>

        <div className="p-8">
          <p className="text-secondary-gray mb-6">Select the source for your demand request</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onSelect('Project')}
              className="flex flex-col items-center justify-center p-6 border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <Briefcase size={24} className="text-blue-600" />
              </div>
              <span className="text-lg font-semibold text-primary-dark">From Project</span>
              <span className="text-xs text-secondary-gray mt-1">Create from project requirements</span>
            </button>

            <button
              onClick={() => onSelect('Opportunity')}
              className="flex flex-col items-center justify-center p-6 border-2 border-emerald-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-400 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
                <Target size={24} className="text-emerald-600" />
              </div>
              <span className="text-lg font-semibold text-primary-dark">From Opportunity</span>
              <span className="text-xs text-secondary-gray mt-1">Create from opportunity details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
