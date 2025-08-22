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
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
    },
  ]);

  const [newAddress, setNewAddress] = useState<Address>({
    id: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleAddAddress = () => {
    setAddresses([...addresses, { ...newAddress, id: Date.now().toString() }]);
    setNewAddress({ id: "", street: "", city: "", state: "", zip: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="border p-4 rounded-md">
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zip}</p>
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
