import Link from 'next/link';
import { Github, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Members', href: '#members' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'News', href: '#news' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "GitHub", href: "https://github.com/abudAS12", icon: Github },
    { name: "Instagram", href: "http://instagram.com/hll.arsyy11", icon: Instagram },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl"><img src="/image/logo.jpeg" alt="logo" /></span>
              </div>
              <span className="ml-3 text-xl font-bold">CueXs Team</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              kami adalah komunitas yang CueXs
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2 text-purple-400" />
                <span>arasyalpapahilal@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2 text-purple-400" />
                <span>+62 838-3469-1675</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                <span>Bandung, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} CueXs Team. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;