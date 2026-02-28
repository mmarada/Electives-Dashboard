
import React, { useState } from 'react';
import { Review } from '../types';
import { Quote, User, ChevronDown, ChevronUp } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 2;

  if (reviews.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p>No reviews available for this specific course/instructor combination yet.</p>
      </div>
    );
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, INITIAL_COUNT);
  const remainingCount = reviews.length - INITIAL_COUNT;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
        Student Feedback ({reviews.length})
      </h3>
      
      <div className={`grid gap-4 transition-all duration-300 ease-in-out ${showAll ? 'max-h-[500px] overflow-y-auto pr-2' : ''}`}>
        {displayedReviews.map((review) => (
          <div key={review.id} className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <Quote className="w-5 h-5 text-purple-200 fill-purple-100" />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-3 font-medium">
                  "{review.content}"
                </p>
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-1.5 rounded-full">
                      <User className="w-3 h-3 text-gray-500" />
                    </div>
                    <span className="text-xs font-semibold text-gray-900">
                      {review.author || "Anonymous"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                    Class of {review.year} • {review.professor}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > INITIAL_COUNT && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-white border border-purple-200 rounded-full hover:bg-purple-50 hover:border-purple-300 shadow-sm transition-all group"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </>
            ) : (
              <>
                Show {remainingCount} More Review{remainingCount !== 1 ? 's' : ''} <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
