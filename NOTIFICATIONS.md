# Smiley Food App - Notification System

This application now includes comprehensive notification features to keep admins informed about new orders and order status updates in real-time.

## 🚀 Features Implemented

### 1. SMS Notifications 📱
- **New Order Alerts**: Automatic SMS sent to admin phone numbers when customers place orders
- **Order Status Updates**: SMS notifications when order status changes (pending → accepted → completed)
- **Multi-Admin Support**: Configure multiple admin phone numbers for notifications
- **Reliable Delivery**: Uses Twilio SMS service for reliable message delivery

### 2. Browser Push Notifications 🔔
- **Real-time Alerts**: Instant browser notifications even when the dashboard tab is not active
- **Service Worker**: Background processing for push notifications
- **Interactive Notifications**: Click notifications to navigate directly to orders page
- **User Permissions**: Proper permission handling and user consent

### 3. Admin Dashboard Integration 💻
- **Notification Settings Page**: Dedicated settings to manage notification preferences
- **Push Notification Controls**: Enable/disable browser notifications with test functionality
- **Order Notifications**: Visual indicators for new orders in the dashboard
- **Real-time Updates**: Dashboard polls for new orders every 30 seconds

## 📋 Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure the following:

```bash
# Twilio Configuration (for SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Admin Phone Numbers (for SMS notifications)
ADMIN_PHONE_1=+1234567890  # Primary admin phone
ADMIN_PHONE_2=+0987654321  # Secondary admin phone (optional)

# Web Push VAPID Keys (for browser notifications)
VAPID_PUBLIC_KEY=BM8EEfrZjgUoGo8U70Wc-xbWqmtkDPaLByJcFZpcHPjzK7l67eInGTsD0Kx2VdFn9En4QHUsO7yWHxTvPqNiHMQ
VAPID_PRIVATE_KEY=--MuVPBZA6Fhdn6AXAXc13sNNGjUECuMXV1JNsKVsTE
```

### 2. Generate New VAPID Keys (Recommended for Production)

```bash
cd server
npx web-push generate-vapid-keys
```

Then update your `.env` file with the generated keys.

### 3. Install Dependencies

```bash
cd server
npm install
```

### 4. Test SMS Functionality

```bash
cd server
node scripts/testNotifications.js
```

## 🔧 How It Works

### SMS Notifications Flow
1. Customer places an order
2. Order is created in database
3. `adminNotificationService.js` sends SMS to all configured admin numbers
4. Admins receive SMS with order details and customer information

### Push Notifications Flow
1. Admin visits dashboard and enables push notifications
2. Browser requests permission and subscribes to push service
3. Subscription is stored on server
4. When new orders arrive, server sends push notifications to all subscribed admins
5. Service worker displays notification even if browser tab is inactive

### Dashboard Integration
1. Dashboard polls `/api/orders` every 30 seconds for new orders
2. New orders show notification badge and banner
3. Clicking notification navigates to orders page
4. Push notification settings available in dedicated settings tab

## 📱 Notification Settings Page

Admins can access notification settings through the dashboard sidebar:
- **SMS Status**: Shows that SMS notifications are active
- **Push Notifications**: Enable/disable browser push notifications
- **Test Functionality**: Send test notifications to verify setup
- **Permission Handling**: Clear guidance on browser permission requirements

## 🛠 API Endpoints

### Push Notification Endpoints
- `POST /api/push/subscribe` - Subscribe to push notifications
- `POST /api/push/unsubscribe` - Unsubscribe from push notifications
- `POST /api/push/test` - Send test push notification
- `GET /api/push/status` - Get subscription status

## 🔒 Security Features

- **Admin Only**: All notification features are restricted to admin users
- **JWT Authentication**: Secure API endpoints with JWT tokens
- **Permission Validation**: Proper browser permission handling
- **Error Handling**: Graceful fallbacks when notifications fail

## 🎯 Notification Content

### SMS Format
```
🍽️ NEW ORDER ALERT!

Order #123
Customer: John Doe
Phone: +1234567890
Total: ₹150
Items: Aloo Patty (2x), Chocolate Shake (1x)

Please check admin dashboard for details.
```

### Push Notification Format
- **Title**: "🍽️ New Order Alert!"
- **Body**: "Order #123 from John Doe - ₹150"
- **Actions**: "View Order" button
- **Data**: Order details for navigation

## 🚨 Troubleshooting

### SMS Not Working
1. Check Twilio credentials in `.env`
2. Verify admin phone numbers are in correct format (+country code)
3. Check Twilio account balance and phone number verification
4. Review server logs for Twilio error messages

### Push Notifications Not Working
1. Ensure HTTPS (required for push notifications)
2. Check browser compatibility (Chrome, Firefox, Safari)
3. Verify VAPID keys are correctly configured
4. Check browser permission status
5. Review browser console for service worker errors

### Dashboard Not Updating
1. Check network connectivity
2. Verify admin authentication
3. Review browser console for API errors
4. Check if polling is active (30-second intervals)

## 🔄 Future Enhancements

Potential improvements that could be added:
- **Email Notifications**: Send order alerts via email
- **Slack Integration**: Post order notifications to Slack channels
- **WhatsApp Notifications**: Use WhatsApp Business API
- **Real-time WebSocket**: Replace polling with WebSocket connections
- **Notification History**: Track and display notification delivery status
- **Custom Sound Alerts**: Add audio alerts for critical notifications
- **Escalation Rules**: Auto-escalate unacknowledged orders after timeout

## 📊 Testing

The notification system includes:
- **Test SMS Script**: `server/scripts/testNotifications.js`
- **Test Push Notifications**: Available in admin dashboard settings
- **Error Handling**: Comprehensive error logging and graceful fallbacks
- **Permission Validation**: Browser permission status checking

## 🎉 Benefits

This notification system provides:
- **Instant Awareness**: Admins know immediately when orders arrive
- **Multi-Channel Coverage**: Both SMS and browser notifications for reliability
- **Mobile Support**: SMS works on any mobile device
- **Desktop Support**: Push notifications work on desktop browsers
- **User-Friendly**: Easy setup and management through admin dashboard