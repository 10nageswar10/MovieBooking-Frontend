'use client'
import React, { useState ,useEffect} from "react";
import Image from "next/image";
import styles from './page.module.css';
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import '../auth.css';
import { ToastContainer,toast } from "react-toastify";
import movieback from '@/assets/movie_cover8.jpg'
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { FiEye,FiEyeOff } from "react-icons/fi";
import { TbLockCheck } from "react-icons/tb";
import { IoPersonCircle } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface FormData{
    name:string;
    email: string;
    password: string;
    confirmPassword:string;
    city:string;
}


const Signup = () => {


    const [cities,setCities]= useState<any>([])

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
    
    useEffect(()=>{
        getcities()
    },[])

    const router=useRouter();
    const [formData, setFormData] = useState<FormData>({ 
        name:'',
        email: '', 
        password: '',
        confirmPassword: '',
        city:'',
    });
    const iconStyle={height:'20px',width:'40px'}
    const backgroundStyle = {
        width: '50%',
        backgroundImage: `url(${movieback.src})`,
        backgroundSize: 'cover', // Cover the entire container
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat' // Prevent repeating
    };
    const [errors,setErrors]=useState<Record<string,string>>({});
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value
        });
    };
    const handleSelectChange=(e:React.ChangeEvent<HTMLSelectElement>)=>{
        const {name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value
        });
    };
    const [showPassword, setShowPassword] = useState(false);
    const handleToggle = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setErrors({})
        const validationErrors:Record<string,string>={};
        if(!formData.email){
            validationErrors.email='Email is Required';
        }
        if(!formData.password){
            validationErrors.password='Password is Required';
        }
        if(formData.password!==formData.confirmPassword){
            validationErrors.confirmPassword='Password do not match'
        }
        if(!formData.city){
            validationErrors.city='City is Required';
        }

        if(Object.keys(validationErrors).length>0){
            setErrors(validationErrors);
            return;
        }
        console.log(formData)
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/register`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then((res)=>{
            return res.json();
        })
        .then((response)=>{
            if(response.ok){
                setFormData({
                    name:'',
                    email: '', 
                    password: '',
                    confirmPassword: '',
                    city:'',
                })
                localStorage.setItem('registrationSuccess', 'true');
                router.push(`/auth/verifyemail?userId=${response.data.data.userId}&email=${response.data.data.email}`);
            }
            else{
                toast(response.message,{
                    type:'error',
                    position:'top-center',
                    autoClose:2000
                })
            }
        })
        .catch((err)=>{
            toast.error(err.messaqge)
            console.log(err);
        })
    }

  return (
    <div className="authin">
        <div className="leftregis"
        style={backgroundStyle}
        >
            <h1>Join Now!</h1>
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
                <h1>Register</h1>
                <h3>Sign up now to enjoy a seamless and thrilling movie booking experience!</h3>
                <div className="form-sub-cont">
                    <label>Name</label>
                    <div className="input-cont">
                        <IoPersonCircle  style={iconStyle} className="icon"/>
                        <input 
                        type="text"
                        placeholder="Enter your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange} 
                        />
                    </div>
                    {errors.name && <span className="formerror">{errors.name}</span>}
                </div>
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
                        <CiLock style={iconStyle} className="icon passIcon" />
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
                <div className="form-sub-cont">
                    <label>Confirm Password</label>
                    <div className="input-cont">
                        <TbLockCheck style={iconStyle} className="icon" />
                        <input 
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password "
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange} 
                        style={{border:'none'}}
                        />
                        <div onClick={handleToggle} className="toggle-icon">
                            {showPassword?<FiEye style={iconStyle} className="icon"/>:<FiEyeOff style={iconStyle} className="icon"/>}
                        </div>
                    </div>
                    {errors.confirmPassword && <span className="formerror">{errors.confirmPassword}</span>}
                </div>
                <div className="form-sub-cont">
                    <label>City</label>
                    <div className="input-cont">
                        <FaLocationDot style={iconStyle} className="icon"/>
                        <select 
                        name="city"
                        className="select-city"
                        onChange={handleSelectChange}
                        value={formData.city}
                        >
                            
                            <option value="" disabled>Select your city</option>
                            {
                                cities.map((city:any)=>{
                                return <option key={city.value} value={city.value}>{city.label}</option>
                            })
                            }
                            
                        </select>
                    </div>
                    {errors.city && <span className="formerror">{errors.city}</span>}
                </div>
                <button type="submit" className="main_button">
                    Register
                </button>
                <p className="authlink">
                    Already have an account?<Link href="/auth/signin" className="link">Login</Link>
                </p>
            </form>
        </div>
    </div>
  )
}

export default Signup