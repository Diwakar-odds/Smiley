# API Documentation

Base URL: `http://localhost:5000/api` (development)

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Table of Contents
- [Authentication](#authentication-endpoints)
- [User](#user-endpoints)
- [Menu](#menu-endpoints)
- [Orders](#order-endpoints)
- [Cart](#cart-endpoints)
- [Addresses](#address-endpoints)
- [Reviews](#review-endpoints)
- [Offers](#offer-endpoints)
- [Payments](#payment-endpoints)
- [Admin](#admin-endpoints)
- [Notifications](#notification-endpoints)

---

## Authentication Endpoints

### Send OTP
Send OTP to mobile number for verification.

**Endpoint:** `POST /api/auth/send-otp`

**Request Body:**
```json
{
  "mobile": "+1234567890"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "mobile": "+1234567890"
}
```

### Verify OTP
Verify OTP and receive JWT token.

**Endpoint:** `POST /api/auth/verify-otp`

**Request Body:**
```json
{
  "mobile": "+1234567890",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "mobile": "+1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Get Current User
Get authenticated user details.

**Endpoint:** `GET /api/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": 1,
  "mobile": "+1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Logout
Logout current user.

**Endpoint:** `POST /api/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Endpoints

### Update Profile
Update user profile information.

**Endpoint:** `PUT /api/users/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+1234567890"
  }
}
```

### Change Password
Change user password.

**Endpoint:** `PUT /api/users/password`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "oldPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Menu Endpoints

### Get All Menu Items
Retrieve all menu items with optional filters.

**Endpoint:** `GET /api/menu`

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search by name or description
- `available` (optional): Filter by availability (true/false)

**Response (200):**
```json
{
  "success": true,
  "items": [
    {
      "id": 1,
      "name": "Margherita Pizza",
      "description": "Classic pizza with tomato and mozzarella",
      "price": 12.99,
      "category": "Pizza",
      "image": "/images/products/pizza1.jpg",
      "available": true,
      "rating": 4.5,
      "reviews": 120
    }
  ]
}
```

### Get Single Menu Item
Get details of a specific menu item.

**Endpoint:** `GET /api/menu/:id`

**Response (200):**
```json
{
  "success": true,
  "item": {
    "id": 1,
    "name": "Margherita Pizza",
    "description": "Classic pizza with tomato and mozzarella",
    "price": 12.99,
    "category": "Pizza",
    "image": "/images/products/pizza1.jpg",
    "available": true,
    "ingredients": ["Tomato", "Mozzarella", "Basil"],
    "allergens": ["Gluten", "Dairy"]
  }
}
```

### Create Menu Item (Admin)
Create a new menu item.

**Endpoint:** `POST /api/menu`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Pepperoni Pizza",
  "description": "Pizza with pepperoni",
  "price": 14.99,
  "category": "Pizza",
  "image": "/images/products/pizza2.jpg",
  "available": true
}
```

**Response (201):**
```json
{
  "success": true,
  "item": {
    "id": 2,
    "name": "Pepperoni Pizza",
    "description": "Pizza with pepperoni",
    "price": 14.99,
    "category": "Pizza"
  }
}
```

### Update Menu Item (Admin)
Update an existing menu item.

**Endpoint:** `PUT /api/menu/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:** (any fields to update)
```json
{
  "price": 13.99,
  "available": false
}
```

**Response (200):**
```json
{
  "success": true,
  "item": {
    "id": 1,
    "name": "Margherita Pizza",
    "price": 13.99,
    "available": false
  }
}
```

### Delete Menu Item (Admin)
Delete a menu item.

**Endpoint:** `DELETE /api/menu/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

---

## Order Endpoints

### Get User Orders
Get all orders for the authenticated user.

**Endpoint:** `GET /api/orders`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "id": 1,
      "orderNumber": "ORD-20250101-001",
      "status": "delivered",
      "totalPrice": 25.98,
      "items": [
        {
          "id": 1,
          "name": "Margherita Pizza",
          "quantity": 2,
          "price": 12.99
        }
      ],
      "deliveryAddress": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001"
      },
      "createdAt": "2025-01-01T12:00:00.000Z",
      "deliveredAt": "2025-01-01T13:30:00.000Z"
    }
  ]
}
```

### Get Single Order
Get details of a specific order.

**Endpoint:** `GET /api/orders/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "order": {
    "id": 1,
    "orderNumber": "ORD-20250101-001",
    "status": "delivered",
    "totalPrice": 25.98,
    "items": [...],
    "deliveryAddress": {...},
    "payment": {
      "method": "card",
      "status": "completed"
    },
    "timeline": [
      {
        "status": "placed",
        "timestamp": "2025-01-01T12:00:00.000Z"
      },
      {
        "status": "preparing",
        "timestamp": "2025-01-01T12:10:00.000Z"
      }
    ]
  }
}
```

### Create Order
Place a new order.

**Endpoint:** `POST /api/orders`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2,
      "customizations": "Extra cheese"
    }
  ],
  "addressId": 1,
  "paymentMethod": "card",
  "specialInstructions": "Ring doorbell twice"
}
```

**Response (201):**
```json
{
  "success": true,
  "order": {
    "id": 1,
    "orderNumber": "ORD-20250101-001",
    "status": "placed",
    "totalPrice": 25.98,
    "estimatedDelivery": "2025-01-01T13:30:00.000Z"
  }
}
```

### Cancel Order
Cancel a pending order.

**Endpoint:** `POST /api/orders/:id/cancel`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

## Address Endpoints

### Get User Addresses
Get all saved addresses for the user.

**Endpoint:** `GET /api/addresses`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "addresses": [
    {
      "id": 1,
      "label": "Home",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "isDefault": true
    }
  ]
}
```

### Add Address
Add a new address.

**Endpoint:** `POST /api/addresses`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "label": "Office",
  "street": "456 Business Ave",
  "city": "New York",
  "state": "NY",
  "zipCode": "10002",
  "isDefault": false
}
```

**Response (201):**
```json
{
  "success": true,
  "address": {
    "id": 2,
    "label": "Office",
    "street": "456 Business Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10002"
  }
}
```

### Update Address
Update an existing address.

**Endpoint:** `PUT /api/addresses/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "address": {...}
}
```

### Delete Address
Delete an address.

**Endpoint:** `DELETE /api/addresses/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

---

## Review Endpoints

### Get Item Reviews
Get reviews for a menu item.

**Endpoint:** `GET /api/reviews/item/:itemId`

**Response (200):**
```json
{
  "success": true,
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excellent pizza!",
      "user": {
        "name": "John Doe"
      },
      "createdAt": "2025-01-01T12:00:00.000Z"
    }
  ],
  "stats": {
    "average": 4.5,
    "total": 120
  }
}
```

### Create Review
Submit a review for an order item.

**Endpoint:** `POST /api/reviews`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "orderId": 1,
  "menuItemId": 1,
  "rating": 5,
  "comment": "Excellent pizza!"
}
```

**Response (201):**
```json
{
  "success": true,
  "review": {
    "id": 1,
    "rating": 5,
    "comment": "Excellent pizza!"
  }
}
```

---

## Offer Endpoints

### Get Active Offers
Get all active promotional offers.

**Endpoint:** `GET /api/offers`

**Response (200):**
```json
{
  "success": true,
  "offers": [
    {
      "id": 1,
      "title": "20% OFF First Order",
      "description": "Get 20% off on your first order",
      "code": "FIRST20",
      "discountPercent": 20,
      "validUntil": "2025-12-31T23:59:59.000Z",
      "minOrderValue": 15.00
    }
  ]
}
```

### Apply Offer
Apply an offer code to calculate discount.

**Endpoint:** `POST /api/offers/apply`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "code": "FIRST20",
  "orderTotal": 50.00
}
```

**Response (200):**
```json
{
  "success": true,
  "discount": 10.00,
  "finalTotal": 40.00,
  "offer": {
    "title": "20% OFF First Order",
    "code": "FIRST20"
  }
}
```

---

## Admin Endpoints

### Get Dashboard Stats
Get admin dashboard statistics.

**Endpoint:** `GET /api/admin/stats`

**Headers:** `Authorization: Bearer <admin_token>`

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalOrders": 1250,
    "todayOrders": 45,
    "totalRevenue": 35000.00,
    "todayRevenue": 1200.00,
    "activeUsers": 856,
    "pendingOrders": 12
  }
}
```

