import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
}

interface ReviewsRatingsProps {
    menuItemId: string;
}

const ReviewsRatings = ({ menuItemId }: ReviewsRatingsProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    React.useEffect(() => {
        const fetchReviews = async () => {
            const res = await fetch(`/api/reviews/${menuItemId}`);
            const data = await res.json();
            setReviews(data.map((r: any) => ({
                id: r._id,
                user: r.userId, // You can populate user name if available
                rating: r.rating,
                comment: r.comment
            })));
        };
        if (menuItemId) fetchReviews();
    }, [menuItemId]);

    const handleAddReview = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
    const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ ...newReview, menuItemId })
        });
        const data = await res.json();
        setReviews([...reviews, {
            id: data._id,
            user: 'You',
            rating: data.rating,
            comment: data.comment
        }]);
        setNewReview({ rating: 5, comment: '' });
    };

    const handleDeleteReview = async (id: string) => {
        const jwtToken = localStorage.getItem('jwtToken');
    await fetch(`/api/reviews/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${jwtToken}` }
        });
        setReviews(reviews.filter((r: Review) => r.id !== id));
    };

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="border p-2 rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-bold">{review.user}</p>
                                <p>Rating: {review.rating} / 5</p>
                                <p>{review.comment}</p>
                            </div>
                            <Button variant="destructive" onClick={() => handleDeleteReview(review.id)}>Delete</Button>
                        </div>
                    ))}
                </div>
                <div className="mt-4 space-y-2">
                    <label htmlFor="rating">Rating</label>
                    <select
                        id="rating"
                        value={newReview.rating}
                        onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                        className="w-full border rounded p-2"
                    >
                        {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <textarea
                        value={newReview.comment}
                        onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Write your review..."
                        className="w-full border rounded p-2"
                    />
                    <Button onClick={handleAddReview} className="w-full">Add Review</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReviewsRatings;
