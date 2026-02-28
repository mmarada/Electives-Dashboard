import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Course } from '../types';
import { CheckCircle, AlertCircle, Loader2, BarChart2, X, Vote } from 'lucide-react';
import PollResults from './PollResults';

interface SpringPollProps {
  courses: Course[];
  isOpen: boolean;
  onClose: () => void;
}

const SpringPoll: React.FC<SpringPollProps> = ({ courses, isOpen, onClose }) => {
  const [springCourses, setSpringCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [studentName, setStudentName] = useState('');
  const [mbaYear, setMbaYear] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Filter for Spring quarter courses
    const spring = courses.filter(c => c.quarter.toLowerCase().includes('spring'));
    
    // Deduplicate by code to prevent React key errors and UI confusion
    // We use a Map to keep the first occurrence of each course code
    const uniqueSpring = Array.from(new Map(spring.map(item => [item.code, item])).values());
    
    setSpringCourses(uniqueSpring);
    
    // Check if user has already voted (using localStorage for simple prevention)
    const voted = localStorage.getItem('hasVotedSpring2025');
    if (voted) {
      setHasVoted(true);
      setShowResults(true);
    }
  }, [courses]);

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleCourse = (courseId: string, credits: number) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(prev => prev.filter(id => id !== courseId));
    } else {
      const currentCredits = selectedCourses.reduce((acc, id) => {
        const course = springCourses.find(c => c.code === id);
        return acc + (course ? parseInt(course.credits.toString()) : 0);
      }, 0);

      if (currentCredits + credits > 8) {
        setError("You can only select up to 8 credits.");
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      setSelectedCourses(prev => [...prev, courseId]);
    }
  };

  const totalCredits = selectedCourses.reduce((acc, id) => {
    const course = springCourses.find(c => c.code === id);
    return acc + (course ? parseInt(course.credits.toString()) : 0);
  }, 0);

  const handleSubmit = async () => {
    if (selectedCourses.length === 0) {
      setError("Please select at least one course.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!supabase) throw new Error("Supabase client not initialized");

      const votes = selectedCourses.map(courseId => ({
        course_id: courseId,
        student_name: studentName || null,
        mba_year: mbaYear || null
      }));

      const { error } = await supabase
        .from('votes')
        .insert(votes);

      if (error) throw error;

      localStorage.setItem('hasVotedSpring2025', 'true');
      setHasVoted(true);
      setShowResults(true);
    } catch (err: any) {
      console.error('Error submitting votes:', err);
      setError(err.message || "Failed to submit votes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 sm:p-6 text-white shrink-0 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center justify-center z-10"
            aria-label="Close poll"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
          </button>
          
          <div className="flex items-center justify-between mb-2 pr-10">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              {showResults ? <BarChart2 className="w-5 h-5" /> : <Vote className="w-5 h-5" />}
              {showResults ? 'Poll Results' : 'Spring Electives Poll'}
            </h2>
          </div>
          <p className="text-purple-100 text-xs sm:text-sm leading-relaxed pr-8">
            {showResults 
              ? "See what your peers are taking this Spring!" 
              : "Vote for the courses you took (or plan to take) this Spring!"}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {showResults ? (
            <>
              <PollResults courses={springCourses} />
              <div className="mt-8 text-center border-t border-gray-100 pt-6">
                <button 
                  onClick={() => setShowResults(false)}
                  className="text-sm text-gray-500 hover:text-purple-600 underline"
                >
                  Back to Poll (View Only)
                </button>
              </div>
            </>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200 flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                {springCourses.map(course => {
                  const isSelected = selectedCourses.includes(course.code);
                  const credits = parseInt(course.credits.toString());
                  
                  return (
                    <div 
                      key={course.code}
                      onClick={() => !hasVoted && toggleCourse(course.code, credits)}
                      className={`
                        relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-between gap-3
                        ${isSelected 
                          ? 'border-purple-500 bg-purple-50 shadow-sm' 
                          : 'border-gray-100 hover:border-purple-200 hover:bg-gray-50'
                        }
                        ${hasVoted ? 'opacity-60 cursor-default' : ''}
                      `}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-gray-900 text-xs">{course.code}</span>
                          <span className="text-[10px] font-medium bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-md">
                            {credits} Cr
                          </span>
                        </div>
                        <h3 className="text-xs text-gray-700 font-medium leading-tight truncate">
                          {course.title}
                        </h3>
                      </div>
                      
                      <div className="shrink-0 flex items-center justify-center w-5 h-5">
                        {isSelected ? (
                          <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions (Only show when voting) */}
        {!showResults && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
            <div className="flex flex-col gap-4">
              <div className="space-y-4 mb-6 pt-2">
                <div>
                  <label htmlFor="studentName" className="block text-sm font-bold text-gray-700 mb-1.5">
                    Your Name <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all bg-gray-50/50 hover:bg-white text-sm"
                    placeholder="e.g. Jane Doe"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="mbaYear" className="block text-sm font-bold text-gray-700 mb-1.5">
                    MBA Class Year <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                  </label>
                  <select
                    id="mbaYear"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all bg-gray-50/50 hover:bg-white text-sm cursor-pointer appearance-none"
                    value={mbaYear}
                    onChange={(e) => setMbaYear(e.target.value)}
                  >
                    <option value="">Select Year...</option>
                    <option value="2025">Class of 2025</option>
                    <option value="2026">Class of 2026</option>
                    <option value="2027">Class of 2027</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {hasVoted ? (
                 <button
                  onClick={() => setShowResults(true)}
                  className="w-full px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  View Results
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || totalCredits === 0}
                  className={`
                    w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-md 
                    hover:bg-purple-700 hover:shadow-lg hover:-translate-y-0.5 transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    flex items-center justify-center gap-2
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Vote'
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpringPoll;
