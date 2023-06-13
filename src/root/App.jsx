import * as React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>

        {/* <Route path='/register' element={<Register />}></Route>
            <Route
                path='/dashboard'
                element={
                    <PrivateRoute>
                        <DashboardTemp />
                    </PrivateRoute>
                }
            ></Route>
           
            <Route path='*' element={<NoMatch />} /> */}
      </Routes>
    </div>
  )
}
