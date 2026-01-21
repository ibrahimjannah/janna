import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <MainLayout>
            <Head title="Profile" />

            <div className="py-16 min-h-screen">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-8 drop-shadow-md">My Profile</h1>

                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl text-white"
                        />
                    </div>

                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl p-8">
                        <UpdatePasswordForm className="max-w-xl text-white" />
                    </div>

                    <div className="bg-red-900/20 backdrop-blur-md border border-red-500/30 rounded-3xl shadow-xl p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
