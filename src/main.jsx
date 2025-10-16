import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from '@/store';
import Layout from '@/components/organisms/Layout';
import Loading from '@/components/ui/Loading';
import '@/index.css';

// Lazy load pages for code splitting and optimal performance
const Home = lazy(() => import('@/components/pages/Home'));
const HotelDetail = lazy(() => import('@/components/pages/HotelDetail'));
const Checkout = lazy(() => import('@/components/pages/Checkout'));
const Confirmation = lazy(() => import('@/components/pages/Confirmation'));
const Bookings = lazy(() => import('@/components/pages/Bookings'));
const SavedHotels = lazy(() => import('@/components/pages/SavedHotels'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="hotel/:id" element={<HotelDetail />} />
            <Route path="checkout/:hotelId/:roomId" element={<Checkout />} />
            <Route path="confirmation/:bookingId" element={<Confirmation />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="saved" element={<SavedHotels />} />
          </Route>
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
      />
    </BrowserRouter>
  </Provider>
);