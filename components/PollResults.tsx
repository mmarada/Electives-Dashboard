import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Course } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface PollResultsProps {
  courses: Course[];
}

const PollResults: React.FC<PollResultsProps> = ({ courses }) => {
  const [data, setData] = useState<{ name: string; fullName: string; votes: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVotes = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: votes, error } = await supabase
        .from('votes')
        .select('course_id');

      if (error) {
        console.error('Error fetching votes:', error);
        setLoading(false);
        return;
      }

      const counts: Record<string, number> = {};
      votes?.forEach((vote: any) => {
        counts[vote.course_id] = (counts[vote.course_id] || 0) + 1;
      });

      const chartData = Object.keys(counts).map(courseId => {
        const course = courses.find(c => c.code === courseId);
        return {
          name: course ? course.code : courseId, // Use code for x-axis label
          fullName: course ? course.title : courseId, // Use title for tooltip
          votes: counts[courseId],
        };
      }).sort((a, b) => b.votes - a.votes); // Sort by votes descending

      setData(chartData);
      setLoading(false);
    };

    fetchVotes();
  }, [courses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No votes yet. Be the first to vote!
      </div>
    );
  }

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            interval={0} 
            height={80} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip 
            cursor={{ fill: '#f3f4f6' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            formatter={(value: number) => [`${value} Votes`, 'Popularity']}
            labelFormatter={(label) => {
               const item = data.find(d => d.name === label);
               return item ? item.fullName : label;
            }}
          />
          <Bar dataKey="votes" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PollResults;
