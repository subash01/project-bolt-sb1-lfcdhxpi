import { X, Mail, Copy, Download, Send, Edit2, Eye, Paperclip, FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Resource, DemandRequest } from '../../types';

interface AllocationEmailViewProps {
  resource: Resource;
  demand: DemandRequest;
  projectManager?: {
    name: string;
    email: string;
  };
  onClose: () => void;
  onSend?: () => void;
}

export default function AllocationEmailView({
  resource,
  demand,
  projectManager = { name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
  onClose,
  onSend,
}: AllocationEmailViewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const [emailContent, setEmailContent] = useState(`Dear ${projectManager.name},

Subject: Resource Allocation Confirmation – ${resource.name} for ${demand.projectName}

I am pleased to inform you that the following resource has been allocated to your project. Please find the complete resource profile and relevant details below for your review.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESOURCE PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${resource.name}
Role/Designation: ${resource.role}
Email: ${resource.email}
Experience: ${resource.experience}
Current Availability: ${resource.availability}%
Past Performance Rating: ${resource.pastPerformance}/5

Skills & Expertise:
${resource.skills.map(skill => `  • ${skill.name} - ${skill.rating}/5`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALLOCATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project Name: ${demand.projectName}
Client: ${demand.clientName}
Role Required: ${demand.roleRequired}
Allocation Percentage: ${demand.allocationPercentage}%
Project Priority: ${demand.priority}

Allocation Period:
  • Start Date: ${formatDate(demand.startDate)}
  • End Date: ${formatDate(demand.endDate)}
  • Duration: ${demand.allocationDurationMonths || 3} months

Required Skills:
${demand.requiredSkills.map(skill => `  • ${skill}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ATTACHMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please find attached:
  📎 ${resource.name.replace(/\s+/g, '_')}_Resume.pdf

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT STEPS FOR PROJECT MANAGER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Review the attached resume and resource profile
2. Schedule a kick-off meeting with ${resource.name} within the first week
3. Share project documentation and access requirements
4. Set up necessary system access and tools
5. Introduce the resource to the project team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Resource Contact: ${resource.email}
Project Manager: ${projectManager.name} (${projectManager.email})
Resource Management Team: rm-team@company.com

For any queries regarding this allocation, please feel free to reach out.

Best regards,
Resource Management Team
`);

  const [copied, setCopied] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string, size: string, type: string }[]>([
    { name: `${resource.name.replace(/\s+/g, '_')}_Resume.pdf`, size: '245 KB', type: 'PDF' }
  ]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadEmail = () => {
    const element = document.createElement('a');
    const file = new Blob([emailContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `allocation_${resource.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAddAttachment = () => {
    // Simulate adding an attachment
    const newAttachment = {
      name: `Additional_Document_${attachments.length + 1}.pdf`,
      size: '128 KB',
      type: 'PDF'
    };
    setAttachments([...attachments, newAttachment]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary-dark">Allocation Notification Email</h2>
              <p className="text-sm text-secondary-gray">To: {projectManager.name} ({projectManager.email})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-secondary-gray uppercase font-semibold mb-1">
                  Recipient (Project Manager)
                </p>
                <p className="font-medium text-primary-dark">{projectManager.name}</p>
                <p className="text-sm text-secondary-gray">{projectManager.email}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-secondary-gray uppercase font-semibold mb-1">
                  Allocated Resource
                </p>
                <div className="flex items-center gap-2">
                  <img
                    src={resource.avatar}
                    alt={resource.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-primary-dark text-sm">{resource.name}</p>
                    <p className="text-xs text-secondary-gray">{resource.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-primary-dark flex items-center gap-2">
                  <Paperclip size={16} className="text-blue-600" />
                  Attachments
                </h3>
                <button
                  onClick={handleAddAttachment}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Paperclip size={14} />
                  Add Attachment
                </button>
              </div>
              <div className="space-y-2">
                {attachments.map((attachment, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white border border-blue-100 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-primary-dark text-sm">{attachment.name}</p>
                        <p className="text-xs text-secondary-gray">{attachment.type} • {attachment.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-primary-dark">
                  {isEditMode ? 'Edit Email Content' : 'Email Content Preview'}
                </h3>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-dark bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {isEditMode ? (
                    <>
                      <Eye size={16} />
                      Preview
                    </>
                  ) : (
                    <>
                      <Edit2 size={16} />
                      Edit
                    </>
                  )}
                </button>
              </div>

              {isEditMode ? (
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="w-full h-96 p-4 font-mono text-sm text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Edit your email content here..."
                />
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div className="font-mono text-sm text-gray-800 space-y-3 whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
                    {emailContent.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-gray-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-amber-900 mb-1">ALLOCATION STARTS</p>
                <p className="text-lg font-bold text-amber-600">{formatDate(demand.startDate)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-900 mb-1">ALLOCATION %</p>
                <p className="text-lg font-bold text-amber-600">{demand.allocationPercentage}%</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-900 mb-1">DURATION</p>
                <p className="text-lg font-bold text-amber-600">{demand.allocationDurationMonths || 3} months</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEmail}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${copied
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-white border border-gray-200 text-primary-dark hover:bg-gray-50'
                }`}
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy Email'}
            </button>
            <button
              onClick={handleDownloadEmail}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-primary-dark rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Download size={16} />
              Download
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-primary-dark rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onSend}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Send size={16} />
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
