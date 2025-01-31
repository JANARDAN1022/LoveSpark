import type React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-pink-100 text-pink-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">LoveSpark</h3>
            <p className="mb-4">Find Your Love-Spark Through Us</p>
            <div className="flex space-x-4">
              <a href="#" className="text-pink-600 hover:text-pink-800">
                <FaFacebookF />
              </a>
              <a href="#" className="text-pink-600 hover:text-pink-800">
                <FaTwitter />
              </a>
              <a href="#" className="text-pink-600 hover:text-pink-800">
                <FaInstagram />
              </a>
              <a href="#" className="text-pink-600 hover:text-pink-800">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          {["Company", "Resources", "Legal"].map((category) => (
            <div key={category}>
              <h4 className="text-lg font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {["About", "Careers", "Contact", "Blog"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-pink-600">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-pink-200 text-center">
          <p>&copy; 2023 LoveSpark. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
