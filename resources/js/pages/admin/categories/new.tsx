import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import axios from 'axios';

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
            await axios.post('/api/categories', { name }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

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
            <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-4">Create New Category</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name[0]}</p>}
                    </div>
                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {submitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default NewCategory;
