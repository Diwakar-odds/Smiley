import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaymentMethod {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const PaymentMethodManagement = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>({
    id: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  React.useEffect(() => {
    const fetchMethods = async () => {
      const jwtToken = localStorage.getItem('jwtToken');
      const res = await fetch('http://localhost:5000/api/payments', {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      const data = await res.json();
      setPaymentMethods(data.map((m: { _id: string; cardNumber: string; expiryDate: string; cvv: string }) => ({
        id: m._id,
        cardNumber: m.cardNumber,
        expiryDate: m.expiryDate,
        cvv: m.cvv
      })));
    };
    fetchMethods();
  }, []);

  const handleAddPaymentMethod = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    const res = await fetch('http://localhost:5000/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(newPaymentMethod)
    });
    const data = await res.json();
    setPaymentMethods([...paymentMethods, { ...newPaymentMethod, id: data._id }]);
    setNewPaymentMethod({ id: "", cardNumber: "", expiryDate: "", cvv: "" });
  };

  const handleDeletePaymentMethod = async (id: string) => {
    const jwtToken = localStorage.getItem('jwtToken');
    await fetch(`http://localhost:5000/api/payments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    setPaymentMethods(paymentMethods.filter((m) => m.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="border p-4 rounded-md flex justify-between items-center">
              <div>
                <p>Card Number: {method.cardNumber}</p>
                <p>Expiry Date: {method.expiryDate}</p>
              </div>
              <Button variant="destructive" onClick={() => handleDeletePaymentMethod(method.id)}>Delete</Button>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <Input
            value={newPaymentMethod.cardNumber}
            onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardNumber: e.target.value })}
            placeholder="Card Number"
          />
          <Input
            value={newPaymentMethod.expiryDate}
            onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiryDate: e.target.value })}
            placeholder="Expiry Date (MM/YY)"
          />
          <Input
            value={newPaymentMethod.cvv}
            onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cvv: e.target.value })}
            placeholder="CVV"
          />
          <Button onClick={handleAddPaymentMethod} className="w-full">Add Payment Method</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodManagement;
