import logo from './logo.svg';
import './App.css';
import SignUp from "./components/SignUp"
import Home from "./components/Home"
import Login from "./components/Login"
import { useLoginContext, LoginProvider } from './context/LoginContext';
import PrivateRoute from './privateRoute';
import PublicRoute from './publicRoute';
import { Navigate, useRoutes, useSearchParams, useNavigate } from 'react-router-dom';

export default function Router() {

  const routes = [
    {
      path: '/',
      children: [
        { path: '/', element: <PrivateRoute><Home /></PrivateRoute> },
        { path: '/login', element: <PublicRoute><LoginProvider><Login /></LoginProvider></PublicRoute> },
        { path: '/register', element: <PublicRoute><LoginProvider><SignUp /></LoginProvider></PublicRoute> },
        { path: '/app', element: <PrivateRoute><Home /></PrivateRoute> }
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]


  return useRoutes(routes);
}
