import React, { useEffect, useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import { Dialog } from '@headlessui/react';
import { Pencil, Trash2, EyeOff, Eye } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '@/layouts/admin-layout';

interface Exercise {
    id: number;
    title: string;
    inhale_time: number;
    exhale_time: number;
    hold_time?: number;
    repetitions?: number;
    public: boolean;
    active: boolean;
}

interface Props {
    exercices: {
        current_page: number;
        per_page: number;
        total: number;
        data: Exercise[];
    };
}

const Exercices: React.FC = () => {
    const [exercices, setExercices] = useState<Exercise[]>([]);
    const [pagination, setPagination] = useState({ page: 1, count: 10 });
    const [deletionTarget, setDeletionTarget] = useState<Exercise | null>(null);
    const { token } = usePage().props.auth as { token: string };
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchExercices = async () => {
        try {
            const response = await axios.get('/api/exercices', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page: pagination.page,
                    count: pagination.count,
                    inactive: true,
                    public: false,
                },
            });
            const data = response.data;
            setExercices(data.data);
            setPagination((prev) => ({
                ...prev,
                page: data.current_page,
            }));
        } catch (err) {
            console.error('Failed to fetch exercices', err);
        }
    };

    useEffect(() => {
        fetchExercices();
    }, [pagination.page]);

    const toggleActive = async (exercise: Exercise) => {
        try {
            await updateExerciseActiveStatus(exercise.id, !exercise.active);
            fetchExercices(); // Refresh the list after update
        } catch (err) {
            console.error('Failed to toggle exercise active status', err);
        }
    };

    const updateExerciseActiveStatus = async (exerciseId: number, active: boolean) => {
        try {
            await axios.put(`/api/exercices/${exerciseId}`, {
                active,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        } catch (err) {
            console.error('Failed to update exercise active status', err);
        }
    };

    const deleteExercise = async (exercice: Exercise) => {
        try {
            await axios.delete(`/api/exercices/${exercice.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    hard: true
                }
            });
            fetchExercices();
            setDeletionTarget(null);
        } catch (err) {
            console.error('Failed to delete exercice', err);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Exercices</h1>
                    <Link
                        href="/admin/exercices/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        New
                    </Link>
                </div>

                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3">Title</th>
                            <th className="p-3">Inhale Time</th>
                            <th className="p-3">Exhale Time</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exercices.map((exercise) => (
                            <tr key={exercise.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <Link href={`/admin/exercices/${exercise.id}/show`} className="text-blue-600 hover:underline">
                                        {exercise.title}
                                    </Link>
                                </td>
                                <td className="p-3">{exercise.inhale_time}</td>
                                <td className="p-3">{exercise.exhale_time}</td>
                                <td className="p-3">
                                    {exercise.active ? (
                                        <span className="text-green-600 font-semibold">Active</span>
                                    ) : (
                                        <span className="text-gray-500 font-semibold">Inactive</span>
                                    )}
                                </td>
                                <td className="p-3 flex justify-end space-x-2">
                                    <Link
                                        href={`/admin/exercices/${exercise.id}/edit`}
                                        className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                                    >
                                        <Pencil size={16} />
                                    </Link>
                                    <button
                                        onClick={() => toggleActive(exercise)}
                                        className={`p-2 text-white rounded ${
                                            exercise.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                    >
                                        {exercise.active ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => setDeletionTarget(exercise)}
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
                            <Dialog.Title className="text-lg font-bold">Delete Exercise</Dialog.Title>
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
                                    onClick={() => deletionTarget && deleteExercise(deletionTarget)}
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

export default Exercices;
