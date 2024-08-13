import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom'

const AdminRoute = () => {
    const {currentUser} = useSelector((state)=>state.user)
    console.log(currentUser.__v);
  return (
    currentUser ?. __v === 1 ? <Outlet /> : <Navigate to = "/" />
  )
}

export default AdminRoute