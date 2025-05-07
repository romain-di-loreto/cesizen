import React, { useEffect, useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import { Dialog } from '@headlessui/react';
import { Pencil, Trash2, EyeOff, Eye } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '@/layouts/admin-layout';

interface Information {
    id: number;
    title: string;
    active: boolean;
}

interface Props {
    information: {
        current_page: number;
        per_page: number;
        total: number;
        data: Information[];
    };
}

const InformationPage: React.FC = () => {
    const [information, setInformation] = useState<Information[]>([]);
    const [pagination, setPagination] = useState({ page: 1, count: 10 });
    const [deletionTarget, setDeletionTarget] = useState<Information | null>(null);
    const { token } = usePage().props.auth as { token: string };
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchInformations = async () => {
        try {
            const response = await axios.get('/api/informations', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page: pagination.page,
                    count: pagination.count,
                    inactive: true,
                },
            });
            const data = response.data;
            setInformation(data.data);
            setPagination((prev) => ({
                ...prev,
                page: data.current_page,
            }));
        } catch (err) {
            console.error('Failed to fetch information', err);
        }
    };

    useEffect(() => {
        fetchInformations();
    }, [pagination.page]);

    const toggleActive = async (info: Information) => {
        try {
            // Toggle the active state and update the information accordingly
            await updateInformationActiveStatus(info.id, !info.active); // If active, deactivate, else activate
            fetchInformations(); // Refresh the list after update
        } catch (err) {
            console.error('Failed to toggle information active status', err);
        }
    };

    const updateInformationActiveStatus = async (infoId: number, active: boolean) => {
        try {
            await axios.put(`/api/informations/${infoId}`, {
                active,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        } catch (err) {
            console.error('Failed to update information active status', err);
        }
    };

    const deleteInformation = async (info: Information) => {
        try {
            await axios.delete(`/api/informations/${info.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    hard: true
                }
            });
            fetchInformations();
            setDeletionTarget(null);
        } catch (err) {
            console.error('Failed to delete information', err);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Information</h1>
                    <Link
                        href="/admin/informations/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        New
                    </Link>
                </div>

                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3">Title</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {information.map((info) => (
                            <tr key={info.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <Link href={`/admin/informations/${info.id}/show`} className="text-blue-600 hover:underline">
                                        {info.title}
                                    </Link>
                                </td>
                                <td className="p-3">
                                    {info.active ? (
                                        <span className="text-green-600 font-semibold">Active</span>
                                    ) : (
                                        <span className="text-gray-500 font-semibold">Inactive</span>
                                    )}
                                </td>
                                <td className="p-3 flex justify-end space-x-2">
                                    <Link
                                        href={`/admin/informations/${info.id}/edit`}
                                        className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                                    >
                                        <Pencil size={16} />
                                    </Link>
                                    <button
                                        onClick={() => toggleActive(info)}
                                        className={`p-2 text-white rounded ${info.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                    >
                                        {info.active ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => setDeletionTarget(info)}
                                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
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
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                        disabled={pagination.page <= 1}
                    >
                        Previous
                    </button>
                    <span>Page {pagination.page}</span>
                    <button
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                    >
                        Next
                    </button>
                </div>

                {/* Confirm Deletion Modal */}
                <Dialog open={!!deletionTarget} onClose={() => setDeletionTarget(null)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="bg-white p-6 rounded shadow max-w-sm w-full">
                            <Dialog.Title className="text-lg font-bold">Delete Information</Dialog.Title>
                            <p className="mt-2">
                                Are you sure you want to permanently delete{' '}
                                <strong>{deletionTarget?.title}</strong>?
                            </p>
                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={() => setDeletionTarget(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    onClick={() => deletionTarget && deleteInformation(deletionTarget)}
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

export default InformationPage;
