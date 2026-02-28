
import React, { useState, useMemo, useEffect } from 'react';
import { courses as staticCourses, reviews as staticReviews } from './data';
import CourseCard from './components/CourseCard';
import { Search, Filter, CalendarDays, GraduationCap, Mail, Layers, Database } from 'lucide-react';
import { DayFilter, Course, Review } from './types';
import { supabase } from './supabaseClient';
import { seedDatabase } from './seedData';

function App() {
  const [courses, setCourses] = useState<Course[]>(staticCourses);
  const [reviews, setReviews] = useState<Review[]>(staticReviews);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState<DayFilter>('All');
  const [instructorFilter, setInstructorFilter] = useState('All');
  const [quarterFilter, setQuarterFilter] = useState('Spring 2026');

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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-900 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-purple-900/20 shadow-lg">
                F
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-none">MBA Electives</h1>
                <span className="text-xs text-purple-700 font-medium">Foster School of Business</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <a 
                 href="mailto:mbaregis@uw.edu" 
                 className="hidden md:flex text-sm text-gray-500 hover:text-purple-700 font-medium items-center gap-2 transition-colors"
               >
                 <Mail className="w-4 h-4" />
                 mbaregis@uw.edu
               </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Course Dashboard</h2>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Explore available electives across quarters. View schedules, download syllabi, and read peer reviews to make informed decisions.
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 sticky top-20 z-40">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by course, SLN, or professor..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full md:w-auto">
              
              {/* Quarter Filter */}
              <div className="relative group w-full sm:min-w-[140px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Layers className="h-4 w-4 text-gray-500" />
                </div>
                <select
                  value={quarterFilter}
                  onChange={(e) => setQuarterFilter(e.target.value)}
                  className="block w-full pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer hover:bg-gray-50 font-medium text-purple-700"
                >
                  <option value="All">All Quarters</option>
                  {quarters.filter(q => q !== 'All').map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <Filter className="h-3 w-3 text-gray-400" />
                </div>
              </div>

              {/* Day Filter */}
              <div className="relative group w-full sm:min-w-[140px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                </div>
                <select
                  value={dayFilter}
                  onChange={(e) => setDayFilter(e.target.value as DayFilter)}
                  className="block w-full pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer hover:bg-gray-50"
                >
                  <option value="All">All Days</option>
                  <option value="Mon/Wed">Mon/Wed</option>
                  <option value="Tue/Thu">Tue/Thu</option>
                  <option value="Evening">Evening (5pm+)</option>
                  <option value="Friday">Friday</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <Filter className="h-3 w-3 text-gray-400" />
                </div>
              </div>

              {/* Instructor Filter */}
              <div className="relative group w-full sm:min-w-[160px] col-span-2 sm:col-span-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                </div>
                <select
                  value={instructorFilter}
                  onChange={(e) => setInstructorFilter(e.target.value)}
                  className="block w-full pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer hover:bg-gray-50"
                >
                  <option value="All">All Instructors</option>
                  {instructors.filter(i => i !== 'All').map(instructor => (
                    <option key={instructor} value={instructor}>{instructor}</option>
                  ))}
                </select>
                 <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <Filter className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-sm font-medium text-gray-500">
            Showing {filteredCourses.length} courses
          </span>
          {loading && <span className="text-sm text-purple-600 animate-pulse">Loading data...</span>}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 gap-4">
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
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="mx-auto h-12 w-12 text-gray-300">
                <Search className="h-full w-full" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
              <button 
                onClick={() => {
                  setSearchQuery(''); 
                  setDayFilter('All'); 
                  setInstructorFilter('All');
                  setQuarterFilter('All');
                }}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Created by Mohan Marada, FT MBA '27
            </p>
            
            {supabase && (
              <div className="mt-4">
                <button 
                  onClick={handleSeed}
                  disabled={seeding}
                  className="text-xs text-gray-300 hover:text-purple-600 transition-colors flex items-center justify-center gap-1 mx-auto"
                >
                  <Database className="w-3 h-3" />
                  {seeding ? 'Seeding...' : 'Seed Database'}
                </button>
              </div>
            )}
         </div>
      </footer>
    </div>
  );
}

export default App;
