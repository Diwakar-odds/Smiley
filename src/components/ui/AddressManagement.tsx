import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

const AddressManagement = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Address>({
    id: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  React.useEffect(() => {
    const fetchAddresses = async () => {
      const jwtToken = localStorage.getItem('jwtToken');
      const res = await fetch('http://localhost:5000/api/addresses', {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      const data = await res.json();
      setAddresses(data.map(a => ({
        id: a._id,
        street: a.street,
        city: a.city,
        state: a.state,
        zip: a.zip
      })));
    };
    fetchAddresses();
  }, []);

  const handleAddAddress = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    const res = await fetch('http://localhost:5000/api/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(newAddress)
    });
    const data = await res.json();
    setAddresses([...addresses, { ...newAddress, id: data._id }]);
    setNewAddress({ id: "", street: "", city: "", state: "", zip: "" });
  };

  const handleDeleteAddress = async (id: string) => {
    const jwtToken = localStorage.getItem('jwtToken');
    await fetch(`http://localhost:5000/api/addresses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    setAddresses(addresses.filter(a => a.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="border p-4 rounded-md flex justify-between items-center">
              <div>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zip}</p>
              </div>
              <Button variant="destructive" onClick={() => handleDeleteAddress(address.id)}>Delete</Button>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <Input
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            placeholder="Street"
          />
          <Input
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            placeholder="City"
          />
          <Input
            value={newAddress.state}
            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            placeholder="State"
          />
          <Input
            value={newAddress.zip}
            onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
            placeholder="Zip Code"
          />
          <Button onClick={handleAddAddress} className="w-full">Add Address</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressManagement;
