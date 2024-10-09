'use client'
import React, { useState,useEffect } from "react";
import Image from "next/image";
import styles from './page.module.css';
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import '../auth.css';
import movieback from '@/assets/movie_cover1.jpg'
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { FiEye,FiEyeOff } from "react-icons/fi";
import { ToastContainer,toast } from "react-toastify";


interface FormData{
    email: string;
    password: string;
}


const Signin = () => {
    const [formData, setFormData] = React.useState<FormData>({ 
        email: '', 
        password: '' 
    });
    const iconStyle={height:'20px',width:'40px'}
    const backgroundStyle = {
        width: '50%',
        backgroundImage: `url(${movieback.src})`,
        backgroundSize: 'cover', // Cover the entire container
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat' // Prevent repeating
    };
    const [errors,setErrors]=React.useState<Record<string,string>>({});
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value
        });
    };
    const [showPassword, setShowPassword] = React.useState(false);
    const handleToggle = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const validationErrors:Record<string,string>={};
        if(!formData.email){
            validationErrors.email='Email is Required';
        }
        if(!formData.password){
            validationErrors.password='Password is Required';
        }

        if(Object.keys(validationErrors).length>0){
            setErrors(validationErrors);
            return;
        }
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials:'include'
        })
        .then((res)=>{
            return res.json();
        })
        .then(async(response)=>{
            if(response.ok){
                toast(response.message,{
                    type:'success',
                    position:'top-right',
                    autoClose:2000
                })
                window.location.href='/'
            }else{
                toast.error(response.message,{
                    type:'error',
                    position:'top-right',
                    autoClose:2000
                })
            }
        })
    }
    React.useEffect(() => {
        // Check for the registration success flag
        if (localStorage.getItem('registrationSuccess')) {
          // Show success toast
          console.log("sucess")
          toast.success('User Registration successful',{
            position:'top-right',
        });
          // Remove the flag from local storage
          setTimeout(() => {
            localStorage.removeItem('registrationSuccess');
          }, 4000);
        }
      }, []);
  return (
    <div className="authin">
        <div className="left"
        style={backgroundStyle}
        >
            <h1>Welcome Back!</h1>
        </div>
        <div className="right">
            <form
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
            onSubmit={handleSubmit}
            className="form-cont"
            >
                <h1>Login</h1>
                <h3>Welcome Back! Please login to your account</h3>
                <div className="form-sub-cont">
                    <label>Email</label>
                    <div className="input-cont">
                        <MdOutlineMail style={iconStyle} className="icon"/>
                        <input 
                        type="text"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange} 
                        />
                    </div>
                    
                    {errors.email && <span className="formerror">{errors.email}</span>}
                </div>
                <div className="form-sub-cont">
                    <label>Password</label>
                    <div className="input-cont">
                        <CiLock style={iconStyle} className="icon passIcon"/>
                        <input 
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange} 
                        style={{border:'none'}}
                        />
                        <div onClick={handleToggle} className="toggle-icon">
                            {showPassword?<FiEye style={iconStyle} className="icon"/>:<FiEyeOff style={iconStyle} className="icon"/>}
                        </div>
                        
                    </div>
                    {errors.password && <span className="formerror">{errors.password}</span>}
                </div>
                <button type="submit" className="main_button">
                    Login
                </button>
                <p className="authlink">
                    Don&apos;t have an account? <Link href="/auth/signup" className="link">Register</Link>
                </p>
            </form>
        </div>
    </div>
  )
}

export default Signin