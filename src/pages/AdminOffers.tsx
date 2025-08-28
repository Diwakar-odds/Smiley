import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Tabs } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface Offer {
    _id?: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    discountType: string;
    discountValue: number;
}

const defaultOffer: Offer = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    discountType: 'percentage',
    discountValue: 0,
};

const AdminOffers: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [form, setForm] = useState<Offer>(defaultOffer);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const res = await client.get('/offers');
            setOffers(res.data);
        } catch (err) {
            // handle error
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await client.put(`/offers/${editingId}`, form);
            } else {
                await client.post('/offers', form);
            }
            setForm(defaultOffer);
            setEditingId(null);
            fetchOffers();
        } catch (err) {
            // handle error
        }
    };

    const handleEdit = (offer: Offer) => {
        setForm(offer);
        setEditingId(offer._id || null);
    };

    const handleDelete = async (id: string) => {
        try {
            await client.delete(`/offers/${id}`);
            fetchOffers();
        } catch (err) {
            // handle error
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Festive Offers Management</h1>
            <Tabs tabs={[{ label: 'Offers List' }, { label: 'Create/Edit Offer' }]}>
                <div>
                    {offers.length === 0 ? (
                        <p>No offers found.</p>
                    ) : (
                        <div className="grid gap-4">
                            {offers.map((offer) => (
                                <Card key={offer._id} className="flex flex-col gap-2">
                                    <div className="font-semibold">{offer.title}</div>
                                    <div>{offer.description}</div>
                                    <div>
                                        {offer.startDate} to {offer.endDate}
                                    </div>
                                    <div>
                                        {offer.discountType}: {offer.discountValue}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Button onClick={() => handleEdit(offer)} size="sm">Edit</Button>
                                        <Button onClick={() => handleDelete(offer._id!)} size="sm" variant="destructive">Delete</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
                    <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
                    <Input name="startDate" value={form.startDate} onChange={handleChange} placeholder="Start Date (YYYY-MM-DD)" required type="date" />
                    <Input name="endDate" value={form.endDate} onChange={handleChange} placeholder="End Date (YYYY-MM-DD)" required type="date" />
                    <select name="discountType" value={form.discountType} onChange={handleChange} className="border p-2 rounded">
                        <option value="percentage">Percentage</option>
                        <option value="flat">Flat</option>
                    </select>
                    <Input name="discountValue" value={form.discountValue} onChange={handleChange} placeholder="Discount Value" required type="number" />
                    <Button type="submit">{editingId ? 'Update Offer' : 'Create Offer'}</Button>
                    {editingId && <Button type="button" onClick={() => { setForm(defaultOffer); setEditingId(null); }} variant="secondary">Cancel Edit</Button>}
                </form>
            </Tabs>
        </div>
    );
};

export default AdminOffers;
