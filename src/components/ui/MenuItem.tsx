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

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold">₹{price}</span>
          <button
            onClick={() => addToCart(item)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
