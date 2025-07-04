import AdminLayout from '@/layouts/admin-layout';
import { Dialog } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: {
        current_page: number;
        per_page: number;
        total: number;
        data: Category[];
    };
}

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState({ page: 1, count: 10 });
    const [deletionTarget, setDeletionTarget] = useState<Category | null>(null);
    const { token } = usePage().props.auth as { token: string };

    // Configure the axios headers globally
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories', {
                params: {
                    page: pagination.page,
                    count: pagination.count,
                },
            });
            const data = response.data;
            setCategories(data.data);
            setPagination((prev) => ({
                ...prev,
                page: data.current_page,
            }));
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [pagination.page]);

    const deleteCategory = async (category: Category) => {
        try {
            await axios.delete(`/api/categories/${category.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCategories();
            setDeletionTarget(null);
        } catch (err) {
            console.error('Failed to delete category', err);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Link href="/admin/categories/new" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        New
                    </Link>
                </div>

                <table className="min-w-full rounded bg-white shadow">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3 text-black">Name</th>
                            <th className="p-3 text-right text-black">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <Link href={`/admin/categories/${category.id}/show`} className="text-blue-600 hover:underline">
                                        {category.name}
                                    </Link>
                                </td>
                                <td className="flex justify-end space-x-2 p-3">
                                    <Link
                                        href={`/admin/categories/${category.id}/edit`}
                                        className="rounded bg-orange-500 p-2 text-white hover:bg-orange-600"
                                    >
                                        <Pencil size={16} />
                                    </Link>
                                    <button
                                        onClick={() => setDeletionTarget(category)}
                                        className="rounded bg-red-600 p-2 text-white hover:bg-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-between pt-4">
                    <button
                        className="rounded bg-white px-3 py-1 text-black hover:bg-gray-300"
                        onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                        disabled={pagination.page <= 1}
                    >
                        Previous
                    </button>
                    <span>Page {pagination.page}</span>
                    <button
                        className="rounded bg-white px-3 py-1 text-black hover:bg-gray-300"
                        onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                    >
                        Next
                    </button>
                </div>

                {/* Confirm Deletion Modal */}
                <Dialog open={!!deletionTarget} onClose={() => setDeletionTarget(null)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6 shadow">
                            <Dialog.Title className="text-lg font-bold">Delete category</Dialog.Title>
                            <p className="mt-2">
                                Are you sure you want to permanently delete <strong>{deletionTarget?.name}</strong>?
                            </p>
                            <div className="mt-4 flex justify-end space-x-3">
                                <button className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300" onClick={() => setDeletionTarget(null)}>
                                    Cancel
                                </button>
                                <button
                                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                    onClick={() => deletionTarget && deleteCategory(deletionTarget)}
                                >
                                    Delete
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default Categories;
