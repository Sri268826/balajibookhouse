'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProductForm({ params }) {
    const router = useRouter();

    // Unwrap params conceptually if needed in Next.js 15+ but here we just use it directly or via React.use() depending on version
    // We'll use a simple useEffect to fetch the data
    const [productId, setProductId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category_id: '',
        is_latest: false
    });

    const [existingMedia, setExistingMedia] = useState([]);
    const [newMediaFiles, setNewMediaFiles] = useState([]);
    const [newMediaPreview, setNewMediaPreview] = useState([]);

    useEffect(() => {
        // Resolve params for Next.js 15+ compatibility where params is a Promise
        Promise.resolve(params).then((resolved) => {
            setProductId(resolved.id);
        });
    }, [params]);

    useEffect(() => {
        if (!productId) return;

        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch(`/api/products/${productId}`)
                ]);

                const catData = await catRes.json();
                const prodData = await prodRes.json();

                setCategories(catData);

                if (prodRes.ok) {
                    setFormData({
                        name: prodData.name || '',
                        description: prodData.description || '',
                        category_id: prodData.category_id || '',
                        is_latest: !!prodData.is_latest
                    });
                    setExistingMedia(prodData.media || []);
                } else {
                    setError('Product not found or error loading data.');
                }
            } catch (e) {
                setError('Failed to load product data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileChange = (e) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setNewMediaFiles(prev => [...prev, ...files]);

        const previews = files.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('video/') ? 'video' : 'image',
            name: file.name
        }));
        setNewMediaPreview(prev => [...prev, ...previews]);
    };

    const removeExistingMedia = (index) => {
        setExistingMedia(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewMedia = (index) => {
        setNewMediaFiles(prev => prev.filter((_, i) => i !== index));
        setNewMediaPreview(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index].url);
            newPreviews.splice(index, 1);
            return newPreviews;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const uploadedMedia = [...existingMedia];

            // Upload new files
            for (const file of newMediaFiles) {
                const fileForm = new FormData();
                fileForm.append('file', file);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: fileForm
                });

                if (!uploadRes.ok) throw new Error('File upload failed');

                const uploadData = await uploadRes.json();
                uploadedMedia.push({ url: uploadData.url, type: uploadData.type });
            }

            // Update product
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: 0,
                    category_id: formData.category_id ? parseInt(formData.category_id) : null,
                    media: uploadedMedia
                })
            });

            if (!res.ok) throw new Error('Failed to update product');

            router.push('/admin');
            router.refresh();

        } catch (e) {
            setError(e.message || 'Error updating product');
            setSaving(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', margin: 0 }}>Edit Product</h1>
                <Link href="/admin" className="btn btn-secondary">Cancel</Link>
            </div>

            {error && (
                <div style={{ backgroundColor: '#fef2f2', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
                    {error}
                </div>
            )}

            <div className="card" style={{ padding: '2rem' }}>
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label className="form-label">Product Name *</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group mt-4">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-control" rows="5" value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    <div className="grid-cols-2 mt-4" style={{ gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select name="category_id" className="form-control" value={formData.category_id} onChange={handleChange}>
                                <option value="">No Category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '2rem' }}>
                            <input type="checkbox" id="is_latest" name="is_latest" checked={formData.is_latest} onChange={handleChange} style={{ width: '1.25rem', height: '1.25rem' }} />
                            <label htmlFor="is_latest" style={{ fontWeight: '500', cursor: 'pointer' }}>Mark as "Latest Addition"</label>
                        </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

                    <div className="form-group">
                        <label className="form-label">Product Media (Images & Videos)</label>

                        {/* Existing Media Previews */}
                        {existingMedia.length > 0 && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Existing Media:</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                                    {existingMedia.map((m, index) => (
                                        <div key={index} style={{ position: 'relative', paddingTop: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#f1f5f9' }}>
                                            {m.type === 'video' ? (
                                                <video src={m.url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <img src={m.url} alt="preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeExistingMedia(index)}
                                                style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload New Media Area */}
                        <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', marginBottom: '1rem', position: 'relative' }}>
                            <input
                                type="file"
                                multiple
                                accept="image/*,video/mp4"
                                onChange={handleFileChange}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            />
                            <div style={{ color: 'var(--text-muted)' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                <p style={{ fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Upload additional media</p>
                                <p style={{ fontSize: '0.875rem' }}>Supports JPG, PNG, and MP4</p>
                            </div>
                        </div>

                        {/* New Media Previews */}
                        {newMediaPreview.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                                {newMediaPreview.map((m, index) => (
                                    <div key={index} style={{ position: 'relative', paddingTop: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--primary)', backgroundColor: '#fff' }}>
                                        {m.type === 'video' ? (
                                            <video src={m.url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <img src={m.url} alt="preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeNewMedia(index)}
                                            style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                                        >
                                            &times;
                                        </button>
                                        <span style={{ position: 'absolute', bottom: '0', left: '0', right: '0', backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.65rem', textAlign: 'center', padding: '0.25rem 0', fontWeight: 'bold' }}>NEW</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Link href="/admin" className="btn btn-secondary">Cancel</Link>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving changes...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
