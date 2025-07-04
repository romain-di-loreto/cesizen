import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import React from 'react';

interface Props {
    counts: {
        users: number;
        categories: number;
        informations: number;
        exercices: number;
    };
}

const Home: React.FC<Props> = ({ counts }) => {
    return (
        <AdminLayout>
            <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                    <Card count={counts.users} label="Users" href="/admin/users" />
                    <Card count={counts.categories} label="Categories" href="/admin/categories" />
                    <Card count={counts.informations} label="Informations" href="/admin/informations" />
                    <Card count={counts.exercices} label="Exercices" href="/admin/exercices" />
                </div>
            </div>
        </AdminLayout>
    );
};

interface CardProps {
    count: number;
    label: string;
    href: string;
}

const Card: React.FC<CardProps> = ({ count, label, href }) => {
    return (
        <Link href={href} className="rounded bg-white p-6 shadow transition duration-200 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-black">{label}</h2>
            <p className="text-3xl font-bold text-black">{count}</p>
        </Link>
    );
};

export default Home;
