import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

import { assets } from '../assets/assets_admin/assets'
const Navbar = () =>{
    const { aToken, setAToken } = useContext( AdminContext)
    const logout = () => {
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
    }

    return (
        <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white ">
            <div className="flex items-center gap-2 text-xs">
                <img className="w-36 sm:w-40 cursor-pointer" src={assets.admin_logo} alt="">
                </img>
                <p>
                    {
                        aToken? 'Admin':'Doctor'
                    }
                </p>
            </div>
            <button></button>
        </div>
    )
}
export default Navbar