### Get All Orders (Admin)
Get all orders with filters.

**Endpoint:** `GET /api/admin/orders`

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `status`: Filter by status
- `date`: Filter by date
- `page`: Pagination

**Response (200):**
```json
{
  "success": true,
  "orders": [...],
  "pagination": {
    "page": 1,
    "total": 100,
    "pages": 10
  }
}
```

### Update Order Status (Admin)
Update the status of an order.

**Endpoint:** `PUT /api/admin/orders/:id/status`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "preparing"
}
```

**Response (200):**
```json
{
  "success": true,
  "order": {
    "id": 1,
    "status": "preparing"
  }
}
```

---

## Notification Endpoints

### Subscribe to Push Notifications
Subscribe to push notifications.

**Endpoint:** `POST /api/notifications/subscribe`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "subscription": {
    "endpoint": "https://...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Subscribed to notifications"
}
```

### Unsubscribe from Push Notifications
Unsubscribe from push notifications.

**Endpoint:** `POST /api/notifications/unsubscribe`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Unsubscribed from notifications"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

**Example (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation error",
  "message": "Invalid mobile number format"
}
```

**Example (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

**Example (403 Forbidden):**
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Admin access required"
}
```

**Example (404 Not Found):**
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Resource not found"
}
```

**Example (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Authentication endpoints:** 5 requests per minute per IP
- **Other endpoints:** 100 requests per minute per user

When rate limit is exceeded:
```json
{
  "success": false,
  "error": "Rate Limit Exceeded",
  "message": "Too many requests, please try again later",
  "retryAfter": 60
}
```

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response includes:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

For more information or support, please refer to the [main documentation](./README.md) or open an issue on GitHub.
