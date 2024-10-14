'use client'
import React from 'react'
import './forgotpass.css'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const Page = () => {

    const router=useRouter();
    const [formData,setFormData]=React.useState({
        email:''
    });

    const [loading,setLoading]=React.useState<boolean>(false)

    const [errors,setErrors]=React.useState<Record<string,string>>({});

    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value
        });
    };

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        setLoading(true)
        e.preventDefault();
        const validationErrors:Record<string,string>={};
        if(!formData.email){
            validationErrors.email='Email is Required';
        }
        if(!formData.email.includes('@')){
            validationErrors.email='Give a valid email Id'
        }
        if(Object.keys(validationErrors).length>0){
            setErrors(validationErrors);
            return;
        }
        console.log(formData);
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/forgot-password`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
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
                router.push(`/auth/mailsent/${formData.email}`)
            }else{
                toast.error(response.message,{
                    type:'error',
                    position:'top-right',
                    autoClose:2000
                })
            }
        })
        .finally(()=>{
            setLoading(false)
            setErrors({})
            setFormData({email:''})
        })
    }

  return (
    <div className='forgot-emaildiv'>
            <form onSubmit={handleSubmit} className="email-cont">
                <h1>Please Enter your Registered Email</h1>
                <input
                placeholder="Enter your email"
                name="email"
                onChange={handleChange}
                value={formData.email}/>
                {errors.email && <span className="formerror">{errors.email}</span>}
                <button type='submit' className={loading?'disabled':''} disabled={loading}>Confirm Email</button>
            </form>
    </div>
  )
}

export default Page