import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2 } from 'react-icons/fi'; // Removed unused FiEdit, FiCheck, FiX imports
import client from '../../api/client';

interface Review {
    _id: string;
    userId: {
        _id: string;
        name: string;
    };
    menuItemId: {
        _id: string;
        name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewModerationProps {
    initialReviews?: Review[];
}

const ReviewModeration: React.FC<ReviewModerationProps> = ({ initialReviews = [] }) => {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [loading, setLoading] = useState<boolean>(initialReviews.length === 0);
    const [error, setError] = useState<string | null>(null);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    React.useEffect(() => {
        if (initialReviews.length === 0) {
            fetchReviews();
        }
    }, [initialReviews]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await client.get('/reviews');
            setReviews(response.data);
        } catch (err) {
            setError('Failed to fetch reviews');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            setIsDeleting(true);
            await client.delete(`/reviews/${reviewId}`);
            setReviews(reviews.filter(review => review._id !== reviewId));
            setSelectedReview(null);
        } catch (err) {
            setError('Failed to delete review');
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    const renderStarRating = (rating: number) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-gray-600">{rating}/5</span>
            </div>
        );
    };

    if (loading) {
        return <div className="text-center py-10">Loading reviews...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white shadow-lg rounded-xl p-6"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Moderation</h2>

            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reviews List */}
                <div className="bg-gray-50 rounded-lg p-4 overflow-y-auto max-h-[600px]">
                    <h3 className="text-lg font-semibold mb-3">All Reviews</h3>

                    {reviews.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">No reviews found</div>
                    ) : (
                        <div className="space-y-3">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className={`p-3 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100 transition ${selectedReview?._id === review._id ? 'ring-2 ring-indigo-500' : ''
                                        }`}
                                    onClick={() => setSelectedReview(review)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">{review.userId.name}</h4>
                                            <p className="text-sm text-gray-500">
                                                for {review.menuItemId.name}
                                            </p>
                                        </div>
                                        <div>
                                            {renderStarRating(review.rating)}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm truncate">{review.comment}</p>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(review.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Review Detail */}
                <div className="bg-gray-50 rounded-lg p-4">
                    {selectedReview ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Review Details</h3>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleDeleteReview(selectedReview._id)}
                                        disabled={isDeleting}
                                        className="flex items-center text-red-600 hover:text-red-800 disabled:text-gray-400"
                                    >
                                        <FiTrash2 className="mr-1" />
                                        {isDeleting ? 'Deleting...' : 'Delete Review'}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow">
                                <div className="mb-4">
                                    <span className="text-sm font-medium text-gray-500">Item:</span>
                                    <h4 className="font-semibold">{selectedReview.menuItemId.name}</h4>
                                </div>

                                <div className="mb-4">
                                    <span className="text-sm font-medium text-gray-500">Rating:</span>
                                    <div className="mt-1">{renderStarRating(selectedReview.rating)}</div>
                                </div>

                                <div className="mb-4">
                                    <span className="text-sm font-medium text-gray-500">Comment:</span>
                                    <p className="mt-1 text-gray-800 whitespace-pre-line">
                                        {selectedReview.comment}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <span className="text-sm font-medium text-gray-500">Customer:</span>
                                    <p className="font-semibold">{selectedReview.userId.name}</p>
                                </div>

                                <div>
                                    <span className="text-sm font-medium text-gray-500">Date:</span>
                                    <p>{new Date(selectedReview.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedReview(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Select a review to view details
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewModeration;
