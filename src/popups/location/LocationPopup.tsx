'use client'
import React from 'react'
import { useState } from 'react'
import '../popup.css'
import { ToastContainer,toast } from 'react-toastify'

const LocationPopup = ({setshowLocationPopup}:
    {setshowLocationPopup:React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [cities,setCities]=React.useState<any[]>([])
    const [selectedCity, setSelectedCity] = React.useState<any>(null)
    const [indianCities,setIndianCities]=React.useState<any>([]);
    const getcities = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/getcities`,{
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.ok){
                const fetchedCities=data.data.map((city:any)=>(
                    city.cityname
                ))
                setIndianCities(fetchedCities);
                const cities = fetchedCities.map((city:any) => {
                    return {
                        label: city,
                        value: city
                    }
                })
                console.log(cities)
                setCities(cities);
            }
        })
        .catch((err)=>{
            console.log(err)
        })       
    }
    
    React.useEffect(()=>{
        getcities()
    },[])

    const handleSave=()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/changeCity`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials:'include',
            body: JSON.stringify({city:selectedCity})
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.ok){
                setshowLocationPopup(false)
                window.location.reload()
            }
            else{
                toast(data.message,{
                    type:'error'
                })
                console.error(data)
            }
        })
        .catch((err)=>{
            toast(err.message,{
                type:'error'
            })
            console.error(err)
        })
    }
  return (
    <div className='popup-bg'>
        <div className='popup-cont'>
            <select
            className='select'
            onChange={(e)=>setSelectedCity(e.target.value)}
            >
                <option value="" disabled selected>Select your city</option>
                {
                    cities.map((city:any,index:any)=>{
                        return <option value={city.value} key={index}>{city.label}</option>
                    })
                }
            </select>
            <button className="btn"
            onClick={handleSave}
            >Save</button>
        </div>
    </div>
  )
}

export default LocationPopup