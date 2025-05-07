import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import axios from 'axios';

const NewExercise: React.FC = () => {
    const { token } = usePage().props.auth as { token: string };

    const [title, setTitle] = useState('');
    const [inhaleTime, setInhaleTime] = useState(4);
    const [exhaleTime, setExhaleTime] = useState(4);
    const [holdTime, setHoldTime] = useState<number | ''>('');
    const [repetitions, setRepetitions] = useState<number | ''>('');
    const [isPublic, setIsPublic] = useState(false);
    const [active, setActive] = useState(true);
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            await axios.post('/api/exercices', {
                title,
                inhale_time: inhaleTime,
                exhale_time: exhaleTime,
                hold_time: holdTime || null,
                repetitions: repetitions || null,
                public: isPublic,
                active,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            router.visit('/admin/exercices');
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                console.error('Unexpected error', err);
            }
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-4">Create New Exercise</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        {errors.title && <p className="text-red-600 text-sm">{errors.title[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Inhale Time (seconds)</label>
                        <input
                            type="number"
                            min="1"
                            value={inhaleTime}
                            onChange={(e) => setInhaleTime(Number(e.target.value))}
                            className="w-full border p-2 rounded"
                        />
                        {errors.inhale_time && <p className="text-red-600 text-sm">{errors.inhale_time[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Exhale Time (seconds)</label>
                        <input
                            type="number"
                            min="1"
                            value={exhaleTime}
                            onChange={(e) => setExhaleTime(Number(e.target.value))}
                            className="w-full border p-2 rounded"
                        />
                        {errors.exhale_time && <p className="text-red-600 text-sm">{errors.exhale_time[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Hold Time (optional)</label>
                        <input
                            type="number"
                            min="0"
                            value={holdTime}
                            onChange={(e) => setHoldTime(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full border p-2 rounded"
                        />
                        {errors.hold_time && <p className="text-red-600 text-sm">{errors.hold_time[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Repetitions (optional)</label>
                        <input
                            type="number"
                            min="1"
                            value={repetitions}
                            onChange={(e) => setRepetitions(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full border p-2 rounded"
                        />
                        {errors.repetitions && <p className="text-red-600 text-sm">{errors.repetitions[0]}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={() => setIsPublic(!isPublic)}
                            id="public"
                        />
                        <label htmlFor="public" className="text-sm">Public</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={active}
                            onChange={() => setActive(!active)}
                            id="active"
                        />
                        <label htmlFor="active" className="text-sm">Active</label>
                    </div>
                    <div className="text-right">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default NewExercise;
