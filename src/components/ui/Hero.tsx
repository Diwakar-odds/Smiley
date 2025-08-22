import { motion } from 'framer-motion';

const Hero = () => (
  <section
    id="home"
    className="min-h-screen flex items-center justify-center relative overflow-hidden"
  >
    {/* Background Image */}
    <img
      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80"
      alt="Hero Background"
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* Gradient Overlay (bottom dark → top transparent) */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

    {/* Floating Elements */}
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>

    {/* Hero Content */}
    <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-6"
      >
        <span className="text-6xl sm:text-7xl md:text-8xl">😊</span>
      </motion.div>

      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-poppins font-bold text-4xl sm:text-5xl md:text-7xl mb-4 text-white"
      >
        Smiley Food
      </motion.h1>

      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="font-inter text-lg sm:text-xl md:text-2xl mb-6 text-gray-200"
      >
        Delicious Softy, Juicy Patties, Refreshing Shakes!
      </motion.p>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-orange-500 font-poppins font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-lg sm:text-xl md:text-2xl shadow-lg"
        onClick={() =>
          document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Order Now
      </motion.button>
    </div>
  </section>
);


export default Hero;
