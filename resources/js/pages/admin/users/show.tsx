import AdminLayout from '@/layouts/admin-layout';
import { usePage } from '@inertiajs/react';
import React from 'react';

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

const ShowUser: React.FC = () => {
    const { user, roles } = usePage().props as unknown as props;

    const userRole = roles.find((role) => role.id === user.role_id)?.name || 'None';

    return (
        <AdminLayout>
            <div className="mx-auto mt-10 max-w-2xl rounded bg-white p-6 shadow">
                <h1 className="mb-6 text-xl font-bold">User Details</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Name</label>
                        <p className="rounded border bg-gray-100 p-2">{user.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <p className="rounded border bg-gray-100 p-2">{user.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Role</label>
                        <p className="rounded border bg-gray-100 p-2">{userRole}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Active</label>
                        <p className="rounded border bg-gray-100 p-2">{user.active ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ShowUser;
