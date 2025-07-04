import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import React, { useState } from 'react';

const NewCategory: React.FC = () => {
    const { token } = usePage().props.auth as { token: string };
    const [name, setName] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            await axios.post(
                '/api/categories',
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            router.visit('/admin/categories');
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                console.error('Unexpected error', err);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mx-auto mt-10 max-w-md rounded bg-white p-6 shadow">
                <h1 className="mb-4 text-xl font-bold">Create New Category</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border p-2" />
                        {errors.name && <p className="text-sm text-red-600">{errors.name[0]}</p>}
                    </div>
                    <div className="text-right">
                        <button type="submit" disabled={submitting} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            {submitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default NewCategory;
