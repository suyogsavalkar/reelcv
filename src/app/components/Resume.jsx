'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { loadVersionData } from '../utils/versionManager';
import Video from './Video';

const Tooltip = ({ text }) => (
  <div className="absolute z-50 px-2 py-1 text-sm text-white bg-gray-800 rounded shadow-lg max-w-xl">
    {text}
  </div>
);

const formatText = (text) => {
  if (!text) return '';
  
  // Replace bold syntax (**text**) with styled span
  let formattedText = text.replace(/\*\*(.+?)\*\*/g, '<span class="font-bold relative group cursor-help">$1<div class="hidden group-hover:block absolute left-full ml-2 top-0 z-50 transition-opacity duration-200"><div class="bg-gray-800 text-white text-sm rounded px-2 py-1 shadow-lg min-w-[200px] break-words">Highlighted achievement or skill</div></div></span>');
  
  // Replace highlight syntax (@@text@@[message]) with styled span
  formattedText = formattedText.replace(/@@(.+?)@@(?:\[(.+?)\])?/g, (match, text, message) => {
    const tooltipMessage = message || 'Key highlight';
    return `<span class="border-b-4 border-blue-200 relative group cursor-help">${text}<div class="hidden group-hover:block absolute left-full ml-2 top-0 z-50 transition-opacity duration-200"><div class="bg-gray-800 text-white text-sm rounded px-2 py-1 shadow-lg min-w-[200px] max-w-[300px] break-words">${tooltipMessage}</div></div></span>`;
  });
  
  return formattedText;
};

const FormattedText = ({ text }) => (
  <span dangerouslySetInnerHTML={{ __html: formatText(text) }} />
);

const ResumeHeader = () => (
  <div className="text-center mb-6">
    <h1 className="text-xl sm:text-2xl font-semibold">Suyog Savalkar</h1>
    <div className="text-xs sm:text-sm mt-1 flex flex-wrap justify-center gap-1 sm:gap-2">
      <span>suyog231002@gmail.com</span>
      <span className="">•</span>
      <span>+91 7219380488</span>
      <span className="">•</span>
      <span>India</span>
      <span className="">•</span>
      <span><a href="https://www.linkedin.com/in/suyog-savalkar/" className="text-blue-600" target='_blank'>LinkedIn</a></span>
    </div>
  </div>
);

