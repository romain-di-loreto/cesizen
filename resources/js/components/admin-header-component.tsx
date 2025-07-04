import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { Link, router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import React from 'react';

const Header: React.FC = () => {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <div className="bg-blue-600 p-4 text-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                {/* Logo or Home link */}
                <div>
                    <Link href="/admin" className="text-2xl font-bold hover:text-gray-300">
                        Admin Dashboard
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="space-x-4">
                    <Link href="/admin/users" className="hover:text-gray-300">
                        Users
                    </Link>
                    <Link href="/admin/informations" className="hover:text-gray-300">
                        Informations
                    </Link>
                    <Link href="/admin/categories" className="hover:text-gray-300">
                        Categories
                    </Link>
                    <Link href="/admin/exercices" className="hover:text-gray-300">
                        Exercices
                    </Link>
                </div>

                {/* Logout Button */}
                <Link
                    className="flex items-center rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    method="post"
                    href={route('logout')}
                    as="button"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </div>
        </div>
    );
};

export default Header;
