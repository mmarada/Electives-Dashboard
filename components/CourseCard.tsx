
import React, { useState, useEffect } from 'react';
import { Course, Review } from '../types';
import { ChevronDown, ChevronUp, Clock, MapPin, Calendar, BookOpen, GraduationCap, Mail, Info, FileText, CheckCircle, Book, Star, Layers, FileImage, FileInput, ExternalLink } from 'lucide-react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import { courseDetails } from '../data';
import { supabase } from '../supabaseClient';

interface CourseCardProps {
  course: Course;
  reviews: Review[];
  onReviewSubmitted?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, reviews, onReviewSubmitted }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'reviews'>('overview');

  // Filter reviews to match this specific course context better if it's a generic ID
  // For special topics (like ENTRE 579), we try to match the title or instructor if possible
  const filteredReviews = reviews.filter(r => {
    // Exact code match required
    if (r.courseId !== course.code && r.courseId !== course.code.split('/')[0]) return false;
    
    // If it's a generic code like 579, try to match context or professor
    const isSpecialTopic = course.code.includes('579') || course.code.includes('557');
    if (isSpecialTopic) {
        // If the review has a context title, it must match the course title (fuzzy)
        if (r.courseTitleContext) {
            return course.title.toLowerCase().includes(r.courseTitleContext.toLowerCase()) || 
                   r.courseTitleContext.toLowerCase().includes(course.title.toLowerCase());
        }
        // Fallback: match professor last name
        const instructorLastName = course.instructor.split(' ').pop() || "";
        return r.professor.includes(instructorLastName);
    }
    return true;
  });

  const hasReviews = filteredReviews.length > 0;
  const description = course.syllabus?.description || courseDetails[course.code] || "No detailed description available. Please contact the instructor for the latest syllabus.";

  // Prepare email content
  const emailSubject = `Registration Inquiry: ${course.code} - ${course.title} (SLN ${course.sln})`;
  const emailBody = `Hi,\n\nI am interested in registering for the following course:\n\nCourse: ${course.code} - ${course.title}\nSLN: ${course.sln}\nQuarter: ${course.quarter}\n\nCould you please provide the registration code required to sign up for this course?\n\nThanks,\n[Your Name]`;
  const mailtoLink = `mailto:mbaregis@uw.edu?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  // Determine link type and icon
  const getLinkInfo = (link?: string) => {
    if (!link) return { text: "Syllabus N/A", icon: FileText };
    const lowerLink = link.toLowerCase();
    if (lowerLink.includes('flyer')) return { text: "View Flyer", icon: FileImage };
    if (lowerLink.includes('application')) return { text: "View Application", icon: FileInput };
    return { text: "View Syllabus PDF", icon: FileText };
  };

  const linkInfo = getLinkInfo(course.syllabusLink);
  const LinkIcon = linkInfo.icon;

  return (
    <div className={`bg-white rounded-xl border transition-all duration-300 ${isExpanded ? 'border-purple-200 shadow-lg ring-1 ring-purple-100' : hasReviews ? 'border-amber-200 hover:border-purple-200 hover:shadow-md' : 'border-gray-200 hover:border-purple-200 hover:shadow-md'}`}>
      {/* Card Header / Summary */}
      <div 
        className="p-4 sm:p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                {course.code}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <Layers className="w-3 h-3 mr-1" />
                {course.quarter}
              </span>
              {course.sln !== "N/A" && (
                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    SLN: {course.sln}
                </span>
              )}
              {course.info && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {course.info}
                </span>
              )}
              {hasReviews && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 animate-in fade-in duration-500">
                  <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
                  {filteredReviews.length} Review{filteredReviews.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight pr-4 break-words">
              {course.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{course.instructor}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <span>{course.credits} Credits</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col flex-wrap gap-2 sm:gap-1 mt-1 sm:mt-0 w-full sm:w-auto items-center sm:items-end justify-start sm:justify-end text-left sm:text-right">
             <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 whitespace-nowrap">
                <Calendar className="w-4 h-4 text-purple-500" />
                {course.days}
             </div>
             <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {course.time}
             </div>
             <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                {course.room}
             </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center">
            {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-300" />
            ) : (
                <ChevronDown className="w-5 h-5 text-gray-300" />
            )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 rounded-b-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white overflow-x-auto">
             <button 
               className={`flex-1 min-w-[80px] py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap px-2 ${activeTab === 'overview' ? 'border-purple-500 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               onClick={() => setActiveTab('overview')}
             >
               Overview
             </button>
             <button 
               className={`flex-1 min-w-[100px] py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap px-2 ${activeTab === 'syllabus' ? 'border-purple-500 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               onClick={() => setActiveTab('syllabus')}
             >
               Syllabus & Grading
             </button>
             <button 
               className={`flex-1 min-w-[80px] py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap px-2 ${activeTab === 'reviews' ? 'border-purple-500 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               onClick={() => setActiveTab('reviews')}
             >
               Reviews ({filteredReviews.length})
             </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    Course Description
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                  </p>
                </div>

                {course.syllabus?.learningObjectives && course.syllabus.learningObjectives.length > 0 && (
                   <div>
                     <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                       <CheckCircle className="w-4 h-4 text-purple-600" />
                       Key Concepts
                     </h4>
                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                       {course.syllabus.learningObjectives.map((obj, i) => (
                         <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                           <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                           {obj}
                         </li>
                       ))}
                     </ul>
                   </div>
                )}
                
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  {course.syllabusLink ? (
                    <a 
                      href={course.syllabusLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors group"
                    >
                      {linkInfo.text}
                      <LinkIcon className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                    </a>
                  ) : (
                    <button 
                      disabled
                      className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
                    >
                      {linkInfo.text}
                      <LinkIcon className="w-4 h-4 ml-2" />
                    </button>
                  )}

                  {course.courseCatalogLink && (
                    <a 
                      href={course.courseCatalogLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors group"
                    >
                      UW Catalog
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                  
                  <a 
                    href={mailtoLink}
                    className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-900 hover:bg-purple-800 rounded-lg shadow-sm transition-all hover:shadow-purple-900/20 group"
                  >
                    Email Registration
                    <Mail className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'syllabus' && (
              <div className="space-y-6">
                {course.syllabus?.grading && course.syllabus.grading.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-purple-600" />
                      Grading Criteria
                    </h4>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {course.syllabus.grading.map((item, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-6 py-3 text-sm text-gray-900">{item.item}</td>
                              <td className="px-6 py-3 text-sm text-gray-900 text-right font-medium">{item.weight}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    Detailed grading information not available for this specific section.
                  </div>
                )}

                {course.syllabus?.books && course.syllabus.books.length > 0 && (
                   <div>
                     <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                       <Book className="w-4 h-4 text-purple-600" />
                       Required Materials
                     </h4>
                     <ul className="space-y-2">
                       {course.syllabus.books.map((book, i) => (
                         <li key={i} className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                           {book}
                         </li>
                       ))}
                     </ul>
                   </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
               <>
                 <ReviewList reviews={filteredReviews} />
                 <ReviewForm 
                   courseId={course.code} 
                   courseTitle={course.title} 
                   defaultProfessor={course.instructor}
                   onReviewSubmitted={onReviewSubmitted}
                 />
               </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
