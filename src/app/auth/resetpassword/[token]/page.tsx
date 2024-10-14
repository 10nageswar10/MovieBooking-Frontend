'use client'
import React from 'react'
import '@/app/auth/forgotpassword/forgotpass.css'
import { useParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const Page = () => {

    const router=useRouter();
    const params=useParams();
    const {token}=params;
    const [formData,setFormData]=React.useState({
        password:'',
        confirmPassword:''
    });

    const [loading,setLoading]=React.useState<boolean>(false);
    const [errors,setErrors]=React.useState<Record<string,string>>({});

    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value
        });
    };


    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setErrors({})
        const validationErrors:Record<string,string>={};
        if(!formData.password){
            validationErrors.password='Password is Required';
        }
        if(formData.password!==formData.confirmPassword){
            validationErrors.confirmPassword='Password do not match'
        }
        if(formData.password.length<6){
            validationErrors.password='Password must be at least 6 characters long'
        }
        if(Object.keys(validationErrors).length>0){
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            console.log(token)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.ok) {
                toast.success('Password has been reset successfully');
                router.push('/auth/signin'); // Redirect to login page after successful reset
            } else {
                toast.error(data.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    }



  return (
    <div className='forgot-emaildiv'>
        <form onSubmit={handleSubmit} className="email-cont">
                <h1>Change Your Password</h1>
                <input
                placeholder="Enter new Password"
                name="password"
                type='password'
                onChange={handleChange}
                value={formData.password}/>
                {errors.password && <span className="formerror">{errors.password}</span>}
                <input
                placeholder="Enter new Password"
                name="confirmPassword"
                type='password'
                onChange={handleChange}
                value={formData.confirmPassword}/>
                {errors.confirmPassword && <span className="formerror">{errors.confirmPassword}</span>}
                <button type='submit' className={loading?'disabled':''} disabled={loading}>Change Password</button>
            </form>
    </div>
  )
}

export default Page