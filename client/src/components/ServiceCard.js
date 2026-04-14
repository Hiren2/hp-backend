import { Star, Users } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ServiceCard({ service, onView }) {
  const { addToCart, cart } = useCart();
  const exists = cart.find(s => s._id === service._id);

  const avgRating = service.averageRating || 0;
  const totalUsers = service.totalReviews || 0;

  const renderDynamicStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} size={16} fill="currentColor" className="text-yellow-400" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<Star key={i} size={16} fill="currentColor" className="text-yellow-400 opacity-40" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-200" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
      <img
        src={service.image}
        alt={service.name}
        className="h-40 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg">{service.name}</h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {service.description}
        </p>

        <div className="mt-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {renderDynamicStars(avgRating)}
            </div>
            <span className="font-bold text-gray-800">
              {avgRating > 0 ? avgRating.toFixed(1) : "New"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 mt-1 uppercase tracking-wide">
            <Users size={12} />
            {totalUsers > 0 ? `Reviewed by ${totalUsers} users` : "No reviews yet"}
          </div>
        </div>

        <p className="font-black mt-3 text-xl text-blue-600 tracking-tight">
          ₹{service.price}
        </p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => addToCart(service)}
            disabled={exists}
            className={`flex-1 font-bold py-2.5 rounded-xl transition-colors ${
              exists
                ? "bg-gray-100 text-emerald-600 border border-emerald-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-blue-500/20"
            }`}
          >
            {exists ? "Added to Cart" : "Add to Cart"}
          </button>

          <button
            onClick={() => onView(service)}
            className="px-5 font-bold text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}