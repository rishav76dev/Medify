import React ,{ useContext, useEffect,useState } from "react"
import { useParams } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import { assets } from "../assets/assets_frontend/assets"

const Appointment = () => {
    const { docId } = useParams()
    const { doctors, currencySymbol} = useContext(AppContext)
    const [ docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] =useState([])
    const [slotTime,setSlotTime] = useState('')
    const [slotIndex,setSlotIndex] = useState(0)

    const fetchDocInfo = async ()=>{
        const docInfo = doctors.find((doc => doc._id === docId))
        setDocInfo(docInfo)
    }
    const getAvailableSlots = async() => {
        setDocSlot([])

        let today = new Date()
        for (let i =0;i<7;i++){
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate()+i)

            //time slot
            let endtime = new Date()
            endtime.setDate(today.getDate()+1)
            endtime.setHours(21,0,0,0)

            if(today.getDate() === currentDate.getDate()){
                
            }
        }

    }

    useEffect(() => {
        getAvailableSlots()

    },[docInfo])

    useEffect(() => {
        fetchDocInfo()
    },[doctors,docId])
    return docInfo &&(
        <div>
        {/*   docto details */}
        <div className="flex flex-col sm:flex-row gap-4">
            <div>
                <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
            </div>
            <div className="flex-1 border border-gray-400 rounded-lg p-8">
                {/* details og doc name ,deegree, experience */}
                <p className="flex itesms-center gap-2 text-2xl font-medium text-gray-900"
                >{docInfo.name} <img className="w-5" src= { assets.verified_icon } alt="" /></p>
            
            <div>
                <p>{docInfo.degree} - { docInfo.speciality}</p>
                <button className="py-0.5 pz-2 border text-xs rounded-full">{docInfo.experience}</button>
            </div>
            {/* doctor about */}
            <div>
                <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                    About <img src={assets.info_icon} alt=""/>
                </p>
                <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
            </div>
            <p className="text-gray-500 font-medium mt-4">Appointment fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span></p>
        </div>
        </div>
        </div>
    )
}
export default Appointment