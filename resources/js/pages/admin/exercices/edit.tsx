import React, { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import axios from 'axios';

interface Exercice {
    id: number;
    title: string;
    inhale_time: number;
    exhale_time: number;
    hold_time: number | null;
    repetitions: number | null;
    public: boolean;
    active: boolean;
}

interface Props {
    exercise: Exercice;
}

const EditExercise: React.FC = () => {
    const { exercise: exercice } = usePage().props as unknown as Props;

    const [title, setTitle] = useState(exercice.title);
    const [inhaleTime, setInhaleTime] = useState(exercice.inhale_time);
    const [exhaleTime, setExhaleTime] = useState(exercice.exhale_time);
    const [holdTime, setHoldTime] = useState(exercice.hold_time ?? '');
    const [repetitions, setRepetitions] = useState(exercice.repetitions ?? '');
    const [isPublic, setIsPublic] = useState(exercice.public);
    const [active, setActive] = useState(exercice.active);
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            await axios.put(`/api/exercices/${exercice.id}`, {
                title,
                inhale_time: inhaleTime,
                exhale_time: exhaleTime,
                hold_time: holdTime || null,
                repetitions: repetitions || null,
                public: isPublic,
                active,
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
                <h1 className="text-xl font-bold mb-4">Edit Exercise</h1>
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EditExercise;
