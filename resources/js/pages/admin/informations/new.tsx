import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import axios from 'axios';

interface Category {
    id: number;
    name: string;
}

const NewInformation: React.FC = () => {
    const { token } = usePage().props.auth as { token: string };
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [active, setActive] = useState(true);
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [categories, setCategories] = useState<Category[]>([]);

    // Fetch categories
    useEffect(() => {
        axios.get('/api/categories', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                count: 1000, // assuming a reasonable upper limit
            },
        }).then((res) => {
            setCategories(res.data.data);
        }).catch((err) => {
            console.error('Failed to load categories', err);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            await axios.post('/api/informations', {
                title,
                description,
                content,
                category_id: categoryId || null,
                active,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

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
            <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-4">Create New Information</h1>
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
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border p-2 rounded"
                            rows={2}
                        />
                        {errors.description && <p className="text-red-600 text-sm">{errors.description[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border p-2 rounded"
                            rows={4}
                        />
                        {errors.content && <p className="text-red-600 text-sm">{errors.content[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(Number(e.target.value) || '')}
                            className="w-full border p-2 rounded"
                        >
                            <option value="">-- None --</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-600 text-sm">{errors.category_id[0]}</p>}
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
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default NewInformation;
