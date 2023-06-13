import React, { useEffect, useState } from 'react'
import LoadingToRedirect from './LoginToRedirect'

const PrivateRoute = ({ children }) => {
  const [isTokenValid, setisTokenValid] = useState(false)

  let token = ''
  let email = ''
  let user = { name: '', token: '' }

  useEffect(() => {
    if (localStorage.getItem('user')) {
      user = JSON.parse(localStorage.getItem('user'))
      console.log(user)
      token = user.token
      email = user.name
      console.log(user.name, 'token')
    }
    if (token) {
      fetch('http://localhost:8080/api/auth/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token, email: email }),
      })
        .then((response) => {
          if (response.ok) {
            setisTokenValid(true)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }, [])

  return isTokenValid ? children : <LoadingToRedirect />
}

export default PrivateRoute
