import Review from '../models/Review.js';

export const addReview = async (req, res) => {
  try {
    const review = new Review({ ...req.body, userId: req.user._id });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ menuItemId: req.params.menuItemId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await Review.deleteOne({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error });
  }
};
