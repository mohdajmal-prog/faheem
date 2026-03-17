# 🍕 Ambis Cafe - Complete Food Ordering System

A modern, full-stack food ordering application built with React Native (Expo), Node.js, and Supabase.

## 🌟 Features

### 📱 Mobile App (React Native/Expo)
- **Modern UI/UX** with consistent Ionicons (no emojis)
- **Real-time SMS OTP Authentication** via Twilio
- **Dynamic Menu System** with categories and search
- **Shopping Cart** with quantity management
- **Order Tracking** with QR codes
- **Advertisement Banner** system
- **Dark/Light Theme** support
- **Pause/Resume** functionality for maintenance

### 🖥️ Admin Panel
- **Order Management** with status updates
- **Menu Management** (add/edit/delete items)
- **Advertisement Management**
- **Analytics Dashboard**
- **QR Code Scanner** for order completion

### 🔧 Backend (Node.js/Express)
- **RESTful API** with comprehensive endpoints
- **JWT Authentication** with secure token handling
- **Twilio SMS Integration** for OTP delivery
- **Supabase Database** integration
- **WebSocket Support** for real-time updates
- **Rate Limiting** and security middleware

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase account
- Twilio account (for SMS OTP)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ambis-cafe.git
cd ambis-cafe
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
node server.js
```

### 3. Mobile App Setup
```bash
cd cafe
npm install
npx expo start
```

### 4. Admin Panel Setup
```bash
cd cafe_admin
npm install
npx expo start
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

# JWT
JWT_SECRET=your_jwt_secret_32_chars_minimum

# Twilio (for SMS OTP)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Server
PORT=3006
NODE_ENV=development
```

### Database Setup
```bash
# Run database migrations
node setup-database.js
node setup-advertisements.js
```

## 📱 App Structure

```
cafe_2/
├── backend/           # Node.js API server
├── cafe/             # Customer mobile app
├── cafe_admin/       # Admin mobile app
└── docs/            # Documentation files
```

## 🔑 Key Features Implemented

### ✅ Authentication System
- Phone number + OTP verification
- Real Twilio SMS integration
- JWT token management
- Secure user sessions

### ✅ UI/UX Improvements
- Replaced all emojis with Ionicons
- Consistent design system
- Smooth animations
- Responsive layouts

### ✅ Order Management
- Real-time order tracking
- QR code generation
- Status updates
- Order history

### ✅ Advertisement System
- Dynamic banner management
- Fallback content support
- Admin panel integration

## 🧪 Testing

### Backend API Testing
```bash
cd backend
node test-twilio-otp.js      # Test SMS functionality
node test-advertisements.js   # Test ads system
node test-otp-server.js      # Test complete OTP flow
```

### Database Testing
```bash
node clear-otps.js           # Clear old OTPs
node setup-ads-simple.js     # Setup advertisements
```

## 🚀 Deployment

### Backend (Vercel)
```bash
cd backend
vercel --prod
```

### Mobile Apps (Expo)
```bash
cd cafe
expo build:android
expo build:ios
```

## 📊 API Endpoints

### Authentication
- `POST /auth/send-otp` - Send SMS OTP
- `POST /auth/verify-otp` - Verify OTP & login

### Menu
- `GET /api/menu` - Get menu items
- `POST /api/menu` - Add menu item (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id` - Update order status

### Advertisements
- `GET /api/advertisements` - Get active ads
- `POST /api/advertisements` - Create ad (admin)

## 🔒 Security Features

- JWT token authentication
- Rate limiting on OTP requests
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Environment variable protection

## 🛠️ Tech Stack

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for routing
- **Reanimated** for animations
- **Ionicons** for consistent icons

### Backend
- **Node.js** with Express
- **Supabase** for database
- **Twilio** for SMS
- **JWT** for authentication
- **WebSocket** for real-time updates

### Database
- **PostgreSQL** (via Supabase)
- **Real-time subscriptions**
- **Row Level Security (RLS)**

## 📝 Recent Updates

### v2.0.0 - Icon System & SMS Integration
- ✅ Replaced all emojis with Ionicons
- ✅ Implemented real Twilio SMS OTP
- ✅ Added advertisements system
- ✅ Enhanced error handling
- ✅ Improved user experience
- ✅ Added comprehensive testing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@ambiscafe.com or create an issue on GitHub.

## 🙏 Acknowledgments

- Expo team for the amazing framework
- Supabase for the backend infrastructure
- Twilio for SMS services
- React Native community

---

**Made with ❤️ for Ambis Cafe**