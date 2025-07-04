import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import React, { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Information {
    id: number;
    title: string;
    description: string;
    content: string;
    active: boolean;
    category_id: number | null;
}

interface Props {
    information: Information;
    categories: Category[];
    auth: { token: string };
}

const EditInformation: React.FC = () => {
    const { information, categories, auth } = usePage().props as unknown as Props;
    const token = auth.token;

    const [title, setTitle] = useState(information.title);
    const [description, setDescription] = useState(information.description);
    const [content, setContent] = useState(information.content);
    const [categoryId, setCategoryId] = useState<number | ''>(information.category_id || '');
    const [active, setActive] = useState(information.active);
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            await axios.put(
                `/api/informations/${information.id}`,
                {
                    title,
                    description,
                    content,
                    category_id: categoryId || null,
                    active,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            router.visit('/admin/informations');
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
                <h1 className="mb-4 text-xl font-bold">Edit Information</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border p-2" />
                        {errors.title && <p className="text-sm text-red-600">{errors.title[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded border p-2"
                            rows={2}
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Content</label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full rounded border p-2" rows={4} />
                        {errors.content && <p className="text-sm text-red-600">{errors.content[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(Number(e.target.value) || '')}
                            className="w-full rounded border p-2"
                        >
                            <option value="">-- None --</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-sm text-red-600">{errors.category_id[0]}</p>}
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

export default EditInformation;
