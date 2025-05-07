import React from 'react';
import { usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import axios from 'axios';

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
        if (confirm("Are you sure you want to delete this category?")) {
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
            <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-4">Category Details</h1>
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

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={() => router.visit(`/admin/categories/${category.id}/edit`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Edit
                    </button>

                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ShowCategory;
