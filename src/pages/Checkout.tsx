import { useEffect, useState } from 'react';
import OrderForm from '../components/forms/OrderForm';

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Fetch cart from localStorage or backend if needed
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(storedCart);
        const calculatedTotal = storedCart.reduce((acc: number, item: { price: number; quantity: number }) => {
            const itemTotal = item.price * item.quantity;
            return acc + itemTotal;
        }, 0);
        setTotal(calculatedTotal);
    }, []);

    const clearCart = () => {
        setCart([]);
        setTotal(0);
        localStorage.removeItem('cart');
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>
            <OrderForm cart={cart} total={total} clearCart={clearCart} />
            {/* You can add a cart summary here if needed */}
        </div>
    );
};

export default Checkout;
