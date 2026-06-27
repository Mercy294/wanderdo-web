import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import MyBookings from "./pages/MyBookings";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/bookings" element={<MyBookings />} />
                  <Route path="/saved" element={<Explore showSaved />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
              }}
            />
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
