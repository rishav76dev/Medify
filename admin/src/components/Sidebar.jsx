import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    const { aToken}  = useContext(AdminContext)
  return (
    <div>
        {
            aToken && <ul>
                <NavLink>
                    <img src
                </NavLink>
            </ul>
        
        
        }
    </div>

  )
}

export default Sidebar