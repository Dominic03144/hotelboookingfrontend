
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Review {
  reviewId: number;
  hotelId: number;
  hotelName: string;
  name: string;
  stars: number;
  comment: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const { data: reviews = [], isLoading, isError, error } = useQuery<Review[]>({
    queryKey: ["allReviews"],
    queryFn: async () => {
      const res = await axios.get("https://hotelroombooking-jmh1.onrender.com/api/reviews");
      return res.data.reviews || [];
    },
  });

  if (isLoading) return <p>Loading reviews...</p>;
  if (isError) return <p className="text-red-600">Error: {String(error)}</p>;

  if (!reviews.length) return <p>No reviews found.</p>;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li
            key={review.reviewId}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow"
          >
            <h3 className="font-semibold text-lg">{review.hotelName}</h3>
            <p>Reviewer: {review.name}</p>
            <p>Rating: {"⭐".repeat(review.stars)}</p>
            <p>{review.comment}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
