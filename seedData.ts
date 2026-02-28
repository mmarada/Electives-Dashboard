
import { supabase } from './supabaseClient';
import { courses, reviews, courseDetails } from './data';

export const seedDatabase = async () => {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return { success: false, message: 'Supabase client not initialized' };
  }

  try {
    // 1. Seed Courses
    console.log('Seeding courses...');
    
    // Check if courses already exist to avoid duplicates (simple check)
    const { count: courseCount, error: countError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });
      
    if (countError) throw countError;
    
    if (courseCount && courseCount > 0) {
      console.log(`Database already has ${courseCount} courses. Skipping course seed.`);
    } else {
      const coursesToInsert = courses.map(c => {
        // Construct syllabus if missing but details exist
        let syllabus = c.syllabus;
        if (!syllabus && courseDetails[c.code]) {
          syllabus = {
            description: courseDetails[c.code],
            learningObjectives: [],
            grading: []
          };
        }

        return {
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
          info: c.info || null,
          syllabus_link: c.syllabusLink || null,
          course_catalog_link: c.courseCatalogLink || null,
          syllabus: syllabus || null
        };
      });

      const { error: courseError } = await supabase
        .from('courses')
        .insert(coursesToInsert);

      if (courseError) throw courseError;
      console.log(`Successfully inserted ${courses.length} courses.`);
    }

    // 2. Seed Reviews
    console.log('Seeding reviews...');
    
    // Check if reviews already exist
    const { count: reviewCount, error: reviewCountError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true });

    if (reviewCountError) throw reviewCountError;

    if (reviewCount && reviewCount > 0) {
       console.log(`Database already has ${reviewCount} reviews. Skipping review seed.`);
    } else {
      const reviewsToInsert = reviews.map(r => ({
        // We let Supabase generate the ID if we want, or use the one from data.ts
        // Since data.ts has IDs like "r_mgmt509...", we can try to use them if they are UUIDs, 
        // but they are NOT UUIDs. They are strings. 
        // The DB schema says `id uuid default gen_random_uuid()`. 
        // So we should probably NOT insert the ID from data.ts if it's not a UUID, 
        // OR we should change the DB schema to accept text IDs.
        // Given the schema is UUID, let's omit the ID and let Supabase generate a new UUID.
        // However, if we want to maintain the exact same data, we might want to store the original ID 
        // in a separate column or just let it go. 
        // Let's let Supabase generate new UUIDs.
        course_id: r.courseId,
        course_title_context: r.courseTitleContext || null,
        professor: r.professor,
        year: r.year,
        content: r.content,
        author: r.author || 'Anonymous'
      }));

      const { error: reviewError } = await supabase
        .from('reviews')
        .insert(reviewsToInsert);

      if (reviewError) throw reviewError;
      console.log(`Successfully inserted ${reviews.length} reviews.`);
    }

    return { success: true, message: 'Database seeded successfully!' };

  } catch (error: any) {
    console.error('Error seeding database:', error);
    return { success: false, message: error.message || 'Failed to seed database' };
  }
};
