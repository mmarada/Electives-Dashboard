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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Filter for Spring quarter courses
    const spring = courses.filter(c => c.quarter.toLowerCase().includes('spring'));
    setSpringCourses(spring);
    
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
        course_id: courseId
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
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {showResults ? <BarChart2 className="w-5 h-5" /> : <Vote className="w-5 h-5" />}
              {showResults ? 'Poll Results' : 'Spring Electives Poll'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors -mr-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-purple-100 text-sm leading-relaxed">
            {showResults 
              ? "See what your peers are taking this Spring!" 
              : "Vote for the courses you took (or plan to take) this Spring! (Max 8 credits)"}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
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

              <div className="space-y-3">
                {springCourses.map(course => {
                  const isSelected = selectedCourses.includes(course.code);
                  const credits = parseInt(course.credits.toString());
                  
                  return (
                    <div 
                      key={course.code}
                      onClick={() => !hasVoted && toggleCourse(course.code, credits)}
                      className={`
                        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? 'border-purple-500 bg-purple-50 shadow-md' 
                          : 'border-gray-100 hover:border-purple-200 hover:bg-gray-50'
                        }
                        ${hasVoted ? 'opacity-60 cursor-default' : ''}
                      `}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-gray-900 text-sm">{course.code}</span>
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {credits} Cr
                        </span>
                      </div>
                      <h3 className="text-sm text-gray-700 font-medium leading-tight line-clamp-2 mb-2">
                        {course.title}
                      </h3>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="truncate">{course.instructor}</span>
                      </div>
                      
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
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
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-600">Selected Credits:</span>
                <span className={`font-bold text-lg ${totalCredits > 8 ? 'text-red-600' : 'text-purple-600'}`}>
                  {totalCredits} <span className="text-gray-400 text-sm font-normal">/ 8</span>
                </span>
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
