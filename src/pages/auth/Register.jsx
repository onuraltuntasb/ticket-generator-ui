import React, { useEffect } from 'react'
import { useAppDispatch } from '../../redux/hooks'
import { useNavigate } from 'react-router-dom'
import { useRegisterUserMutation } from '../../redux/services/authApi'
import { setUser } from '../../redux/features/authSlice'

const Register = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [
    registerUser,
    {
      data: registerData,
      isSuccess: isRegisterSuccess,
      isError: isRegisterError,
    },
  ] = useRegisterUserMutation()

  useEffect(() => {
    registerUser({
      email: 'onuraltuntas1@gmail.com',
      name: 'onur1234',
      password: 'Cy1nh0&6g!',
    })
  }, [])

  useEffect(() => {
    if (isRegisterSuccess) {
      console.log('User login successfull!', registerData)
      dispatch(
        setUser({
          name: registerData.name,
          email: registerData.email,
          authorities: registerData.authorities,
          jwtToken: registerData.jwtToken,
          jwtRefreshToken: registerData.jwtRefreshToken,
        }),
      )
      navigate('/dashboard')
    } else if (isRegisterError) {
      console.log('User register error!', registerData)
    }
  }, [isRegisterSuccess, isRegisterError])

  return <div>Register</div>
}

export default Register
