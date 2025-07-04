import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import React from 'react';

interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    category: Category;
}

const ShowCategory: React.FC = () => {
    const { category } = usePage().props as unknown as Props;

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`/api/categories/${category.id}`);
                router.visit('/admin/categories');
            } catch (err: any) {
                console.error('Error deleting category:', err);
            }
        }
    };

    return (
        <AdminLayout>
            <div className="mx-auto mt-10 max-w-md rounded bg-white p-6 shadow">
                <h1 className="mb-4 text-xl font-bold">Category Details</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <p className="text-sm">{category.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Created At</label>
                        <p className="text-sm">{new Date(category.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Updated At</label>
                        <p className="text-sm">{new Date(category.updated_at).toLocaleString()}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={() => router.visit(`/admin/categories/${category.id}/edit`)}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Edit
                    </button>

                    <button onClick={handleDelete} className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                        Delete
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ShowCategory;
