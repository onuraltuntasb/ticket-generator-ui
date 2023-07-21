import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from '../components/PrivateRoute';
import NoMatch from '../pages/NoMatch';
import UserSettings from 'pages/UserSettings';
import Events from 'pages/Events';
import UserEvents from 'pages/UserEvents';
import UserTickets from 'pages/UserTickets';
import MainPage from 'pages/MainPage';
import ForgotPassword from 'pages/ForgotPassword';
import PasswordReset from 'pages/PasswordReset';

export default function App() {
    return (
        <div style={{ backgroundColor: '#f5f5f5' }}>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PrivateRoute notRedirect={true}>
                            <Login />
                        </PrivateRoute>
                    }
                ></Route>
                <Route
                    path="/register"
                    element={
                        <PrivateRoute notRedirect={true}>
                            <Register />
                        </PrivateRoute>
                    }
                ></Route>

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute notRedirect={true}>
                            <Dashboard />
                        </PrivateRoute>
                    }
                ></Route>

                <Route
                    path="/user-settings"
                    element={
                        <PrivateRoute>
                            <UserSettings />
                        </PrivateRoute>
                    }
                ></Route>

                <Route
                    path="/events"
                    element={
                        <PrivateRoute notRedirect={true}>
                            <Events />
                        </PrivateRoute>
                    }
                ></Route>

                <Route
                    path="/user-events"
                    element={
                        <PrivateRoute>
                            <UserEvents />
                        </PrivateRoute>
                    }
                ></Route>

                <Route
                    path="/user-tickets"
                    element={
                        <PrivateRoute>
                            <UserTickets />
                        </PrivateRoute>
                    }
                ></Route>

                <Route
                    path="/"
                    element={
                        <PrivateRoute notRedirect={true}>
                            <MainPage />
                        </PrivateRoute>
                    }
                ></Route>

                <Route
                    path="/forgot-password"
                    element={
                        <PrivateRoute notRedirect={true}>
                            <ForgotPassword />
                        </PrivateRoute>
                    }
                ></Route>

                <Route path="/reset-password/:token" element={<PasswordReset />}></Route>

                <Route path="*" element={<NoMatch />} />
            </Routes>
        </div>
    );
}
