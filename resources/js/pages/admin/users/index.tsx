import React, { useEffect, useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import { Dialog } from '@headlessui/react';
import { Pencil, Trash2, EyeOff, Eye } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '@/layouts/admin-layout';

interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;
}

interface Props {
    users: {
        current_page: number;
        per_page: number;
        total: number;
        data: User[];
    };
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState({ page: 1, count: 10 });
    const [deletionTarget, setDeletionTarget] = useState<User | null>(null);
    const { token } = usePage().props.auth as { token: string };
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users', {
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
            setUsers(data.data);
            setPagination((prev) => ({
                ...prev,
                page: data.current_page,
            }));
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [pagination.page]);

    const toggleActive = async (user: User) => {
        try {
            // Toggle the active state and update the user accordingly
            await updateUserActiveStatus(user.id, !user.active); // If active, deactivate, else activate
            fetchUsers(); // Refresh the list after update
        } catch (err) {
            console.error('Failed to toggle user active status', err);
        }
    };

    const updateUserActiveStatus = async (userId: number, active: boolean) => {
        try {
            await axios.put(`/api/users/${userId}`, {
                active,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        } catch (err) {
            console.error('Failed to update user active status', err);
        }
    };

    const deleteUser = async (user: User) => {
        try {
            await axios.delete(`/api/users/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    hard: true
                }
            });
            fetchUsers();
            setDeletionTarget(null);
        } catch (err) {
            console.error('Failed to delete user', err);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Link
                        href="/admin/users/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        New
                    </Link>
                </div>

                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <Link href={`/admin/users/${user.id}/show`} className="text-blue-600 hover:underline">
                                        {user.name}
                                    </Link>
                                </td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">
                                    {user.active ? (
                                        <span className="text-green-600 font-semibold">Active</span>
                                    ) : (
                                        <span className="text-gay-500 font-semibold">Inactive</span>
                                    )}
                                </td>
                                <td className="p-3 flex justify-end space-x-2">
                                    <Link
                                        href={`/admin/users/${user.id}/edit`}
                                        className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                                    >
                                        <Pencil size={16} />
                                    </Link>
                                    <button
                                        onClick={() => toggleActive(user)}
                                        className={`p-2 text-white rournded ${
                                            user.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                    >
                                        {user.active ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => setDeletionTarget(user)}
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
                            <Dialog.Title className="text-lg font-bold">Delete user</Dialog.Title>
                            <p className="mt-2">
                                Are you sure you want to permanently delete{' '}
                                <strong>{deletionTarget?.name}</strong>?
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
                                    onClick={() => deletionTarget && deleteUser(deletionTarget)}
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

export default Users;
