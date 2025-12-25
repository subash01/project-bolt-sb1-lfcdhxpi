import { AlertTriangle, CheckCircle2, Zap, Activity } from 'lucide-react';

interface BusinessRule {
  id: string;
  title: string;
  trigger: string;
  action: string;
  status: 'active' | 'triggered' | 'inactive';
  opportunityStatus?: string;
}

interface AIBusinessRulesProps {
  opportunityStatus?: string;
  isAutoCancelled?: boolean;
  cancellationReason?: string;
}

export default function AIBusinessRules({
  opportunityStatus = 'In Progress',
  isAutoCancelled = false,
  cancellationReason = '',
}: AIBusinessRulesProps) {
  const businessRules: BusinessRule[] = [
    {
      id: 'rule-1',
      title: 'Low Probability Opportunity',
      trigger: 'Opportunity Status = Low Probability',
      action: 'Auto-cancel all resource requests',
      status: opportunityStatus === 'Low Probability' ? 'triggered' : 'active',
      opportunityStatus: 'Low Probability',
    },
    {
      id: 'rule-2',
      title: 'Closed Lost Opportunity',
      trigger: 'Opportunity Status = Closed Lost',
      action: 'Auto-cancel all resource requests',
      status: opportunityStatus === 'Closed Lost' ? 'triggered' : 'active',
      opportunityStatus: 'Closed Lost',
    },
    {
      id: 'rule-3',
      title: 'Resource Allocation Confirmation',
      trigger: 'Resource is accepted/allocated',
      action: 'Send PM notification with onboarding details',
      status: 'inactive',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'triggered':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered':
        return 'bg-red-50 border-red-200';
      case 'active':
        return 'bg-emerald-50 border-emerald-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'triggered':
        return 'Triggered - Auto Cancellation in Progress';
      case 'active':
        return 'Active & Monitoring';
      default:
        return 'Inactive';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-primary-dark">AI Business Rules</h3>
      </div>

      {isAutoCancelled && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Auto-Cancellation Triggered</p>
              <p className="text-sm text-red-800 mt-1">
                {cancellationReason || 'This resource request has been automatically cancelled due to opportunity status change.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {businessRules.map((rule) => (
          <div
            key={rule.id}
            className={`border rounded-lg p-4 transition-all ${getStatusColor(rule.status)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">{getStatusIcon(rule.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-semibold text-primary-dark">{rule.title}</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                      rule.status === 'triggered'
                        ? 'bg-red-100 text-red-700'
                        : rule.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {getStatusLabel(rule.status)}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-secondary-gray min-w-fit">Trigger:</span>
                    <span className="text-gray-800 font-medium">{rule.trigger}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-secondary-gray min-w-fit">Action:</span>
                    <span className="text-gray-800 font-medium">{rule.action}</span>
                  </div>
                </div>

                {rule.status === 'triggered' && (
                  <div className="mt-3 pt-3 border-t border-current border-opacity-10">
                    <p className="text-xs text-gray-600">
                      <strong>Impact:</strong> All associated resource requests will be cancelled automatically.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>How it works:</strong> AI Business Rules automatically monitor your opportunity status. When an opportunity transitions to "Low Probability" or "Closed Lost", all related resource requests are automatically cancelled to optimize resource allocation.
        </p>
      </div>
    </div>
  );
}
