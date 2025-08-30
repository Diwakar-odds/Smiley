import { Review } from "../models/sequelize/index.js";

// Add a new review
export const addReview = async (req, res) => {
  try {
    const review = await Review.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    res
      .status(500)
      .json({ message: "Error adding review", error: error.message });
  }
};

// Get reviews for a specific menu item
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { menuItemId: req.params.menuItemId },
      include: ["User"], // Include user details (assuming association is set up)
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the author of the review
    if (review.userId !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await review.destroy();
    res.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res
      .status(500)
      .json({ message: "Error deleting review", error: error.message });
  }
};

// Get all reviews (admin only)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: ["User", "MenuItem"],
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res
      .status(500)
      .json({ message: "Error fetching all reviews", error: error.message });
  }
};
