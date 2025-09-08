import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "The best ice cream in town! The soft serves are incredibly creamy and the patties are always crispy and fresh.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    {
      name: "Mike Chen",
      rating: 5,
      text: "Amazing shakes and great service! My kids absolutely love coming here for their favorite treats.",
      image: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    {
      name: "Emily Davis",
      rating: 5,
      text: "Smiley Food never fails to make me smile! The variety and quality are outstanding. Highly recommended!",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    }
  ];

  return (
    <section id="testimonials" className="py-10 sm:py-16 md:py-20 bg-gradient-to-br from-pink-200 to-yellow-200">
      <div className="max-w-3xl mx-auto px-2 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="font-poppins font-bold text-2xl sm:text-4xl md:text-5xl mb-2 sm:mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          <p className="font-inter text-gray-600 text-base sm:text-lg">
            Don't just take our word for it
          </p>
        </motion.div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 w-full">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4"
                  loading="lazy"
                />
                <div>
                  <div className="font-poppins font-semibold text-gray-800 text-sm sm:text-base">
                    {testimonial.name}
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="font-inter text-gray-600 italic text-xs sm:text-sm">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
