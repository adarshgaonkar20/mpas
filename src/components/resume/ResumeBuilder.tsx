import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { requestResumeBulletEnhancement } from '../../services/api';
import {
  FileText,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  Eye,
  Edit3,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

export const ResumeBuilder: React.FC = () => {
  const { resumeData, updateResumeData, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [activeSection, setActiveSection] = useState<'personal' | 'education' | 'skills' | 'projects' | 'experience' | 'achievements'>('projects');

  // AI Enhancer state
  const [selectedBullet, setSelectedBullet] = useState<{ projectId: string; bulletIdx: number } | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [enhancedSuggestions, setEnhancedSuggestions] = useState<string[]>([]);
  const [showEnhanceModal, setShowEnhanceModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleTriggerEnhance = async (projectId: string, bulletIdx: number, text: string) => {
    setSelectedBullet({ projectId, bulletIdx });
    setEnhancing(true);
    setShowEnhanceModal(true);

    try {
      const res = await requestResumeBulletEnhancement(text, 'Software Development Engineer');
      if (res.suggestions && Array.isArray(res.suggestions)) {
        setEnhancedSuggestions(res.suggestions);
      } else if (res.enhancedText) {
        // Split markdown lines if needed
        const lines = res.enhancedText
          .split('\n')
          .filter((l: string) => l.trim().length > 10)
          .map((l: string) => l.replace(/^[-*•\d.]+\s*/, '').replace(/^"|"$/g, ''));
        setEnhancedSuggestions(lines.slice(0, 3));
      }
    } catch (err: any) {
      showToast(err.message || 'Enhancement failed', 'error');
      setShowEnhanceModal(false);
    } finally {
      setEnhancing(false);
    }
  };

  const applyEnhancedBullet = (enhancedText: string) => {
    if (!selectedBullet) return;
    const { projectId, bulletIdx } = selectedBullet;

    const updatedProjects = resumeData.projects.map((p) => {
      if (p.id === projectId) {
        const newBullets = [...p.bullets];
        newBullets[bulletIdx] = enhancedText;
        return { ...p, bullets: newBullets };
      }
      return p;
    });

    updateResumeData({ projects: updatedProjects });
    setShowEnhanceModal(false);
    showToast('Applied ATS-optimized bullet point!', 'success');
  };

  // Add project handler
  const handleAddProject = () => {
    const newProj = {
      id: 'p_' + Date.now(),
      title: 'Real-Time Collaborative Code Editor',
      technologies: 'React, WebSockets, Node.js, Monaco Editor',
      link: 'github.com/student/collab-editor',
      bullets: [
        'Built full-duplex WebSocket synchronization layer supporting concurrent editing across 20+ active rooms.',
        'Engineered operational transformation (OT) algorithm to resolve syntax collision conflicts seamlessly.',
      ],
    };
    updateResumeData({ projects: [...resumeData.projects, newProj] });
    showToast('New project block added', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Switcher & PDF Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <FileText className="w-4 h-4" />
            <span>ATS Resume Builder</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            Recruiter-Approved ATS Engineering Resume
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Single-column, high-parser-score layout with AI Google XYZ bullet point optimizer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Editor / Preview view toggle */}
          <div className="flex items-center p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'editor'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'preview'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Split or Toggled View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Editor (5 cols on large screen if preview visible, or full when editor tab) */}
        <div
          className={`${
            activeTab === 'editor' ? 'lg:col-span-6' : 'hidden lg:block lg:col-span-5'
          } space-y-4 no-print`}
        >
          {/* Section sub-tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'personal', label: 'Personal' },
              { id: 'education', label: 'Education' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'experience', label: 'Experience' },
              { id: 'achievements', label: 'Honors' },
            ].map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeSection === sec.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            {/* Section 1: Personal Details */}
            {activeSection === 'personal' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Contact & Identification
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) =>
                        updateResumeData({
                          personalInfo: { ...resumeData.personalInfo, fullName: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) =>
                        updateResumeData({
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 mb-1">Phone</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) =>
                        updateResumeData({
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 mb-1">Location</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) =>
                        updateResumeData({
                          personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) =>
                        updateResumeData({
                          personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.github}
                      onChange={(e) =>
                        updateResumeData({
                          personalInfo: { ...resumeData.personalInfo, github: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Education */}
            {activeSection === 'education' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Degree & Academic History
                </h3>
                {resumeData.education.map((edu, idx) => (
                  <div key={edu.id} className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg space-y-2 text-xs">
                    <div>
                      <label className="block text-[11px] text-neutral-500 mb-1">College / University</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[idx].institution = e.target.value;
                          updateResumeData({ education: updated });
                        }}
                        className="w-full px-2 py-1 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-neutral-500 mb-1">Degree & Major</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[idx].degree = e.target.value;
                            updateResumeData({ education: updated });
                          }}
                          className="w-full px-2 py-1 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-500 mb-1">CGPA / Percentage</label>
                        <input
                          type="text"
                          value={edu.cgpa}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[idx].cgpa = e.target.value;
                            updateResumeData({ education: updated });
                          }}
                          className="w-full px-2 py-1 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Section 3: Technical Skills */}
            {activeSection === 'skills' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Technical Competencies
                </h3>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">Programming Languages</label>
                  <input
                    type="text"
                    value={resumeData.skills.languages}
                    onChange={(e) =>
                      updateResumeData({
                        skills: { ...resumeData.skills, languages: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">Frameworks & Libraries</label>
                  <input
                    type="text"
                    value={resumeData.skills.frameworks}
                    onChange={(e) =>
                      updateResumeData({
                        skills: { ...resumeData.skills, frameworks: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">Developer Tools & Cloud</label>
                  <input
                    type="text"
                    value={resumeData.skills.tools}
                    onChange={(e) =>
                      updateResumeData({
                        skills: { ...resumeData.skills, tools: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">Core CS Foundations</label>
                  <input
                    type="text"
                    value={resumeData.skills.coreConcepts}
                    onChange={(e) =>
                      updateResumeData({
                        skills: { ...resumeData.skills, coreConcepts: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Section 4: Projects (with AI Bullet Enhancer) */}
            {activeSection === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Engineering Projects ({resumeData.projects.length})
                  </h3>
                  <button
                    onClick={handleAddProject}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {resumeData.projects.map((proj, pIdx) => (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50/50 dark:bg-neutral-800/50 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[pIdx].title = e.target.value;
                          updateResumeData({ projects: updated });
                        }}
                        className="font-semibold text-xs bg-white dark:bg-neutral-700 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-600 flex-1 text-neutral-900 dark:text-white"
                        placeholder="Project Name"
                      />
                      <button
                        onClick={() => {
                          const updated = resumeData.projects.filter((p) => p.id !== proj.id);
                          updateResumeData({ projects: updated });
                        }}
                        className="text-neutral-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={proj.technologies}
                      onChange={(e) => {
                        const updated = [...resumeData.projects];
                        updated[pIdx].technologies = e.target.value;
                        updateResumeData({ projects: updated });
                      }}
                      className="w-full text-[11px] bg-white dark:bg-neutral-700 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
                      placeholder="Tech Stack (e.g. React, Node.js, PostgreSQL)"
                    />

                    {/* Bullet Points */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase">
                        Impact Bullet Points:
                      </div>
                      {proj.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="space-y-1">
                          <div className="flex items-start gap-1.5">
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => {
                                const updated = [...resumeData.projects];
                                updated[pIdx].bullets[bIdx] = e.target.value;
                                updateResumeData({ projects: updated });
                              }}
                              className="w-full text-xs p-1.5 bg-white dark:bg-neutral-700 rounded border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white resize-none"
                            />
                            <button
                              onClick={() => handleTriggerEnhance(proj.id, bIdx, bullet)}
                              className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-200 dark:border-indigo-800 shrink-0 text-[10px] font-medium flex items-center gap-1"
                              title="Optimize bullet with Google XYZ framework"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span className="hidden sm:inline">AI Polish</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Section 5: Experience */}
            {activeSection === 'experience' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Internships & Work Experience
                </h3>
                {resumeData.experience.map((exp, expIdx) => (
                  <div key={exp.id} className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[expIdx].role = e.target.value;
                          updateResumeData({ experience: updated });
                        }}
                        className="px-2 py-1 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded text-neutral-900 dark:text-white"
                        placeholder="Role / Title"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[expIdx].company = e.target.value;
                          updateResumeData({ experience: updated });
                        }}
                        className="px-2 py-1 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded text-neutral-900 dark:text-white"
                        placeholder="Company"
                      />
                    </div>
                    {exp.bullets.map((b, bIdx) => (
                      <textarea
                        key={bIdx}
                        rows={2}
                        value={b}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[expIdx].bullets[bIdx] = e.target.value;
                          updateResumeData({ experience: updated });
                        }}
                        className="w-full px-2 py-1 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded text-neutral-900 dark:text-white resize-none"
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Section 6: Achievements */}
            {activeSection === 'achievements' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Honors, Certifications & Achievements
                </h3>
                {resumeData.achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ach}
                      onChange={(e) => {
                        const updated = [...resumeData.achievements];
                        updated[idx] = e.target.value;
                        updateResumeData({ achievements: updated });
                      }}
                      className="w-full text-xs px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: ATS Resume Real-Time Document Preview (White Page format) */}
        <div
          className={`${
            activeTab === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7'
          } print-container`}
        >
          <div className="bg-white text-neutral-900 p-8 sm:p-10 rounded-xl shadow-md border border-neutral-200 print:shadow-none print:border-none print:p-0 font-serif leading-normal select-text">
            {/* Header: Name and Contact info */}
            <div className="text-center border-b border-neutral-300 pb-3 mb-4">
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide font-sans">
                {resumeData.personalInfo.fullName}
              </h1>
              <div className="text-xs text-neutral-700 mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-sans">
                <span>{resumeData.personalInfo.email}</span>
                <span>|</span>
                <span>{resumeData.personalInfo.phone}</span>
                <span>|</span>
                <span>{resumeData.personalInfo.location}</span>
                <span>|</span>
                <span className="text-blue-700 font-medium">{resumeData.personalInfo.linkedin}</span>
                <span>|</span>
                <span className="text-blue-700 font-medium">{resumeData.personalInfo.github}</span>
              </div>
            </div>

            {/* Education */}
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-900 pb-0.5 mb-1.5 font-sans">
                Education
              </h2>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="text-xs space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span>{edu.institution}</span>
                    <span className="font-normal tabular-nums">{edu.startYear} – {edu.endYear}</span>
                  </div>
                  <div className="flex justify-between text-neutral-800">
                    <span>{edu.degree} — {edu.field}</span>
                    <span className="font-semibold tabular-nums">CGPA: {edu.cgpa}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Technical Skills */}
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-900 pb-0.5 mb-1.5 font-sans">
                Technical Skills
              </h2>
              <div className="text-xs space-y-1">
                <div>
                  <span className="font-bold">Languages: </span>
                  <span className="text-neutral-800">{resumeData.skills.languages}</span>
                </div>
                <div>
                  <span className="font-bold">Frameworks & Libraries: </span>
                  <span className="text-neutral-800">{resumeData.skills.frameworks}</span>
                </div>
                <div>
                  <span className="font-bold">Developer Tools: </span>
                  <span className="text-neutral-800">{resumeData.skills.tools}</span>
                </div>
                <div>
                  <span className="font-bold">Core CS: </span>
                  <span className="text-neutral-800">{resumeData.skills.coreConcepts}</span>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-900 pb-0.5 mb-1.5 font-sans">
                Technical Projects
              </h2>
              <div className="space-y-3">
                {resumeData.projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between font-bold">
                      <span>
                        {proj.title} <span className="font-normal italic text-neutral-700">| {proj.technologies}</span>
                      </span>
                      {proj.link && <span className="font-normal text-blue-700">{proj.link}</span>}
                    </div>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-neutral-800">
                      {proj.bullets.map((bullet, idx) => (
                        <li key={idx} className="leading-snug">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-900 pb-0.5 mb-1.5 font-sans">
                Experience & Internships
              </h2>
              <div className="space-y-2.5">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between font-bold">
                      <span>
                        {exp.role} <span className="font-normal italic text-neutral-700">| {exp.company}</span>
                      </span>
                      <span className="font-normal tabular-nums">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-neutral-800">
                      {exp.bullets.map((b, idx) => (
                        <li key={idx} className="leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-900 pb-0.5 mb-1.5 font-sans">
                Achievements & Leadership
              </h2>
              <ul className="list-disc pl-4 mt-1 space-y-0.5 text-xs text-neutral-800">
                {resumeData.achievements.map((ach, idx) => (
                  <li key={idx} className="leading-snug">
                    {ach}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* AI Bullet Polish Modal */}
      {showEnhanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs no-print">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Google XYZ Bullet Point Optimizer
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Select an ATS-optimized bullet with action verb + measurable impact
                </p>
              </div>
            </div>

            {enhancing ? (
              <div className="py-8 text-center space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                <p className="text-xs text-neutral-500">Optimizing metrics and technical verbs...</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {enhancedSuggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    onClick={() => applyEnhancedBullet(sug)}
                    className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-neutral-50 dark:bg-neutral-800/60 cursor-pointer text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed transition-all group flex items-start gap-2.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 font-sans">{sug}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowEnhanceModal(false)}
                className="px-4 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
