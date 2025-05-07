import React from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

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

    const userRole = roles.find(role => role.id === user.role_id)?.name || 'None';

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-6">User Details</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Name</label>
                        <p className="p-2 border rounded bg-gray-100">{user.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <p className="p-2 border rounded bg-gray-100">{user.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Role</label>
                        <p className="p-2 border rounded bg-gray-100">{userRole}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Active</label>
                        <p className="p-2 border rounded bg-gray-100">
                            {user.active ? 'Yes' : 'No'}
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ShowUser;
