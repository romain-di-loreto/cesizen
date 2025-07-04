import AdminLayout from '@/layouts/admin-layout';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';

interface Category {
    id: number;
    name: string;
}

interface Information {
    id: number;
    title: string;
    description: string;
    content: string;
    active: boolean;
    category_id: number | null;
}

interface Props {
    information: Information;
    categories: Category[];
}

const ShowInformation: React.FC = () => {
    const { information, categories } = usePage().props as unknown as Props;

    const category = categories.find((cat) => cat.id === information.category_id);

    return (
        <AdminLayout>
            <div className="mx-auto mt-10 max-w-2xl rounded bg-white p-6 shadow">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Information Details</h1>
                    <Link href={`/admin/informations/${information.id}/edit`} className="text-blue-600 hover:underline">
                        Edit
                    </Link>
                </div>

                <div className="space-y-4">
                    <div>
                        <h2 className="text-sm font-medium text-gray-600">Title</h2>
                        <p className="text-base">{information.title}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-gray-600">Description</h2>
                        <p className="text-base">{information.description}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-gray-600">Content</h2>
                        <p className="text-base whitespace-pre-line">{information.content}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-gray-600">Category</h2>
                        <p className="text-base">{category ? category.name : '—'}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-gray-600">Active</h2>
                        <p className="text-base">{information.active ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ShowInformation;
