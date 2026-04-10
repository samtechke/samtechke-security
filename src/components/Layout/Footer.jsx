import { FaFacebook, FaXTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarker } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              SAMTECH<span className="text-primary">KE</span>
            </h3>
            <p className="text-gray-600 text-sm">
              Professional security systems installation in Kenya. Keeping your property safe since 2020.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-600 hover:text-primary transition">Home</a></li>
              <li><a href="/services" className="text-gray-600 hover:text-primary transition">Services</a></li>
              <li><a href="/gallery" className="text-gray-600 hover:text-primary transition">Gallery</a></li>
              <li><a href="/testimonials" className="text-gray-600 hover:text-primary transition">Testimonials</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-primary transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-600">
                <FaPhone className="text-primary" /> 
                <a href="tel:+254729289847" className="hover:text-primary transition">+254 729 289847</a>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <FaEnvelope className="text-primary" /> 
                <a href="mailto:samtechkesystems@gmail.com" className="hover:text-primary transition">samtechkesystems@gmail.com</a>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <FaMapMarker className="text-primary" /> Nairobi, Kenya
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition text-2xl"
                aria-label="Facebook (coming soon)"
              >
                <FaFacebook />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition text-2xl"
                aria-label="X (coming soon)"
              >
                <FaXTwitter />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition text-2xl"
                aria-label="Instagram (coming soon)"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://youtube.com/@samtechmedia6454" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition text-2xl"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            </div>
            <p className="text-gray-400 text-xs mt-4">
              Follow us for security tips and updates
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} SAMTECHKE Security Systems. All rights reserved.</p>
          <p className="text-gray-400 text-xs mt-1">
            Created by <a href="#" className="hover:text-primary transition">ChrisWebSys</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;