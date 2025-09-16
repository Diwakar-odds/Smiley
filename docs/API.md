# Smiley Food API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Menu Items

#### GET /menu
Get all menu items.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Vanilla Softy",
      "description": "Creamy vanilla soft serve ice cream",
      "price": 5.99,
      "category": "softy",
      "image": "/images/vanilla-softy.jpg",
      "available": true
    }
  ]
}
```

#### GET /menu/:id
Get a specific menu item by ID.

#### POST /menu (Admin only)
Create a new menu item.

**Request Body:**
```json
{
  "name": "Chocolate Softy",
  "description": "Rich chocolate soft serve ice cream",
  "price": 6.99,
  "category": "softy",
  "image": "/images/chocolate-softy.jpg"
}
```

#### PUT /menu/:id (Admin only)
Update an existing menu item.

#### DELETE /menu/:id (Admin only)
Delete a menu item.

### Orders

#### GET /orders
Get user's orders (or all orders if admin).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "items": [
        {
          "menuItemId": 1,
          "name": "Vanilla Softy",
          "quantity": 2,
          "price": 5.99
        }
      ],
      "total": 11.98,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### POST /orders
Create a new order.

**Request Body:**
```json
{
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2
    },
    {
      "menuItemId": 3,
      "quantity": 1
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipCode": "12345",
    "phone": "+1234567890"
  }
}
```

#### GET /orders/:id
Get a specific order by ID.

#### PUT /orders/:id/status (Admin only)
Update order status.

**Request Body:**
```json
{
  "status": "confirmed" // pending, confirmed, preparing, ready, delivered, cancelled
}
```

### User Profile

#### GET /profile
Get current user's profile.

#### PUT /profile
Update user profile.

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+1234567890",
  "address": {
    "street": "456 Oak Ave",
    "city": "Newtown",
    "zipCode": "54321"
  }
}
```

### Admin Endpoints

#### GET /admin/dashboard
Get dashboard statistics (admin only).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "totalRevenue": 2500.50,
    "activeUsers": 45,
    "popularItems": [
      {
        "id": 1,
        "name": "Vanilla Softy",
        "orderCount": 35
      }
    ]
  }
}
```

#### GET /admin/users
Get all users (admin only).

#### GET /admin/analytics
Get detailed analytics (admin only).

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (in development mode)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

## File Uploads

For endpoints that accept file uploads (like menu item images), use `multipart/form-data`:

```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('name', 'Menu Item Name');

fetch('/api/menu', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

## WebSocket Events (Future)

Real-time order updates will be available via WebSocket:

- `order:created` - New order placed
- `order:updated` - Order status changed
- `order:delivered` - Order completed

## Testing the API

Use tools like Postman, curl, or the provided examples to test the API:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Get menu items
curl -X GET http://localhost:5000/api/menu

# Create an order (requires authentication)
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"items":[{"menuItemId":1,"quantity":2}]}'
```

---

*This documentation is a work in progress. Please contribute by adding missing endpoints or improving existing documentation.*