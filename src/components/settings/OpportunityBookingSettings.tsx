import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Settings, CheckCircle, XCircle, RefreshCw, AlertCircle, Info } from 'lucide-react';
import type { BookingStatusRule, ProbabilityThreshold } from '../../types';

interface OpportunityBookingSettingsProps {
  onBack: () => void;
}

export default function OpportunityBookingSettings({ onBack }: OpportunityBookingSettingsProps) {
  const [statusRules, setStatusRules] = useState<BookingStatusRule[]>([
    {
      id: '1',
      setting_id: 'default',
      opportunity_status: 'Open',
      booking_action: 'create_soft',
      booking_type: 'soft-booked',
      is_enabled: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      setting_id: 'default',
      opportunity_status: 'In Progress',
      booking_action: 'create_soft',
      booking_type: 'soft-booked',
      is_enabled: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      setting_id: 'default',
      opportunity_status: 'Closed-Won',
      booking_action: 'convert_to_confirmed',
      booking_type: 'hard-booked',
      is_enabled: true,
      sort_order: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: '4',
      setting_id: 'default',
      opportunity_status: 'Closed-Lost',
      booking_action: 'cancel',
      booking_type: 'cancelled',
      is_enabled: true,
      sort_order: 4,
      created_at: new Date().toISOString(),
    },
  ]);

  const [probabilityThresholds, setProbabilityThresholds] = useState<ProbabilityThreshold[]>([
    {
      id: '1',
      setting_id: 'default',
      min_probability: 0,
      max_probability: 25,
      auto_create_booking: false,
      booking_type: 'soft-booked',
      is_enabled: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      setting_id: 'default',
      min_probability: 26,
      max_probability: 50,
      auto_create_booking: true,
      booking_type: 'soft-booked',
      is_enabled: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      setting_id: 'default',
      min_probability: 51,
      max_probability: 75,
      auto_create_booking: true,
      booking_type: 'soft-booked',
      is_enabled: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '4',
      setting_id: 'default',
      min_probability: 76,
      max_probability: 100,
      auto_create_booking: true,
      booking_type: 'soft-booked',
      is_enabled: true,
      created_at: new Date().toISOString(),
    },
  ]);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStatusRuleToggle = (ruleId: string) => {
    setStatusRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, is_enabled: !rule.is_enabled } : rule
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleThresholdToggle = (thresholdId: string) => {
    setProbabilityThresholds(prev =>
      prev.map(threshold =>
        threshold.id === thresholdId
          ? { ...threshold, auto_create_booking: !threshold.auto_create_booking }
          : threshold
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleThresholdEnabledToggle = (thresholdId: string) => {
    setProbabilityThresholds(prev =>
      prev.map(threshold =>
        threshold.id === thresholdId
          ? { ...threshold, is_enabled: !threshold.is_enabled }
          : threshold
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setHasUnsavedChanges(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'create_soft':
        return 'Create Soft Booking';
      case 'convert_to_confirmed':
        return 'Convert to Confirmed';
      case 'cancel':
        return 'Cancel Booking';
      default:
        return action;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create_soft':
        return <CheckCircle size={16} className="text-blue-500" />;
      case 'convert_to_confirmed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'cancel':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <RefreshCw size={16} className="text-gray-500" />;
    }
  };

  const getBookingTypeLabel = (type: string) => {
    switch (type) {
      case 'soft-booked':
        return 'Soft Booking';
      case 'hard-booked':
        return 'Confirmed Booking';
      case 'cancelled':
        return 'Cancelled';
      default:
        return type;
    }
  };

  const getBookingTypeBadge = (type: string) => {
    switch (type) {
      case 'soft-booked':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'hard-booked':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} className="text-primary-dark" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
                  <Settings size={28} className="text-primary" />
                  Opportunity Resource Booking Settings
                </h1>
                <p className="text-sm text-secondary-gray mt-1">
                  Configure automatic booking rules based on opportunity status and probability
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all ${
                hasUnsavedChanges
                  ? 'bg-primary hover:bg-primary-dark text-white shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save size={18} />
              {saveSuccess ? 'Saved!' : 'Save Changes'}
            </button>
          </div>

          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <span className="text-green-700 font-medium">Settings saved successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <RefreshCw size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-primary-dark">Status-Based Rules</h2>
                  <p className="text-xs text-secondary-gray">Automated actions triggered by opportunity status changes</p>
                </div>
              </div>

              <div className="space-y-3">
                {statusRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-lg border transition-all ${
                      rule.is_enabled
                        ? 'bg-gradient-to-r from-white to-blue-50/30 border-blue-100'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getActionIcon(rule.booking_action)}
                        <span className="font-medium text-primary-dark">{rule.opportunity_status}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rule.is_enabled}
                          onChange={() => handleStatusRuleToggle(rule.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-secondary-gray">Action:</span>
                        <span className="font-medium text-gray-700">{getActionLabel(rule.booking_action)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-secondary-gray">Result:</span>
                        <span className={`px-2 py-0.5 rounded border text-xs font-medium ${getBookingTypeBadge(rule.booking_type)}`}>
                          {getBookingTypeLabel(rule.booking_type)}
                        </span>
                      </div>
                    </div>

                    {rule.is_enabled && (
                      <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-100 flex items-start gap-2">
                        <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-700">
                          {rule.booking_action === 'create_soft' &&
                            `Automatically creates a soft booking when opportunity moves to "${rule.opportunity_status}"`}
                          {rule.booking_action === 'convert_to_confirmed' &&
                            `Converts existing soft bookings to confirmed when opportunity is "${rule.opportunity_status}"`}
                          {rule.booking_action === 'cancel' &&
                            `Cancels all soft bookings when opportunity becomes "${rule.opportunity_status}"`}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <AlertCircle size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-primary-dark">Probability Thresholds</h2>
                  <p className="text-xs text-secondary-gray">Configure automatic booking creation based on win probability</p>
                </div>
              </div>

              <div className="space-y-3">
                {probabilityThresholds.map((threshold) => (
                  <div
                    key={threshold.id}
                    className={`p-4 rounded-lg border transition-all ${
                      threshold.is_enabled
                        ? 'bg-gradient-to-r from-white to-green-50/30 border-green-100'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-primary-dark mb-1">
                          {threshold.min_probability}% - {threshold.max_probability}%
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                threshold.auto_create_booking ? 'bg-green-500' : 'bg-gray-400'
                              }`}
                              style={{ width: `${threshold.max_probability}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={threshold.is_enabled}
                          onChange={() => handleThresholdEnabledToggle(threshold.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-gray">Auto-create booking:</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={threshold.auto_create_booking}
                            onChange={() => handleThresholdToggle(threshold.id)}
                            disabled={!threshold.is_enabled}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 peer-disabled:opacity-50"></div>
                        </label>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-secondary-gray">Booking Type:</span>
                        <span className={`px-2 py-0.5 rounded border text-xs font-medium ${getBookingTypeBadge(threshold.booking_type)}`}>
                          {getBookingTypeLabel(threshold.booking_type)}
                        </span>
                      </div>
                    </div>

                    {threshold.is_enabled && threshold.auto_create_booking && (
                      <div className="mt-3 p-2 bg-green-50 rounded border border-green-100 flex items-start gap-2">
                        <Info size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-green-700">
                          Automatically creates {getBookingTypeLabel(threshold.booking_type).toLowerCase()} when opportunity probability is between {threshold.min_probability}% and {threshold.max_probability}%
                        </p>
                      </div>
                    )}

                    {threshold.is_enabled && !threshold.auto_create_booking && (
                      <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-100 flex items-start gap-2">
                        <AlertCircle size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-700">
                          Manual booking required for probabilities in this range
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-900">How Automation Works</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[140px]">Soft Bookings:</span>
                    <span>Tentative resource allocations that can be easily modified or cancelled. Created for opportunities in early stages.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[140px]">Confirmed Bookings:</span>
                    <span>Finalized resource commitments. Automatically created when opportunities are won.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[140px]">Status Triggers:</span>
                    <span>Rules execute automatically when opportunity status changes, ensuring booking status stays synchronized.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[140px]">Probability Ranges:</span>
                    <span>Define whether bookings should be created automatically based on win likelihood.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
