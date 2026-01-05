import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

interface SigninFormData {
    identifier: string; // username OR email
    password: string;
}

const ConsumerSigninCard: React.FC = () => {
    const [formData, setFormData] = useState<SigninFormData>({
        identifier: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let email = formData.identifier;

            if (!formData.identifier.includes('@')) {
                const { data, error } = await supabase
                    .from('Customer')
                    .select('email')
                    .eq('username', formData.identifier)
                    .single();

                if (error || !data) throw new Error('Invalid username or password');

                email = data.email;
            }

            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password: formData.password,
            });

            if (authError) throw authError;

            navigate('/consumer');
        } catch (error) {
            console.error(error);
            alert('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-purple-600">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
                    Consumer Login
                </h2>

                <form onSubmit={handleSubmit}>
                    <label className="block mb-1 font-semibold text-gray-700">Username or Email</label>
                    <input
                        name="identifier"
                        placeholder="Enter your username or email"
                        required
                        value={formData.identifier}
                        onChange={handleChange}
                        className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />

                    <label className="block mb-1 font-semibold text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full mb-6 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-3 rounded font-semibold hover:bg-purple-700 transition-colors"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConsumerSigninCard;
