import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

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
        <div className="w-full">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-serif text-med-teal mb-2">Welcome Back</h2>
                <p className="text-gray-500">Sign in to track your medications.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Username or Email</label>
                    <input
                        name="identifier"
                        placeholder="e.g. johndoe or john@example.com"
                        required
                        value={formData.identifier}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-med-teal text-white font-bold rounded-full hover:bg-med-teal/90 transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                    {loading ? (
                        <span>Signing In...</span>
                    ) : (
                        <>
                            <span>Sign In</span>
                            <LogIn size={20} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                    Don't have an account?{' '}
                    <a href="/signup/consumer" className="text-med-teal font-semibold hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ConsumerSigninCard;
