import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import React from 'react';

interface Exercise {
    id: number;
    title: string;
    inhale_time: number;
    exhale_time: number;
    hold_time: number | null;
    repetitions: number | null;
    public: boolean;
    active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    exercise: Exercise;
}

const ShowExercise: React.FC = () => {
    const { exercise } = usePage().props as unknown as Props;

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this exercise?')) {
            try {
                await axios.delete(`/api/exercices/${exercise.id}`);
                router.visit('/admin/exercices');
            } catch (err: any) {
                console.error('Error deleting exercise:', err);
            }
        }
    };

    return (
        <AdminLayout>
            <div className="mx-auto mt-10 max-w-2xl rounded bg-white p-6 shadow">
                <h1 className="mb-4 text-xl font-bold">Exercise Details</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <p className="text-sm">{exercise.title}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Inhale Time (seconds)</label>
                        <p className="text-sm">{exercise.inhale_time}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Exhale Time (seconds)</label>
                        <p className="text-sm">{exercise.exhale_time}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Hold Time (optional)</label>
                        <p className="text-sm">{exercise.hold_time ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Repetitions (optional)</label>
                        <p className="text-sm">{exercise.repetitions ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Public</label>
                        <p className="text-sm">{exercise.public ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Active</label>
                        <p className="text-sm">{exercise.active ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Created At</label>
                        <p className="text-sm">{new Date(exercise.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Updated At</label>
                        <p className="text-sm">{new Date(exercise.updated_at).toLocaleString()}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={() => router.visit(`/admin/exercices/${exercise.id}/edit`)}
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

export default ShowExercise;
