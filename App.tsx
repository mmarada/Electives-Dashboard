
import React, { useState, useMemo, useEffect } from 'react';
import { courses as staticCourses, reviews as staticReviews } from './data';
import CourseCard from './components/CourseCard';
import { Search, Filter, CalendarDays, GraduationCap, Mail, Layers, Database, Vote } from 'lucide-react';
import { DayFilter, Course, Review } from './types';
import { supabase } from './supabaseClient';
import { seedDatabase } from './seedData';

import SpringPoll from './components/SpringPoll';

function App() {
  const [courses, setCourses] = useState<Course[]>(staticCourses);
  const [reviews, setReviews] = useState<Review[]>(staticReviews);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState<DayFilter>('All');
  const [instructorFilter, setInstructorFilter] = useState('All');
  const [quarterFilter, setQuarterFilter] = useState('Spring 2026');
  const [isPollOpen, setIsPollOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch Courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');

      if (coursesError) throw coursesError;

      // Fetch Reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*');

      if (reviewsError) throw reviewsError;

      if (coursesData && coursesData.length > 0) {
        const mappedCourses: Course[] = coursesData.map((c: any) => ({
          sln: c.sln,
          code: c.code,
          section: c.section,
          title: c.title,
          credits: c.credits,
          instructor: c.instructor,
          room: c.room,
          days: c.days,
          time: c.time,
          quarter: c.quarter,
          info: c.info,
          syllabusLink: c.syllabus_link,
          courseCatalogLink: c.course_catalog_link,
          syllabus: c.syllabus
        }));
        setCourses(mappedCourses);
      }

      if (reviewsData && reviewsData.length > 0) {
        const mappedReviews: Review[] = reviewsData.map((r: any) => ({
          id: r.id,
          courseId: r.course_id,
          courseTitleContext: r.course_title_context,
          professor: r.professor,
          year: r.year,
          content: r.content,
          author: r.author
        }));
        setReviews(mappedReviews);
      }

    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm('This will populate the database with initial data. Continue?')) return;
    
    setSeeding(true);
    const result = await seedDatabase();
    setSeeding(false);
    
    if (result.success) {
      alert(result.message);
      fetchData(); // Refresh data
    } else {
      alert('Error: ' + result.message);
    }
  };

  // Derive unique instructors for filter
  const instructors = useMemo(() => {
    const list = Array.from(new Set(courses.map(c => c.instructor)));
    return ['All', ...list.sort()];
  }, [courses]);

  // Derive unique quarters for filter
  const quarters = useMemo(() => {
    const list = Array.from(new Set(courses.map(c => c.quarter)));
    return ['All', ...list.sort().reverse()]; // Reverse to likely put Spring 2026 first if formatted conveniently, or just sort
  }, [courses]);

  // Filter Logic
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.sln.includes(searchQuery) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDay = 
      dayFilter === 'All' ? true :
      dayFilter === 'Evening' ? (['5:', '6:', '7:'].some(prefix => course.time.startsWith(prefix))) : 
      course.days.includes(dayFilter.split('/')[0]); // "Mon" matches "Mon/Wed"

    const matchesInstructor = 
      instructorFilter === 'All' ? true : course.instructor === instructorFilter;

    const matchesQuarter = 
      quarterFilter === 'All' ? true : course.quarter === quarterFilter;

    return matchesSearch && matchesDay && matchesInstructor && matchesQuarter;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Background Gradient Blob */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[100px]" />
      </div>

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 border-b border-gray-200/80 shadow-sm backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-9 h-9 bg-gradient-to-br from-purple-900 to-indigo-800 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform duration-300">
                F
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-gray-900 leading-none tracking-tight group-hover:text-purple-900 transition-colors">MBA Electives</h1>
                <span className="text-[10px] sm:text-xs text-purple-700 font-medium tracking-wide uppercase">Foster School of Business</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <a 
                 href="mailto:mbaregis@uw.edu" 
                 className="hidden md:flex text-sm text-gray-500 hover:text-purple-700 font-medium items-center gap-2 transition-all hover:bg-purple-50 px-3 py-1.5 rounded-lg"
               >
                 <Mail className="w-4 h-4" />
                 mbaregis@uw.edu
               </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Course Dashboard
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto sm:mx-0 leading-relaxed">
            Explore available electives across quarters. View schedules, download syllabi, and read peer reviews to make informed decisions.
          </p>
          
          <div className="mt-6 flex justify-center sm:justify-start">
            {/* Old button removed */}
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white/70 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/50 shadow-xl shadow-gray-200/50 mb-8 sticky top-20 z-40 transition-all duration-300">
          <div className="flex flex-col gap-4">
            
            {/* Search */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-purple-500" />
              </div>
              <input
                type="text"
                placeholder="Search by course, SLN, or professor..."
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              
              {/* Quarter Filter */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Layers className="h-4 w-4 text-gray-500 group-hover:text-purple-600 transition-colors" />
                </div>
                <select
                  value={quarterFilter}
                  onChange={(e) => setQuarterFilter(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer hover:border-purple-300 hover:shadow-sm transition-all font-medium text-gray-700"
                >
                  <option value="All">All Quarters</option>
                  {quarters.filter(q => q !== 'All').map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <Filter className="h-3 w-3 text-gray-400" />
                </div>
              </div>

              {/* Day Filter */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <CalendarDays className="h-4 w-4 text-gray-500 group-hover:text-purple-600 transition-colors" />
                </div>
                <select
                  value={dayFilter}
                  onChange={(e) => setDayFilter(e.target.value as DayFilter)}
                  className="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer hover:border-purple-300 hover:shadow-sm transition-all font-medium text-gray-700"
                >
                  <option value="All">All Days</option>
                  <option value="Mon/Wed">Mon/Wed</option>
                  <option value="Tue/Thu">Tue/Thu</option>
                  <option value="Evening">Evening (5pm+)</option>
                  <option value="Friday">Friday</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <Filter className="h-3 w-3 text-gray-400" />
                </div>
              </div>

              {/* Instructor Filter */}
              <div className="relative group sm:col-span-2 lg:col-span-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <GraduationCap className="h-4 w-4 text-gray-500 group-hover:text-purple-600 transition-colors" />
                </div>
                <select
                  value={instructorFilter}
                  onChange={(e) => setInstructorFilter(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer hover:border-purple-300 hover:shadow-sm transition-all font-medium text-gray-700"
                >
                  <option value="All">All Instructors</option>
                  {instructors.filter(i => i !== 'All').map(instructor => (
                    <option key={instructor} value={instructor}>{instructor}</option>
                  ))}
                </select>
                 <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <Filter className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spring Poll Section */}
        <SpringPoll courses={courses} isOpen={isPollOpen} onClose={() => setIsPollOpen(false)} />

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6 px-2">
          <span className="text-sm font-semibold text-gray-500 bg-white/50 px-3 py-1 rounded-full border border-gray-100 shadow-sm">
            Showing {filteredCourses.length} courses
          </span>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-purple-600 font-medium animate-pulse">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              Loading data...
            </div>
          )}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <CourseCard 
                key={`${course.quarter}-${course.sln}-${course.code}-${index}`} 
                course={course} 
                reviews={reviews} 
                onReviewSubmitted={fetchData}
              />
            ))
          ) : (
            <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 shadow-sm">
              <div className="mx-auto h-16 w-16 text-purple-200 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="mt-2 text-lg font-bold text-gray-900">No courses found</h3>
              <p className="mt-1 text-gray-500 max-w-xs mx-auto">We couldn't find any courses matching your current filters.</p>
              <button 
                onClick={() => {
                  setSearchQuery(''); 
                  setDayFilter('All'); 
                  setInstructorFilter('All');
                  setQuarterFilter('All');
                }}
                className="mt-6 inline-flex items-center px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-gray-200 mt-20 py-12">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                <span className="font-bold text-lg">F</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">
              &copy; {new Date().getFullYear()} Foster School of Business
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Created by Mohan Marada, FT MBA '27
            </p>
            
            {supabase && (
              <div className="mt-8">
                <button 
                  onClick={handleSeed}
                  disabled={seeding}
                  className="text-xs text-gray-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-1.5 mx-auto px-3 py-1.5 rounded-full hover:bg-purple-50"
                >
                  <Database className="w-3 h-3" />
                  {seeding ? 'Seeding Database...' : 'Reset Database Data'}
                </button>
              </div>
            )}
         </div>
      </footer>

      {/* Floating Vote Button - High Visibility */}
      <button
        onClick={() => setIsPollOpen(true)}
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-gray-900 text-white pl-5 pr-2 py-2 rounded-full shadow-2xl shadow-purple-900/40 hover:shadow-purple-700/50 transition-all duration-300 hover:-translate-y-1 border border-white/10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative flex flex-col items-start mr-1">
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider leading-none mb-0.5 animate-pulse">Action Required</span>
          <span className="text-sm font-bold text-white leading-none">Vote Spring Electives</span>
        </div>
        
        <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-full group-hover:scale-110 transition-transform shadow-inner border border-white/20">
          <Vote className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-gray-900"></span>
          </span>
        </div>
      </button>
    </div>
  );
}

export default App;
