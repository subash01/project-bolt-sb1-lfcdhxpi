import { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import AIAllocationResults from './components/allocation/AIAllocationResults';
import ResourceDrawer from './components/allocation/ResourceDrawer';
import ManualOverride from './components/override/ManualOverride';
import ResourceGanttView from './components/resources/ResourceGanttView';
import AIDemandMatchDrawer from './components/resources/AIDemandMatchDrawer';
import DemandDetailsListView from './components/demand/DemandDetailsListView';
import DemandDetailPage from './components/demand/DemandDetailPage';
import OpportunityBookingSettings from './components/settings/OpportunityBookingSettings';
import { mockDemandRequests } from './data/mockData';
import type { Page, DemandRequest, Resource } from './types';

const breadcrumbMap: Record<Page, string[]> = {
  dashboard: ['Resource Allocation'],
  'ai-results': ['Resource Allocation', 'AI Recommendations'],
  'manual-override': ['Resource Allocation', 'Manual Selection'],
  'resources': ['Resource Center'],
  'demand-details': ['Demand Requests'],
  'demand-detail': ['Demand Requests', 'Request Details'],
  'settings': ['Settings', 'Opportunity Booking'],
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [demands, setDemands] = useState<DemandRequest[]>(mockDemandRequests);
  const [currentDemand, setCurrentDemand] = useState<DemandRequest | null>(null);
  const [selectedResourceForProfile, setSelectedResourceForProfile] = useState<Resource | null>(null);
  const [selectedResourceForAIMatch, setSelectedResourceForAIMatch] = useState<Resource | null>(null);
  const [aiRecommendedResourceId, setAiRecommendedResourceId] = useState<string | undefined>();

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page === 'dashboard') {
      setCurrentDemand(null);
    }
  };

  const handleDemandSubmit = (demand: DemandRequest) => {
    setDemands(prev => [demand, ...prev]);
    setCurrentDemand(demand);
    setCurrentPage('ai-results');
  };

  const handleViewDemand = (demand: DemandRequest) => {
    setCurrentDemand(demand);
    setCurrentPage('ai-results');
  };

  const handleAcceptResource = (resource: Resource) => {
    setAiRecommendedResourceId(resource.id);
    if (currentDemand) {
      setDemands(prev =>
        prev.map(d =>
          d.id === currentDemand.id ? { ...d, status: 'Fulfilled' as const } : d
        )
      );
    }
  };

  const handleManualOverride = () => {
    setCurrentPage('manual-override');
  };

  const handleManualSelect = (resource: Resource) => {
    if (currentDemand) {
      setDemands(prev =>
        prev.map(d =>
          d.id === currentDemand.id ? { ...d, status: 'Fulfilled' as const } : d
        )
      );
    }
    setCurrentPage('dashboard');
    setCurrentDemand(null);
  };

  const handleViewProfile = (resource: Resource) => {
    setSelectedResourceForProfile(resource);
  };

  const handleViewAIMatches = (resource: Resource) => {
    setSelectedResourceForAIMatch(resource);
  };

  const handleViewDemandFromAIMatch = (demand: DemandRequest) => {
    setSelectedResourceForAIMatch(null);
    setCurrentDemand(demand);
    setCurrentPage('ai-results');
  };

  const handleViewDemandDetail = (demand: DemandRequest) => {
    setCurrentDemand(demand);
    setCurrentPage('demand-detail');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            demands={demands}
            onCreateDemand={() => handleNavigate('demand-details')}
            onViewDemand={handleViewDemand}
            onViewAllDemands={() => handleNavigate('demand-details')}
          />
        );

      case 'ai-results':
        if (!currentDemand) {
          return (
            <div className="text-center py-12">
              <p className="text-secondary-gray">No demand selected. Please create or select a demand request.</p>
              <button
                onClick={() => handleNavigate('dashboard')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          );
        }
        return (
          <AIAllocationResults
            demand={currentDemand}
            onBack={() => handleNavigate('dashboard')}
            onAccept={handleAcceptResource}
            onManualOverride={handleManualOverride}
            onViewProfile={handleViewProfile}
          />
        );

      case 'manual-override':
        return (
          <ManualOverride
            demand={currentDemand}
            aiRecommendedId={aiRecommendedResourceId}
            onBack={() => currentDemand ? setCurrentPage('ai-results') : handleNavigate('dashboard')}
            onSelect={handleManualSelect}
            onViewProfile={handleViewProfile}
          />
        );

      case 'resources':
        return (
          <ResourceGanttView
            onViewAIMatches={handleViewAIMatches}
          />
        );

      case 'demand-details':
        return (
          <DemandDetailsListView
            onBack={() => handleNavigate('dashboard')}
            onDemandCreated={handleDemandSubmit}
            onSelectDemand={handleViewDemandDetail}
          />
        );

      case 'demand-detail':
        if (!currentDemand) {
          return (
            <div className="text-center py-12">
              <p className="text-secondary-gray">No demand selected. Please select a demand request.</p>
              <button
                onClick={() => handleNavigate('demand-details')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Go to Requests
              </button>
            </div>
          );
        }
        return (
          <DemandDetailPage
            demand={currentDemand}
            onBack={() => handleNavigate('demand-details')}
          />
        );

      case 'settings':
        return (
          <OpportunityBookingSettings
            onBack={() => handleNavigate('dashboard')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      breadcrumbs={breadcrumbMap[currentPage]}
    >
      {renderPage()}

      {selectedResourceForProfile && (
        <ResourceDrawer
          resource={selectedResourceForProfile}
          onClose={() => setSelectedResourceForProfile(null)}
        />
      )}

      {selectedResourceForAIMatch && (
        <AIDemandMatchDrawer
          resource={selectedResourceForAIMatch}
          onClose={() => setSelectedResourceForAIMatch(null)}
          onViewDemand={handleViewDemandFromAIMatch}
        />
      )}
    </Layout>
  );
}
