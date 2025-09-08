import { motion } from 'framer-motion';

const Hero = () => (
  <section
    id="home"
    className="h-full w-full min-h-screen flex items-center justify-center relative overflow-hidden py-8 sm:py-12 md:py-0"
  >
    {/* Background Image */}
    <img
      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=60"
      alt="Hero Background"
      className="absolute inset-0 w-full h-full object-cover object-center"
      loading="lazy"
      sizes="100vw"
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
  <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-2 sm:px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-6"
      >
  <span className="text-5xl sm:text-6xl md:text-8xl">😊</span>
      </motion.div>

      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
  className="font-poppins font-bold text-3xl sm:text-4xl md:text-6xl mb-3 sm:mb-4 text-white"
      >
        Smiley Food
      </motion.h1>

      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
  className="font-inter text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-gray-200"
      >
        Delicious Softy, Juicy Patties, Refreshing Shakes!
      </motion.p>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
  className="bg-white text-orange-500 font-poppins font-semibold px-5 sm:px-8 py-2.5 sm:py-4 rounded-full text-base sm:text-lg md:text-xl shadow-lg"
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
