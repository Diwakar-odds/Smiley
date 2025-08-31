import { Order, User, MenuItem, sequelize } from "../models/sequelize/index.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { name, phone, address, items, totalPrice, specialRequests, storeId } =
    req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    // Use a transaction to ensure all operations succeed or fail together
    const result = await sequelize.transaction(async (t) => {
      // Create the order
      const order = await Order.create(
        {
          userId: req.user.id,
          name,
          phone,
          address,
          totalPrice,
          specialRequests,
          status: "pending",
          storeId,
        },
        { transaction: t }
      );

      // Create order items in the junction table
      for (const item of items) {
        const menuItem = await MenuItem.findByPk(item.menuItemId, {
          transaction: t,
        });

        if (!menuItem) {
          throw new Error(`Menu item with ID ${item.menuItemId} not found`);
        }

        await order.addMenuItem(menuItem, {
          through: {
            quantity: item.quantity,
            price: menuItem.price,
          },
          transaction: t,
        });
      }

      // Fetch the complete order with items
      const completeOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: MenuItem,
            through: { attributes: ["quantity", "price"] },
          },
          {
            model: User,
            attributes: ["id", "name", "email", "mobile"],
          },
        ],
        transaction: t,
      });

      return completeOrder;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: MenuItem,
          through: { attributes: ["quantity", "price"] },
        },
        {
          model: User,
          attributes: ["id", "name", "email", "mobile"],
        },
      ],
    });

    if (order) {
      // Check if user is authorized to view this order
      if (order.userId !== req.user.id && req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Not authorized to view this order" });
      }

      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders or /api/orders/user
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: MenuItem,
          through: { attributes: ["quantity", "price"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Alias for getMyOrders to maintain compatibility with routes
export const getUserOrders = getMyOrders;

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "mobile"],
        },
        {
          model: MenuItem,
          through: { attributes: ["quantity", "price"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
