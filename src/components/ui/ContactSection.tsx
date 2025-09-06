import { motion } from 'framer-motion';
import { Phone, MapPin, Clock } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Contact Us
          </h2>
          <p className="font-inter text-gray-600 text-lg">
            We'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-orange-100 to-pink-200 p-8 rounded-2xl">
              <h3 className="font-poppins font-semibold text-2xl mb-6 text-gray-800">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="text-orange-500 mr-4" size={24} />
                  <span className="font-inter text-gray-700">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-orange-500 mr-4" size={24} />
                  <span className="font-inter text-gray-700">Kanpur Institute of Technology</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-orange-500 mr-4" size={24} />
                  <span className="font-inter text-gray-700">Mon-sat: 10AM - 5PM</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-orange-100 to-pink-200 p-8 rounded-2xl">
              <h3 className="font-poppins font-semibold text-2xl mb-6 text-gray-800">
                Get in Touch
              </h3>
              <p className="font-inter text-gray-600">
                Have a question or a special request? Feel free to reach out to us.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;