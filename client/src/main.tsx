import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {store} from './app/store.ts'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Define your routes
const router = createBrowserRouter(
  [
    {
      path: '*',
      element: <App />,
    },
    // Add additional routes here
  ],
  {
    future: {
      v7_startTransition: true, // Enable React Router v7 startTransition future flag
    },
  }
);

createRoot(document.getElementById('root')!).render(
 


  <StrictMode>
    <Provider store={store}>
       <App />
       <ToastContainer/>
    </Provider>
  </StrictMode>,
)
