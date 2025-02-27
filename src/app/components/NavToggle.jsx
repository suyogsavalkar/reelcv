'use client';

import { useState, useEffect } from 'react';
import { FaComment, FaTimes } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import Video from './Video';

export default function NavToggle({ onTabChange }) {
  const params = useParams();
  const versionId = params.versionId;
  
  const [activeTab, setActiveTab] = useState('Resume');
  const [showNotification, setShowNotification] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  const tabs = ['Resume'];
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const toggleNotification = () => {
    setShowNotification(!showNotification);
    if (!showNotification) {
      setShowPopup(false);
      localStorage.setItem('personalMessageViewed', JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        crossed: true
      }));
    }
  };

  const closePopup = (e) => {
    e.stopPropagation();
    setShowPopup(false);
    localStorage.setItem('personalMessageViewed', JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      crossed: true
    }));
  };
  
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(null);

  useEffect(() => {
    async function loadVersions() {
      try {
        const response = await fetch('/api/versions');
        const data = await response.json();
        setVersions(data);
        
        const current = data.find(v => v.id === versionId) || data[0];
        setCurrentVersion(current);

        // Check localStorage for popup visibility
        const viewed = localStorage.getItem('personalMessageViewed');
        if (viewed) {
          const { date, crossed } = JSON.parse(viewed);
          const today = new Date().toISOString().split('T')[0];
          setShowPopup(date !== today || !crossed);
        } else {
          setShowPopup(true);
        }
      } catch (error) {
        console.error('Error loading versions:', error);
      }
    }
    loadVersions();
  }, [versionId]);

  const messageCount = currentVersion?.messages?.length || 0;

  return (
    <>
      <div className="nav-toggle flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="relative cursor-pointer group" onClick={toggleNotification}>
          <FaComment className="text-gray-600 text-xl transition-colors group-hover:text-blue-500" />
          {messageCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {messageCount}
            </div>
          )}
          {showPopup && (
            <div className="absolute left-0 bottom-full mb-2 bg-white rounded-lg shadow-lg p-3 w-64">
              <button 
                onClick={closePopup}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
              <p className="text-sm font-medium pr-6">Suyog wants you to know this</p>
            </div>
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
          <span className="sm:hidden whitespace-nowrap">in Windsurf and Trae</span>
        </div>
      </div>

      {showNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-lg w-full max-w-[90%] sm:max-w-md overflow-hidden shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3 sm:p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <h3 className="font-semibold text-base sm:text-lg">From Suyog</h3>
              <button 
                onClick={toggleNotification}
                className="p-1 hover:bg-blue-500 rounded-full transition-colors"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[70vh] bg-gray-50">
              {/* Video Section */}
              {currentVersion?.video && (
                <div className="p-4">
                  <Video videoUrl={currentVersion.video} />
                </div>
              )}
              {/* Messages Section */}
              <div className="p-4 space-y-4">
                {currentVersion?.messages?.map((msg, idx) => (
                  <div key={idx} className="flex flex-col max-w-[85%] bg-white rounded-lg shadow-sm p-3 ml-auto">
                    <p className="text-sm font-medium text-gray-800">{msg.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {msg.content.split(/([*][*].*?[*][*]|##.*?##|https?:\/\/[^\s]+)/).map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={i}>{part.slice(2, -2)}</strong>;
                        } else if (part.startsWith('##') && part.endsWith('##')) {
                          return <span key={i} className="bg-yellow-100">{part.slice(2, -2)}</span>;
                        } else if (part.match(/^https?:\/\//)) {
                          return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{part}</a>;
                        }
                        return part;
                      })}
                    </p>
                    <span className="text-xs text-gray-400 self-end mt-1">Today</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
