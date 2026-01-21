import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <MainLayout user={null}>
            <Head title="Register" />

            <section className="py-16 min-h-screen flex items-center justify-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">
                        <div className="text-center mb-8">
                            <i className="fas fa-crown text-royal-gold text-4xl mb-4 drop-shadow-md"></i>
                            <h2 className="text-3xl font-playfair font-bold text-white">Create Account</h2>
                            <p className="text-gray-300 mt-2">Join our royal dining experience</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Name" className="block text-gray-300 mb-2 font-medium" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2 text-red-400" />
                            </div>

                            <div>
                                <InputLabel htmlFor="username" value="Username" className="block text-gray-300 mb-2 font-medium" />
                                <TextInput
                                    id="username"
                                    name="username"
                                    value={data.username}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500"
                                    autoComplete="username"
                                    onChange={(e) => setData('username', e.target.value)}
                                    required
                                />
                                <InputError message={errors.username} className="mt-2 text-red-400" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" className="block text-gray-300 mb-2 font-medium" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2 text-red-400" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" className="block text-gray-300 mb-2 font-medium" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2 text-red-400" />
                                <p className="text-xs text-gray-500 mt-1">Use 8+ chars with mix of letters, numbers & symbols</p>
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="block text-gray-300 mb-2 font-medium" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2 text-red-400" />
                            </div>

                            <div className="flex items-center">
                                <input id="terms" type="checkbox" className="h-4 w-4 text-royal-gold focus:ring-royal-gold border-gray-600 bg-gray-800 rounded" required />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">I agree to the <a href="#" className="text-royal-gold hover:underline">Terms and Conditions</a></label>
                            </div>

                            <div>
                                <PrimaryButton className="w-full bg-royal-red hover:bg-royal-brown text-white font-bold py-4 rounded-xl transition duration-300 justify-center shadow-lg" disabled={processing}>
                                    Create Account
                                </PrimaryButton>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-300">Already have an account? <Link href={route('login')} className="text-royal-gold font-medium hover:underline">Login here</Link></p>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
