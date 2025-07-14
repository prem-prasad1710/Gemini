# Gemini Frontend Clone

A fully functional, responsive, and visually appealing frontend for a Gemini-style conversational AI chat application built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Live Demo

[View Live Application](https://your-deployment-url.vercel.app)

## 📋 Features

### ✅ Authentication
- **OTP-based Login/Signup** with country code selection
- Country data fetched from [restcountries.com](https://restcountries.com) API
- Simulated OTP send and validation using setTimeout
- Form validation with React Hook Form + Zod
- Persistent authentication state using localStorage

### ✅ Dashboard
- **Chatroom Management**: Create and delete chatrooms
- **Search Functionality**: Debounced search to filter chatrooms by title
- **Toast Notifications**: Real-time feedback for all actions
- **Responsive Design**: Mobile-first approach with collapsible sidebar

### ✅ Chat Interface
- **Real-time Messaging**: User and simulated AI responses
- **Typing Indicator**: "Gemini is typing..." animation
- **Message Features**:
  - Timestamps for all messages
  - Copy-to-clipboard on message hover
  - Image upload support (base64 preview)
  - Auto-scroll to latest message
- **Infinite Scroll**: Reverse pagination for older messages (20 per page)
- **AI Response Simulation**: Throttled responses with realistic delays

### ✅ Global UX Features
- **Dark Mode Toggle**: Persistent theme switching
- **Mobile Responsive**: Optimized for all screen sizes
- **Loading Skeletons**: Smooth loading states
- **Keyboard Accessibility**: Full keyboard navigation support
- **Error Handling**: Comprehensive error states and recovery

## 🛠️ Tech Stack

| Feature | Technology |
|---------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand |
| **Form Validation** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **HTTP Client** | Axios |
| **Deployment** | Vercel |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home/Auth page
├── components/            # React components
│   ├── auth/             # Authentication components
│   │   ├── AuthPage.tsx
│   │   ├── PhoneInput.tsx
│   │   ├── OTPVerification.tsx
│   │   └── ProtectedRoute.tsx
│   ├── chat/             # Chat interface components
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageInput.tsx
│   │   └── TypingIndicator.tsx
│   ├── dashboard/        # Dashboard components
│   │   ├── Dashboard.tsx
│   │   ├── DashboardSidebar.tsx
│   │   └── ChatroomCard.tsx
│   ├── providers/        # Context providers
│   │   ├── ThemeProvider.tsx
│   │   └── ToastProvider.tsx
│   └── ui/              # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Skeleton.tsx
├── lib/                  # Utility functions
│   ├── utils.ts         # Helper functions
│   └── validations.ts   # Zod schemas
├── services/            # API services
│   └── api.ts          # API calls and simulations
└── store/              # State management
    └── index.ts        # Zustand store
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/gemini-frontend-clone.git
   cd gemini-frontend-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Implementation Details

### Form Validation
- **Zod Schemas**: Type-safe validation for all forms
- **React Hook Form**: Efficient form handling with minimal re-renders
- **Real-time Validation**: Instant feedback on form errors

### State Management
- **Zustand**: Lightweight state management with persistence
- **localStorage**: Automatic persistence for auth and chat data
- **Optimistic Updates**: Immediate UI updates for better UX

### Message Handling
- **AI Response Simulation**: 2-5 second random delays using setTimeout
- **Throttling**: Prevents spam and simulates realistic AI processing
- **Message Pagination**: Client-side pagination with infinite scroll

### Infinite Scroll Implementation
- **Reverse Scroll**: Load older messages when scrolling to top
- **Scroll Position Management**: Maintains scroll position after loading
- **Performance Optimization**: Throttled scroll event handlers

### Image Upload
- **File Validation**: Type and size checking (5MB limit)
- **Base64 Conversion**: Local preview without backend
- **Image Preview**: Thumbnail display with remove option

### Accessibility
- **Keyboard Navigation**: Full keyboard support for all interactions
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Logical tab order and focus indicators
- **Color Contrast**: WCAG compliant color schemes

### Performance Optimizations
- **Code Splitting**: Automatic route-based splitting with Next.js
- **Lazy Loading**: Components loaded on demand
- **Debounced Search**: Reduces API calls and improves performance
- **Memoization**: React.memo and useMemo for expensive operations

## 🎨 Design Features

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: Tailored layouts for tablet and desktop
- **Touch-friendly**: Large touch targets for mobile users

### Dark Mode
- **System Preference**: Respects user's system theme
- **Manual Toggle**: User can override system preference
- **Smooth Transitions**: Animated theme switching

### Loading States
- **Skeleton Screens**: Smooth loading placeholders
- **Progressive Loading**: Content appears as it loads
- **Error States**: Clear error messages with recovery options

## 🧪 Testing the Application

### Authentication Flow
1. Enter phone number with country code
2. Click "Send OTP" (simulated 2-second delay)
3. Enter any 6-digit number as OTP
4. Successful authentication redirects to dashboard

### Chat Features
1. Create a new chatroom from the sidebar
2. Send messages (text and images)
3. Observe AI typing indicator and responses
4. Test copy-to-clipboard on message hover
5. Scroll to top to load older messages

### Responsive Testing
- Resize browser window to test responsive design
- Use mobile device or browser dev tools
- Test touch interactions and gestures

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy with default settings
4. Automatic deployments on new commits

### Other Platforms
- **Netlify**: Drag and drop build folder
- **Railway**: Connect GitHub repository
- **AWS Amplify**: Connect repository and deploy

## 🔧 Environment Variables

No environment variables required for basic functionality. All features work with simulated data.

## 📱 Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Zustand](https://zustand-demo.pmnd.rs/) for simple state management
- [Lucide](https://lucide.dev/) for beautiful icons
- [restcountries.com](https://restcountries.com/) for country data API

## 📞 Contact

For any questions or feedback, please reach out:
- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com

---

Built with ❤️ for Kuvaka Tech Frontend Developer Assignment
#   G e m i n i  
 