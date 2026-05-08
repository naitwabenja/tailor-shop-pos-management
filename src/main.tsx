import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import POSPage from '@/pages/POSPage'
import CustomersPage from '@/pages/CustomersPage'
import OrdersPage from '@/pages/OrdersPage'
import MeasurementsPage from '@/pages/MeasurementsPage'
import InventoryPage from '@/pages/InventoryPage'
import LoginPage from '@/pages/LoginPage'
import { AppLayout } from '@/components/layout/AppLayout';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "pos",
        element: <POSPage />,
      },
      {
        path: "customers",
        element: <CustomersPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "measurements",
        element: <MeasurementsPage />,
      },
      {
        path: "inventory",
        element: <InventoryPage />,
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)