import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import React, { useState } from 'react';

const NewUser: React.FC = () => {
    const { token } = usePage().props.auth as { token: string };
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            await axios.post('/api/users', form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            router.visit('/admin/users'); // Redirect after successful creation
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
                <h1 className="mb-4 text-xl font-bold">Create New User</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full rounded border p-2" />
                        {errors.name && <p className="text-sm text-red-600">{errors.name[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full rounded border p-2" />
                        {errors.email && <p className="text-sm text-red-600">{errors.email[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full rounded border p-2" />
                        {errors.password && <p className="text-sm text-red-600">{errors.password[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                        />
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

export default NewUser;