const ResumeOverview = ({ skills }) => (
  <div className="resume-section">
    <h2 className="resume-section-title">SKILLS</h2>
    <div>
      <p className="font-medium">VIT, BTech Comp science (AI)</p>
      <p className="text-xs sm:text-sm flex justify-between">
        <span>GPA: 8.6/10</span>
        <span>2020 - 2024</span>
      </p>
      
      <div className="mt-2">
        <p className="font-medium">Technical Skills:</p>
        <div className="mt-1 mb-2 flex flex-wrap">
          {skills?.map((skill, index) => (
            <span key={index} className="inline-block bg-gray-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm mr-1.5 mb-1.5">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Project = ({ title, role, dateRange, achievements }) => (
  <div className="mb-4">
    <div className="flex flex-col sm:flex-row sm:justify-between">
      <p className="font-medium"><FormattedText text={title} /></p>
      <p className="text-xs sm:text-sm text-gray-600">{dateRange}</p>
    </div>
    <p className="text-xs sm:text-sm text-gray-600 italic"><FormattedText text={role} /></p>
    <ul className="list-disc ml-5 mt-1 text-xs sm:text-sm">
      {achievements.map((achievement, index) => (
        <li key={index} className="max-w-[85%]"><FormattedText text={achievement} /></li>
      ))}
    </ul>
  </div>
);

const WorkExperience = ({ company, role, dateRange, achievements }) => (
  <div className="mb-4">
    <div className="flex flex-col sm:flex-row sm:justify-between">
      <p className="font-medium"><FormattedText text={company} /></p>
      <p className="text-xs sm:text-sm text-gray-600">{dateRange}</p>
    </div>
    <p className="text-xs sm:text-sm text-gray-600 italic"><FormattedText text={role} /></p>
    <ul className="list-disc ml-5 mt-1 text-xs sm:text-sm">
      {achievements.map((achievement, index) => (
        <li key={index} className="max-w-[85%]"><FormattedText text={achievement} /></li>
      ))}
    </ul>
  </div>
);

const WorkExperienceModal = ({ isOpen, onClose, additionalExperiences }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg relative max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="absolute right-4 top-4 text-2xl cursor-pointer hover:text-gray-700" onClick={onClose}>×</div>
        <div className="p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Additional Work Experience</h2>
          {additionalExperiences.map((exp, index) => (
            <WorkExperience key={index} {...exp}/>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResumeWorkExperience = ({ experiences, modalExperiences = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!experiences) return null;

  const mainExperiences = experiences.map(exp => ({
    company: exp.company,
    role: exp.role,
    dateRange: exp.dateRange,
    achievements: Array.isArray(exp.achievements) ? exp.achievements : []
  }));

  const hasModalExperiences = Array.isArray(modalExperiences) && modalExperiences.length > 0;

  return (
    <div className="resume-section">
      <h2 className="resume-section-title">WORK EXPERIENCE</h2>
      {mainExperiences.map((exp, index) => (
        <WorkExperience key={index} {...exp} />
      ))}
      {hasModalExperiences && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View More Experience ({modalExperiences.length})
        </button>
      )}
      <WorkExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        additionalExperiences={modalExperiences}
      />
    </div>
  );
};

const Leadership = ({ title, role, dateRange, achievements }) => (
  <div className="mb-4">
    <div className="flex flex-col sm:flex-row sm:justify-between">
      <p className="font-medium"><FormattedText text={title} /></p>
      <p className="text-xs sm:text-sm text-gray-600">{dateRange}</p>
    </div>
    <p className="text-xs sm:text-sm text-gray-600 italic"><FormattedText text={role} /></p>
    <ul className="list-disc ml-5 mt-1 text-xs sm:text-sm">
      {achievements.map((achievement, index) => (
        <li key={index}><FormattedText text={achievement} /></li>
      ))}
    </ul>
  </div>
);

const ResumeLeadership = ({ leadership }) => (
  <div className="resume-section">
    <h2 className="resume-section-title">LEADERSHIP EXPERIENCE</h2>
    {leadership?.map((item, index) => (
      <Leadership
        key={index}
        title={item.title}
        role={item.role}
        dateRange={item.dateRange}
        achievements={item.achievements}
      />
    ))}
  </div>
);

const ResumeBeyondWork = ({ hobbies }) => (
  <div className="resume-section">
    <h2 className="resume-section-title">BEYOND WORK</h2>
    <ul className="text-xs sm:text-sm list-disc ml-4 sm:ml-5 space-y-1 sm:space-y-2">
      {hobbies?.map((hobby, index) => (
        <li key={index} className="leading-relaxed"><FormattedText text={hobby} /></li>
      ))}
    </ul>
  </div>
);

const ResumeProjects = ({ projects }) => (
  <div className="resume-section">
    <h2 className="resume-section-title">PROJECTS</h2>
    {projects?.map((project, index) => (
      <Project
        key={index}
        title={project.title}
        role={project.role}
        dateRange={project.dateRange}
        achievements={project.achievements}
      />
    ))}
  </div>
);

export default function Resume() {
  const params = useParams();
  const [resumeData, setResumeData] = useState(null);

  const [error, setError] = useState(null);
  // Update version ID to match file name
  const versionId = params.versionId?.replace('_', '-') || 'google-pm';

  useEffect(() => {
    async function loadData() {
      try {
        console.log('Loading version:', versionId); // Debug log
        const data = await loadVersionData(versionId);
        
        if (!data) {
          throw new Error('Failed to load resume data');
        }
        
        if (Object.keys(data).length === 0) {
          throw new Error('No data received');
        }

        console.log('Loaded data:', data); // Debug log
        setResumeData(data);
        setError(null);
      } catch (error) {
        console.error('Resume loading error:', error);
        setError(error.message);
        setResumeData(null);
      }
    }
    loadData();
  }, [versionId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Resume</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="resume-container">
        <ResumeHeader />
        <ResumeOverview skills={resumeData.skills} />
        <ResumeProjects projects={resumeData.projects} />
        <ResumeWorkExperience 
          experiences={resumeData.experiences} 
          modalExperiences={resumeData.modal_experience}
        />
        <ResumeLeadership leadership={resumeData.leadership} />
        <ResumeBeyondWork hobbies={resumeData.hobbies} />
      </div>
    </div>
  );

}
