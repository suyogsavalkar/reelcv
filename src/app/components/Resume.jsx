'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { loadVersionData } from '../utils/versionManager';

const ResumeHeader = () => (
  <div className="text-center mb-6">
    <h1 className="text-xl sm:text-2xl font-semibold">John Doe</h1>
    <div className="text-xs sm:text-sm mt-1 flex flex-wrap justify-center gap-1 sm:gap-2">
      <span>john.doe@email.com</span>
      <span className="hidden sm:inline">•</span>
      <span>(123) 456-7890</span>
      <span className="hidden sm:inline">•</span>
      <span>New York, NY</span>
      <span className="hidden sm:inline">•</span>
      <span><a href="https://linkedin.com/in/johndoe" className="text-blue-600">linkedin.com/in/johndoe</a></span>
    </div>
  </div>
);

const ResumeOverview = ({ skills }) => (
  <div className="resume-section">
    <h2 className="resume-section-title">EDUCATION & SKILLS</h2>
    <div>
      <p className="font-medium">Stanford University, M.S. Computer Science</p>
      <p className="text-xs sm:text-sm flex justify-between">
        <span>GPA: 3.9/4.0</span>
        <span>2019 - 2021</span>
      </p>
      
      <div className="mt-2">
        <p className="font-medium">Technical Skills:</p>
        <div className="mt-1 mb-2 flex flex-wrap">
          {skills?.map((skill, index) => (
            <span key={index} className="chip">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Project = ({ title, role, dateRange, achievements }) => (
  <div className="mb-4">
    <div className="flex flex-col sm:flex-row sm:justify-between">
      <p className="font-medium">{title}</p>
      <p className="text-xs sm:text-sm text-gray-600">{dateRange}</p>
    </div>
    <p className="text-xs sm:text-sm text-gray-600 italic">{role}</p>
    <ul className="list-disc ml-5 mt-1 text-xs sm:text-sm">
      {achievements.map((achievement, index) => (
        <li key={index}>{achievement}</li>
      ))}
    </ul>
  </div>
);

const WorkExperience = ({ company, role, dateRange, achievements }) => (
  <div className="mb-4">
    <div className="flex flex-col sm:flex-row sm:justify-between">
      <p className="font-medium">{company}</p>
      <p className="text-xs sm:text-sm text-gray-600">{dateRange}</p>
    </div>
    <p className="text-xs sm:text-sm text-gray-600 italic">{role}</p>
    <ul className="list-disc ml-5 mt-1 text-xs sm:text-sm">
      {achievements.map((achievement, index) => (
        <li key={index}>{achievement}</li>
      ))}
    </ul>
  </div>
);

const WorkExperienceModal = ({ isOpen, onClose, additionalExperiences }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content p-5" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close" onClick={onClose}>×</div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Additional Work Experience</h2>
        {additionalExperiences.map((exp, index) => (
          <WorkExperience key={index} {...exp}/>
        ))}
      </div>
    </div>
  );
};

const ResumeWorkExperience = ({ experiences }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!experiences) return null;

  const mainExperiences = experiences.map(exp => ({
    company: exp.company,
    role: exp.role,
    dateRange: exp.dateRange,
    achievements: Array.isArray(exp.achievements) ? exp.achievements : []
  }));

  return (
    <div className="resume-section">
      <h2 className="resume-section-title">WORK EXPERIENCE</h2>
      {mainExperiences.map((exp, index) => (
        <WorkExperience key={index} {...exp} />
      ))}
    </div>
  );
};

const Leadership = ({ title, role, dateRange, achievements }) => (
  <div className="mb-4">
    <div className="flex flex-col sm:flex-row sm:justify-between">
      <p className="font-medium">{title}</p>
      <p className="text-xs sm:text-sm text-gray-600">{dateRange}</p>
    </div>
    <p className="text-xs sm:text-sm text-gray-600 italic">{role}</p>
    <ul className="list-disc ml-5 mt-1 text-xs sm:text-sm">
      {achievements.map((achievement, index) => (
        <li key={index}>{achievement}</li>
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
    <ul className="text-sm list-disc ml-5">
      {hobbies?.map((hobby, index) => (
        <li key={index}>{hobby}</li>
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
        const response = await fetch(`/api/resume/${versionId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || `Failed to load resume (${response.status})`);
        }
        
        if (!data || Object.keys(data).length === 0) {
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
        <ResumeWorkExperience experiences={resumeData.experiences} />
        <ResumeLeadership leadership={resumeData.leadership} />
        <ResumeBeyondWork hobbies={resumeData.hobbies} />
      </div>
    </div>
  );
}
