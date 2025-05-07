import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

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
        <Link href={href} className="p-6 bg-white rounded shadow hover:shadow-lg transition duration-200">
            <h2 className="text-xl font-semibold">{label}</h2>
            <p className="text-3xl font-bold">{count}</p>
        </Link>
    );
};

export default Home;
