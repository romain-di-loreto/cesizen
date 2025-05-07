import Header from '@/components/admin-header-component';
import React, { ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <div>
            {/* Header */}
            <Header />

            {/* Page Content */}
            <main className="p-6">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
