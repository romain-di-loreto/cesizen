import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import axios from 'axios';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;
    role_id: number | null;
}

interface props { user: User, roles: Role[] }

const EditUser: React.FC = () => {
    const { user, roles } = usePage().props as unknown as props;

    const [userId] = useState(user.id);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [active, setActive] = useState(user.active);
    const [roleId, setRoleId] = useState(user.role_id);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const payload: any = {
            name,
            email,
            active,
            role_id: roleId || null,
        };

        if (password) {
            payload.password = password;
            payload.password_confirmation = passwordConfirmation;
        }

        try {
            await axios.put(`/api/users/${userId}`, payload);

            router.visit('/admin/users');
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
                <h1 className="text-xl font-bold mb-4">Edit User</h1>
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
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        {errors.email && <p className="text-red-600 text-sm">{errors.email[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Role</label>
                        <select
                            value={`${roleId}`}
                            onChange={(e) => setRoleId(Number(e.target.value) || null)}
                            className="w-full border p-2 rounded"
                        >
                            <option value="">-- Select Role --</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && <p className="text-red-600 text-sm">{errors.role_id[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        {errors.password && <p className="text-red-600 text-sm">{errors.password[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Confirm New Password</label>
                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        {errors.password_confirmation && <p className="text-red-600 text-sm">{errors.password_confirmation[0]}</p>}
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

export default EditUser;
