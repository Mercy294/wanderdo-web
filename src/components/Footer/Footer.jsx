import React from "react";
import { Heart, Mail } from "lucide-react";
// These are the correct imports for social icons
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary-400 mb-4">
              Wanderdo
            </h3>
            <p className="text-gray-400 text-sm">
              Discover and book unique experiences around the world.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/explore" className="hover:text-white transition">
                  Browse Experiences
                </Link>
              </li>
              <li>
                <Link to="/host" className="hover:text-white transition">
                  Become a Host
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-3">
              Subscribe to get special offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-l-lg text-gray-900 focus:outline-none"
              />
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-r-lg transition">
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            Made with <Heart className="h-4 w-4 inline text-red-500" /> © 2026
            Wanderdo.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
