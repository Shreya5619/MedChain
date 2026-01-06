import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Lock, Activity } from 'lucide-react';

const features = [
    {
        icon: <Truck size={32} />,
        title: "Real-time Tracking",
        description: "Monitor drug shipments at every stage of the supply chain with immutable blockchain records."
    },
    {
        icon: <ShieldCheck size={32} />,
        title: "Counterfeit Prevention",
        description: "Verify authenticity instantly to ensure patient safety and eliminate fake medications."
    },
    {
        icon: <Lock size={32} />,
        title: "Secure Data",
        description: "End-to-end encryption ensures that sensitive data is accessible only to authorized parties."
    },
    {
        icon: <Activity size={32} />,
        title: "Automated Compliance",
        description: "Smart contracts automatically enforce regulatory compliance and quality control standards."
    }
];

const Features = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-serif text-med-teal mb-4"
                    >
                        Healthcare Logistics, Reimagined.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600"
                    >
                        We bring transparency and trust to the medical supply chain using advanced blockchain technology.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="p-8 bg-med-cream rounded-3xl hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="text-med-teal mb-6 pb-4 border-b border-gray-200 inline-block">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-med-teal mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
