import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface SignupFormData {
    username: string;
    name: string;
    email: string;
    password: string;
}

const ConsumerSignupCard: React.FC = () => {
    const [formData, setFormData] = useState<SignupFormData>({
        username: '',
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            const { error: customerError } = await supabase
                .from('Customer')
                .insert({
                    email: formData.email,
                    Name: formData.name,
                    username: formData.username,
                    Password: formData.password
                });

            if (customerError) throw customerError;
            setSuccess(true);

        } catch (error: any) {
            console.error('Error:', error);
            alert(error.message || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center p-8 bg-green-50 border border-green-200 rounded-xl">
                <h2 className="text-2xl font-serif text-med-teal mb-4">Registration Successful!</h2>
                <p className="text-gray-700 mb-6 font-sans">
                    Please check your email to verify your account.
                </p>
                <a
                    href="/signin/consumer"
                    className="inline-block bg-med-teal hover:bg-med-teal/90 text-white font-semibold py-3 px-8 rounded-full transition-all"
                >
                    Sign In Now
                </a>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-serif text-med-teal mb-2">Create Account</h2>
                <p className="text-gray-500">Sign up to verify your medication.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-med-teal hover:bg-med-teal/90 disabled:bg-gray-400 text-white font-bold py-4 rounded-full shadow-lg transition-all transform hover:scale-[1.01]"
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default ConsumerSignupCard;
