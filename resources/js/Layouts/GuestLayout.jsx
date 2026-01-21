import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Guest({ children }) {
    // We reuse MainLayout to show nav/footer even on auth pages
    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}
