import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
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
import POSPage from '@/pages/POSPage'
import OrdersPage from '@/pages/OrdersPage'
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
        element: <Navigate to="/dashboard/pos" replace />,
      },
      {
        path: "pos",
        element: <POSPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
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
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </QueryClientProvider>
)