import React from "react";
import Navbar from "./components/navbar";
import "animate.css";

const AboutUs = () => {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen text-white">
            <Navbar /><br /><br /><br /><br />
            <div className="flex flex-row flex-wrap items-start justify-center p-10 gap-12">

                <div className="relative z-10 text-center px-8 max-w-sm animate__animated animate__fadeInDown">
                    <img
                        className="w-25 h-25 rounded-md align-center"
                        src="/src/components/medchainlogo.png"
                        alt="MedChain Logo"

                    />
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-black mb-6">
                        MedChain
                    </h1>
                    <p className="text-lg sm:text-xl text-black mb-8 animate__animated animate__fadeInUp animate__delay-1s">
                        Ensure transparency, traceability, and trust in drug distribution with our state-of-the-art blockchain solution.
                    </p>
                </div>

                <div className="max-w-lg animate__animated animate__fadeInLeft animate__delay-2s">
                    <h2 className="text-2xl font-bold mb-6 text-cyan-100/100 ">About Us</h2>
                    <p className="text-lg sm:text-xl mb-8  text-blue-950">
                        At MedChain, we are revolutionizing the pharmaceutical industry by bringing transparency, security, and efficiency to the drug supply chain. Our mission is to ensure the integrity of medicines worldwide through the power of blockchain technology.
                    </p>

                    <h2 className="text-2xl font-bold mb-4 text-cyan-100/100">Who We Are</h2>
                    <p className="text-lg sm:text-xl mb-8 text-blue-950">
                        MedChain was founded by a passionate team of technologists, healthcare professionals, and supply chain experts. United by a common goal, we are committed to solving one of the most critical challenges in healthcare: the fight against counterfeit drugs and inefficiencies in drug distribution.
                    </p>
                </div>

                <div className="max-w-lg animate__animated animate__fadeInLeft animate__delay-3s">
                    <h2 className="text-2xl font-bold mb-4 text-cyan-100/100">What We Do</h2>
                    <p className="text-lg sm:text-xl mb-8 text-blue-950">
                        MedChain leverages blockchain technology to create a tamper-proof and decentralized system for tracking pharmaceuticals from production to delivery. Our platform ensures:
                        <br /><br />
                        <b className="animate__animated animate__zoomIn animate__delay-3s">Traceability:</b> Every step of the supply chain is recorded and verified, providing end-to-end visibility.
                        <br />
                        <b className="animate__animated animate__zoomIn animate__delay-4s">Transparency:</b> Real-time access to immutable data ensures trust between all stakeholders.
                        <br />
                        <b className="animate__animated animate__zoomIn animate__delay-5s">Security:</b> Advanced encryption safeguards sensitive information against tampering and cyber threats.
                        <br />
                        <b className="animate__animated animate__zoomIn animate__delay-6s">Compliance:</b> Our system adheres to international regulations, helping businesses meet stringent requirements effortlessly.
                    </p>

                    <h2 className="text-2xl font-bold mb-4 text-cyan-100/100">Why Choose Us</h2>
                    <p className="text-lg sm:text-xl mb-8 text-blue-950">
                        Innovative Solutions: We employ cutting-edge blockchain technology to solve real-world problems.
                        <br />
                        Global Impact: By ensuring the authenticity of drugs, we are safeguarding lives and promoting public health.
                        <br />
                        Collaboration: We partner with manufacturers, distributors, healthcare providers, and regulators to create a unified ecosystem.
                        <br />
                        Sustainability: Our platform reduces inefficiencies, minimizing waste and environmental impact.
                    </p>
                </div>

                <div className="max-w-lg animate__animated animate__fadeInLeft animate__delay-4s">
                    <h2 className="text-2xl font-bold mb-4 text-cyan-100/100">Our Vision</h2>
                    <p className="text-lg sm:text-xl mb-8 text-blue-950">
                        A world where every patient has access to safe, genuine, and affordable medicines.
                    </p>

                    <h2 className="text-2xl font-bold mb-4 text-cyan-100/100">Our Mission</h2>
                    <p className="text-lg sm:text-xl mb-8 text-blue-950">
                        To transform the pharmaceutical supply chain by building a transparent, secure, and efficient system that benefits all stakeholders and ultimately improves global healthcare outcomes.
                    </p>

                    <h2 className="text-2xl font-bold mb-4 text-cyan-100/100">Join Us</h2>
                    <p className="text-lg sm:text-xl mb-8 text-blue-950">
                        At MedChain, we believe in collaboration and innovation. Whether you are a pharmaceutical company, a healthcare provider, or a technology enthusiast, we welcome you to join us on this transformative journey. Together, we can build a safer and healthier world.
                    </p>

                    <h2 className="text-2xl font-bold mb-4 text-cyan-100/100">Contact Us</h2>
                    <p className="text-lg sm:text-xl text-blue-950 animate__animated animate__pulse animate__infinite">
                        Have questions or want to learn more? Reach out to us at .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
