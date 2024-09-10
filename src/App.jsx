import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import {
  APIProvider,
} from '@vis.gl/react-google-maps';

import {
  Routes
} from 'navigation';

import './App.css'

import
  ProtectedRoute
from './context/ProtectedRoute';

import {
  AuthProvider,
  ToastProvider
} from './context';

function App() {

  const router = createBrowserRouter(Routes.map(r => ({
    path: r.path,
    element: r.auth ? (
      <ProtectedRoute permission={r.permission}>
        <r.component/>
      </ProtectedRoute>
    ) : (
      <r.component />
    )
  })));

  return (
    <APIProvider apiKey={'AIzaSyDw36QoGkaVp5wLW4rc8M7pyvkz1Ow-SIw'} libraries={['marker']}>
      <div className="App">
        <AuthProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </AuthProvider>
      </div>
    </APIProvider>
  )
}

export default App
