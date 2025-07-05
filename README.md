# 📚 BiblioPhile

A modern, fully responsive library management system built with React 19, TypeScript, Vite, Redux and Tailwind CSS. Effortlessly manage books, borrowing, and library stats with a beautiful, intuitive UI.

## 🌐 Live Demo

**Frontend:** [https://b5-l2-assignement4-redux-bibliophil.vercel.app/](https://b5-l2-assignement4-redux-bibliophil.vercel.app/)

---

## ✨ Features

### 📖 Book Management

- Add, edit, and delete books with detailed info (title, author, genre, ISBN, copies)
- Confirmation modals for safe deletion
- Pagination for large collections
- Real-time UI updates with optimistic feedback

### 📊 Library Statistics

- Live stats: total books, available copies, borrowing activity
- Genre breakdown and availability status

### 🔄 Borrowing System

- Borrow books with due date tracking
- Borrowing summary and history

### 🎨 User Experience

- Fully responsive: mobile, tablet, desktop
- Modern, clean UI with smooth animations
- Skeleton loaders and toast notifications

### 🛠️ Tech Stack

- **React 19** (with useOptimistic)
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Redux Toolkit & RTK Query**
- **React Router**
- **Zod** (validation)
- **Lucide React** (icons)
- **Sonner** (toasts)

---

## 📁 Project Structure

```
src/
  components/
    books/          # Book modals, cards, and book UI
    layout/         # Navbar, Footer, Layout wrapper
    ui/             # Reusable UI elements (Button, Card, etc.)
    borrowSummary/  # Borrow summary page
    home/           # Home page sections
  config/           # API config
  lib/              # Utility functions
  redux/
    api/            # RTK Query API slices
    hooks.ts        # Redux hooks
    store.ts        # Redux store setup
  routes/           # App routes
  types/            # TypeScript types
  main.tsx         # App entry point
  App.tsx          # Root component
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd minimal-library-management-system
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔧 Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code
- `npm run type-check` — Type check

---

## 🌟 Highlights

- **Optimistic UI**: Instant feedback for book actions using React 19's `useOptimistic`
- **Validation**: All forms validated with Zod
- **Responsive**: Mobile-first layouts, touch-friendly, adaptive grids
- **State Management**: Redux Toolkit + RTK Query for caching, background updates, and error handling
- **Modern UI**: Brand colors, gradients, and smooth transitions
- **Security**: Input validation, error boundaries, HTTPS in production

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Commit and push your changes
4. Open a Pull Request

## 📄 License

MIT — see [LICENSE](LICENSE)

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

**Built with ❤️ using modern web technologies**
