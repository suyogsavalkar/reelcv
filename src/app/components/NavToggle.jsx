'use client';

import { useState, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { useParams } from 'next/navigation';

export default function NavToggle({ onTabChange }) {
  const params = useParams();
  const versionId = params.versionId;
  
  const [activeTab, setActiveTab] = useState('Resume');
  const [showNotification, setShowNotification] = useState(false);
  
  const tabs = ['Resume'];
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };
  
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(null);

  useEffect(() => {
    async function loadVersions() {
      try {
        const response = await fetch('/api/versions');
        const data = await response.json();
        console.log('Loaded versions:', data); // Debug log
        setVersions(data);
        
        // Set current version based on URL or default to first version
        const current = data.find(v => v.id === versionId) || data[0];
        setCurrentVersion(current);
      } catch (error) {
        console.error('Error loading versions:', error);
      }
    }
    loadVersions();
  }, [versionId]);

  return (
    <>
      <div className="nav-toggle flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="relative cursor-pointer group" onClick={toggleNotification}>
          <FaBell className="text-gray-600 text-xl transition-colors group-hover:text-blue-500" />
          {versions.length > 0 && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>
        
        <div className="hidden sm:flex flex-1 justify-center mx-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-5 py-2 rounded-full transition-colors text-base ${
                activeTab === tab 
                  ? 'bg-[#3b82f6] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="text-gray-600 text-xs flex items-center">
          <span className="whitespace-nowrap">Made with</span>
          <FaHeart className="text-red-500 mx-1 inline-block animate-pulse" />
          <span className="hidden sm:inline whitespace-nowrap">in Windsurf and Trae</span>
          <span className="sm:hidden whitespace-nowrap">in W&T</span>
        </div>
      </div>

      {showNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-lg w-full max-w-[90%] sm:max-w-md overflow-hidden shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3 sm:p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <h3 className="font-semibold text-base sm:text-lg">Resume Versions</h3>
              <button 
                onClick={toggleNotification}
                className="p-1 hover:bg-blue-500 rounded-full transition-colors"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[70vh] divide-y divide-gray-100">
              {/* Video Section */}
              {currentVersion?.video && (
                <div className="p-3 sm:p-4">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <iframe 
                      className="w-full h-full"
                      src={currentVersion.video}
                      title="Resume Guide"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Version Messages */}
              <div className="p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm sm:text-base">{currentVersion?.name}</h4>
                  <a 
                    href={`/${currentVersion?.id}`}
                    className="text-blue-600 text-xs sm:text-sm hover:underline"
                  >
                    View →
                  </a>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-600">Why me?</p>
                
                {/* Version-specific Messages */}
                <div className="space-y-2 mt-2">
                  {currentVersion?.messages?.map((msg, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-xs font-medium text-gray-700">{msg.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{msg.content}</p>
                    </div>
                  ))}
                </div>

                {/* Other Versions */}
                {/* <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">Other versions:</p>
                  {versions
                    .filter(v => v.id !== currentVersion?.id)
                    .map(version => (
                      <a
                        key={version.id}
                        href={`/${version.id}`}
                        className="block p-2 hover:bg-gray-50 rounded-lg mb-1 transition-colors"
                      >
                        <p className="font-medium text-sm">{version.name}</p>
                        <p className="text-xs text-gray-600">{version.description}</p>
                      </a>
                    ))}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
