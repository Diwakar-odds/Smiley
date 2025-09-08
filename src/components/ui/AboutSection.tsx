import { motion } from 'framer-motion';
import { Users, Award, Smile } from 'lucide-react';

const AboutSection = () => (
  <section id="about" className="py-12 sm:py-16 md:py-20 bg-white">
    <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-poppins font-bold text-2xl sm:text-3xl md:text-5xl mb-4 sm:mb-6 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Our Story
          </h2>
          <p className="font-inter text-gray-600 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
            At Smiley Food, we believe that great food brings smiles to faces. Since our founding, we've been dedicated to creating the most delicious soft serves, crispy patties, and refreshing shakes that make every moment special.
          </p>
          <p className="font-inter text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
            Our commitment to quality ingredients and innovative recipes has made us a favorite among students, families, and food lovers everywhere. Every bite is crafted with love and served with a smile!
          </p>

          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {[
              { icon: Users, number: '10K+', label: 'Happy Customers' },
              { icon: Award, number: '50+', label: 'Menu Items' },
              { icon: Smile, number: '99%', label: 'Satisfaction' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-orange-100 to-pink-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <stat.icon className="text-orange-500" size={22} />
                </div>
                <div className="font-poppins font-bold text-lg sm:text-2xl text-gray-800 mb-0.5 sm:mb-1">
                  {stat.number}
                </div>
                <div className="font-inter text-gray-600 text-xs sm:text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mt-8 md:mt-0"
        >
          <img
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
            alt="Our kitchen"
            className="rounded-xl shadow-xl w-full max-h-56 sm:max-h-80 object-cover"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
            <div className="text-xl sm:text-3xl mb-1 sm:mb-2">😊</div>
            <div className="font-poppins font-semibold text-xs sm:text-base">Fresh & Delicious</div>
            <div className="font-inter text-xs sm:text-sm opacity-90">Made with love</div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
