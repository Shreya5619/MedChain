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
            // Supabase Auth signup
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) {
                console.error('Auth error:', authError);
                alert(authError.message);
                throw authError;
            }

            // Insert into Customer table (matches schema exactly)
            const { error: customerError } = await supabase
                .from('Customer')
                .insert({
                    email: formData.email,
                    Name: formData.name,       // case-sensitive
                    username: formData.username,
                    Password: formData.password // stored because schema requires it
                });

            if (customerError) throw customerError;

            setSuccess(true);

            alert(
                `✅ Account created successfully!\n\n` +
                `Welcome, ${formData.name}!\n` +
                `📧 Verification email sent to ${formData.email}.\n\n` +
                `Please check your email and verify your account.`
            );
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-center p-8 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">
                        ✅ Registration Successful!
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Check your email for verification. You can now sign in.
                    </p>
                    <a
                        href="/signin/consumer"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
                    >
                        Go to Sign In
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-center mb-6">
                    <span className="ml-4 text-3xl font-montserrat font-bold text-purple-600">
                        MED CHAIN
                    </span>
                </div>

                <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Consumer Signup
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm
                                       text-black
                                       focus:ring-primary focus:border-primary
                                       dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm
                                       text-black
                                       focus:ring-primary focus:border-primary
                                       dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm
                                       text-black
                                       focus:ring-primary focus:border-primary
                                       dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm
                                       text-black
                                       focus:ring-primary focus:border-primary
                                       dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConsumerSignupCard;
