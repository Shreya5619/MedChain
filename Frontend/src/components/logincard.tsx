import React from 'react';
import { motion } from 'framer-motion';
import { Factory, Handshake, Hospital, User } from 'lucide-react';

const options = [
  {
    href: "signup/manufacturer",
    icon: <Factory size={24} />,
    title: "Manufacturer",
    description: "Register a new production facility"
  },
  {
    href: "signup/intermediary",
    icon: <Handshake size={24} />,
    title: "Intermediary",
    description: "Join the verified distribution network"
  },
  {
    href: "signup/consumer",
    icon: <User size={24} />,
    title: "Consumer",
    description: "Create a personal account"
  },
  {
    href: "signup/hospital",
    icon: <Hospital size={24} />,
    title: "Hospital",
    description: "Register a healthcare institution"
  }
];

const LoginCard = () => {
  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-med-teal mb-2">Create Account</h2>
        <p className="text-gray-500">Join the secure supply chain network</p>
      </div>

      <div className="grid gap-4">
        {options.map((option, index) => (
          <motion.a
            key={option.title}
            href={option.href}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-med-teal/30 transition-all duration-200 group"
          >
            <div className="p-3 bg-med-teal-light text-med-teal rounded-lg group-hover:bg-med-teal group-hover:text-white transition-colors duration-200">
              {option.icon}
            </div>
            <div className="ml-4 text-left">
              <h3 className="font-semibold text-med-teal text-lg">{option.title}</h3>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default LoginCard;
