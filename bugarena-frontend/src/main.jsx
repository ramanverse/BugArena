import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import router from './router.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#19191f',
            color: '#f9f5fd',
            border: '1px solid rgba(255,255,255,0.05)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            borderRadius: '0',
          },
          success: {
            iconTheme: { primary: '#a4ffb9', secondary: '#006532' },
          },
          error: {
            iconTheme: { primary: '#ff716c', secondary: '#490006' },
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>,
)
