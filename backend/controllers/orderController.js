import Order from "../models/Order.js";

const handleError = (res, error, context) => {
  console.error(`Error in ${context}:`, error);
  res.status(500).json({ message: `Failed to ${context}`, error: error.message });
};

export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

  try {
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    handleError(res, error, "create order");
  }
};

export const getOrderById = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Fetch the order by ID and populate user and product details
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product");

    // If the order doesn't exist, return a 404 error
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }


    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    handleError(res, error, "fetch order by ID");
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.json(orders);
  } catch (error) {
    handleError(res, error, "fetch user orders");
  }
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    handleError(res, error, "update order status");
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .populate("items.product")
      .sort("-createdAt");

    const stats = {
      totalOrders: orders.length,
      totalSales: orders.reduce((sum, order) => sum + (order.isPaid ? order.totalPrice : 0), 0),
      paidOrders: orders.filter((order) => order.isPaid).length,
      unpaidOrders: orders.filter((order) => !order.isPaid).length,
    };

    res.json({ orders, stats });
  } catch (error) {
    handleError(res, error, "fetch all orders");
  }
};

export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Order is already paid" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      razorpay_payment_id: req.body.razorpay_payment_id,
      razorpay_order_id: req.body.razorpay_order_id,
      razorpay_signature: req.body.razorpay_signature,
      status: "completed",
      update_time: Date.now(),
      email_address: req.user.email,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!req.user.isAdmin) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Order.deleteOne({ _id: req.params.id });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    handleError(res, error, "delete order");
  }
};

export const editOrderDetails = async (req, res) => {
  try {
    const { shippingAddress, items } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!req.user.isAdmin) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (items) {
      order.items = items;
      order.itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      order.totalPrice = order.itemsPrice + order.shippingPrice;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







