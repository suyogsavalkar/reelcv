'use client';

import { useState } from 'react';
import NavToggle from '../components/NavToggle';
import Resume from '../components/Resume';
import Portfolio from '../components/Portfolio';
import Match from '../components/Match';
import Video from '../components/Video';

export default function VersionedResume() {
  const [activeTab, setActiveTab] = useState('Resume');

  const renderContent = () => {
    switch (activeTab) {
      case 'Resume':
        return <Resume />;
      case 'Portfolio':
        return <Portfolio />;
      case 'Match':
        return <Match />;
      case 'Video':
        return <Video />;
      default:
        return <Resume />;
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {renderContent()}
      <NavToggle onTabChange={setActiveTab} />
    </div>
  );
}