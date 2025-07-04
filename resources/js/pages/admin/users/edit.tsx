import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import React, { useState } from 'react';

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

interface props {
    user: User;
    roles: Role[];
}

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
            <div className="mx-auto mt-10 max-w-2xl rounded bg-white p-6 shadow">
                <h1 className="mb-4 text-xl font-bold">Edit User</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border p-2" />
                        {errors.name && <p className="text-sm text-red-600">{errors.name[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border p-2" />
                        {errors.email && <p className="text-sm text-red-600">{errors.email[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Role</label>
                        <select value={`${roleId}`} onChange={(e) => setRoleId(Number(e.target.value) || null)} className="w-full rounded border p-2">
                            <option value="">-- Select Role --</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && <p className="text-sm text-red-600">{errors.role_id[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">New Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border p-2" />
                        {errors.password && <p className="text-sm text-red-600">{errors.password[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Confirm New Password</label>
                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="w-full rounded border p-2"
                        />
                        {errors.password_confirmation && <p className="text-sm text-red-600">{errors.password_confirmation[0]}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={active} onChange={() => setActive(!active)} id="active" />
                        <label htmlFor="active" className="text-sm">
                            Active
                        </label>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EditUser;
