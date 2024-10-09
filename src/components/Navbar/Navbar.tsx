'use client'
import React, { useEffect } from 'react'
import './Navbar.css'
import logo from '@/assets/logo.png'
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BiSearch ,BiUserCircle} from "react-icons/bi";
import { RiArrowDropDownFill } from "react-icons/ri";
import LocationPopup from '@/popups/location/LocationPopup';


const Navbar = () => {
  const [showLocationPopup,setshowLocationPopup]=React.useState<boolean>(false)
  const [user,setUser]=React.useState<any>(null)
  const [loggedIn,setLoggedIn]=React.useState<boolean>(false)
  
  const getUser=async()=>{
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/getuser`,{
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
      },
      credentials: 'include',
    })
    .then((res)=>{
      return res.json();
    })
    .then((response)=>{
      if(response.ok){
        console.log(response)
        setUser(response.data)
        setLoggedIn(true)
      }
      else{
        setLoggedIn(false)
      }
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  React.useEffect(()=>{
    getUser()
  },[])

  const handleLogout=async()=>{
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/logout`,{
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
      },
      credentials: 'include',
    })
    .then((res)=>{
      return res.json();
    })
    .then((response)=>{
      if(response.ok){
        console.log(response)
        if(response.ok){
          window.location.href = "/auth/signin"
        }
      }
    })
    .catch((error)=>{
          console.log(error)
          window.location.href = "/auth/signin"
    })
  }

  return (
    <nav>
        <div className="left">
          <Link href="/" className="linkstylenone"><Image src={logo} alt='logo' height={50} width={70}></Image></Link>
            <div className="search-box">
                <BiSearch className="search-btn"/>
                <input type="text" placeholder="Search for a movie"/>
            </div>
        </div>
        <div className="right">
            {loggedIn?<p className="dropdown"
              onClick={()=>setshowLocationPopup(true)}
            >{user?user.city:'select City'}<RiArrowDropDownFill className='dropdown-btn'/></p>:<></>}
            
            {
              loggedIn?<button className="theme-btn1 linkstylenone" onClick={handleLogout}>Logout</button>
              :<Link href="/auth/signin" className="theme-btn1 linkstylenone">Login</Link>
            }
              
            
            <Link href="/profile" className='linkstylenone profile-icon'><BiUserCircle className='theme-icon1'/><p>{user?.name}</p></Link>

        </div>
        {
          showLocationPopup && 
          <LocationPopup 
            setshowLocationPopup={setshowLocationPopup}
          />
        }
    </nav>
  )
}

export default Navbar