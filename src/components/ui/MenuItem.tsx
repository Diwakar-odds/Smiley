import { useState } from 'react';

interface MenuItemData {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface MenuItemProps extends MenuItemData {
  addToCart: (item: MenuItemData) => void;
}

const MenuItem = ({ _id, name, description, price, imageUrl, category, addToCart }: MenuItemProps) => {
  const item = { _id, name, description, price, imageUrl, category };
  const [isAdded, setIsAdded] = useState(false); // Re-introduce useState

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold break-words">{name}</h3>
        <p className="text-gray-600 break-words">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold">₹{price}</span>
          <button
            onClick={() => {
              addToCart(item);
              setIsAdded(true);
              setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
            }}
            className={`font-bold py-2 px-4 rounded ${
              isAdded ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-700 text-white'
            }`}
            disabled={isAdded} // Disable button while "Added" is shown
          >
            {isAdded ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
