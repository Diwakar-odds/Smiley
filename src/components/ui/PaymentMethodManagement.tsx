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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      cardNumber: "**** **** **** 1234",
      expiryDate: "12/25",
      cvv: "***",
    },
  ]);

  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>({
    id: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleAddPaymentMethod = () => {
    setPaymentMethods([...paymentMethods, { ...newPaymentMethod, id: Date.now().toString() }]);
    setNewPaymentMethod({ id: "", cardNumber: "", expiryDate: "", cvv: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="border p-4 rounded-md">
              <p>Card Number: {method.cardNumber}</p>
              <p>Expiry Date: {method.expiryDate}</p>
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
