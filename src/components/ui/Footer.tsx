const Footer = () => (
  <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-3xl">😊</span>
            <span className="font-poppins font-bold text-2xl">Smiley Food</span>
          </div>
          <p className="font-inter text-gray-300 mb-4">
            Bringing smiles to your taste buds with the freshest and most delicious treats in town.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-poppins font-semibold text-lg mb-4">Quick Links</h4>
          <div className="space-y-2">
            {['Home', 'Menu', 'About', 'Contact'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="block font-inter text-gray-300 hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="font-poppins font-semibold text-lg mb-4">Contact</h4>
          <div className="space-y-2 font-inter text-gray-300">
            <p>123 Food Street</p>
            <p>Taste City, TC 12345</p>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>

        {/* Social Links & App Store */}
        <div>
          <h4 className="font-poppins font-semibold text-lg mb-3">Social Links</h4>
          <div className="flex space-x-3 mb-4">
            <a href="#" className="bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors" aria-label="LinkedIn"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" className="w-6 h-6" /></a>
            <a href="#" className="bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors" aria-label="Instagram"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/instagram/instagram-original.svg" alt="Instagram" className="w-6 h-6" /></a>
            <a href="#" className="bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors" aria-label="YouTube"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/youtube/youtube-original.svg" alt="YouTube" className="w-6 h-6" /></a>
            <a href="#" className="bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors" aria-label="Facebook"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" className="w-6 h-6" /></a>
            <a href="#" className="bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors" aria-label="X"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg" alt="X" className="w-6 h-6" /></a>
          </div>
          <div className="flex flex-col gap-3 items-start">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-10" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10" />
            </a>
          </div>
        </div>

        {/* Social Links & App Store */}
        <div>
          <h4 className="font-poppins font-semibold text-lg mb-3">Social Links</h4>
          <div className="flex space-x-3 mb-4">
            {/* Add your social icons here */}
          </div>
          <div className="flex flex-col gap-3 items-start">
            {/* App Store buttons here */}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
