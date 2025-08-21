import { motion } from 'framer-motion';
import { Users, Award, Smile } from 'lucide-react';

const AboutSection = () => (
  <section id="about" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-6 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Our Story
          </h2>
          <p className="font-inter text-gray-600 text-lg mb-6 leading-relaxed">
            At Smiley Food, we believe that great food brings smiles to faces. Since our founding, we've been dedicated to creating the most delicious soft serves, crispy patties, and refreshing shakes that make every moment special.
          </p>
          <p className="font-inter text-gray-600 text-lg mb-8 leading-relaxed">
            Our commitment to quality ingredients and innovative recipes has made us a favorite among students, families, and food lovers everywhere. Every bite is crafted with love and served with a smile!
          </p>

          <div className="grid grid-cols-3 gap-6">
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
                <div className="bg-gradient-to-r from-orange-100 to-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="text-orange-500" size={28} />
                </div>
                <div className="font-poppins font-bold text-2xl text-gray-800 mb-1">
                  {stat.number}
                </div>
                <div className="font-inter text-gray-600 text-sm">
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
          className="relative"
        >
          <img
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
            alt="Our kitchen"
            className="rounded-2xl shadow-2xl w-full"
          />
          <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg">
            <div className="text-3xl mb-2">😊</div>
            <div className="font-poppins font-semibold">Fresh & Delicious</div>
            <div className="font-inter text-sm opacity-90">Made with love</div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
