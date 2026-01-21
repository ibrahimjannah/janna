import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login'));
    };

    return (
        <MainLayout user={null}>
            <Head title="Admin Login" />

            <section className="py-16 min-h-screen flex items-center justify-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto bg-black/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                        <div className="text-center mb-8">
                            <i className="fas fa-shield-alt text-royal-gold text-4xl mb-4 drop-shadow-md"></i>
                            <h2 className="text-3xl font-playfair font-bold text-white">Admin Portal</h2>
                            <p className="text-gray-300 mt-2">Restricted Access System</p>
                        </div>

                        {status && <div className="mb-4 font-medium text-sm text-green-400">{status}</div>}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Administrator Identifier" className="block text-gray-300 mb-2 font-medium" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500"
                                    placeholder="admin@indianroyaldine.co.uk"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2 text-red-400" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Master Password" className="block text-gray-300 mb-2 font-medium" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2 text-red-400" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 text-royal-gold focus:ring-royal-gold border-gray-600 bg-gray-800 rounded"
                                    />
                                    <span className="ml-2 block text-sm text-gray-300">Persist Session</span>
                                </label>
                            </div>

                            <div>
                                <PrimaryButton className="w-full bg-royal-red hover:bg-royal-brown text-white font-bold py-4 rounded-xl transition duration-300 justify-center shadow-lg" disabled={processing}>
                                    Authenticate
                                </PrimaryButton>
                            </div>
                        </form>

                        <div className="mt-8 text-center text-gray-400 text-sm">
                            <p>© {new Date().getFullYear()} Indian Royal Dine. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
