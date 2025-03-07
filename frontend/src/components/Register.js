import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Register = () => {

    useEffect(() => {
        AOS.init({
            duration: 200,
            once: true
        });
    }, []);

    return(
        <>
        <div className="bg-[#fff] w-full h-[100vh] bg-opacity-50">
            <div data-aos="zoom-in"
                data-aos-easing="ease-out-cubic"
                className="w-[500px] sm:w-[560px] md:w-[600px] mx-auto relative top-[64px] bg-[#FFFFFF] text-black p-[32px] rounded-[10px] shadow-all-around shadow-[#E5E7EB]"
            >
                <h3 className="font-bold leading-[28px] text-[20px] mb-4 text-black">Đăng ký</h3>
                <form className="flex flex-col gap-4">
                    <div className="form-control">
                        <label className="label">
                        <span className="label-text text-black font-[500]">Họ tên</span>
                        </label>
                        <input 
                        type="text"
                        placeholder="Nhập họ tên của bạn" 
                        className="input input-bordered w-full bg-gray-50 border-gray-200 text-gray-700 focus:border-gray-400 focus:bg-white"
                        required 
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                        <span className="label-text text-black font-[500]">Email</span>
                        </label>
                        <input 
                        type="email" 
                        placeholder="Nhập email của bạn" 
                        className="input input-bordered w-full bg-gray-50 border-gray-200 text-gray-700 focus:border-gray-400 focus:bg-white"
                        required 
                        />
                    </div>
                    
                    <div className="form-control">
                        <label className="label">
                        <span className="label-text text-black font-[500]">Mật khẩu</span>
                        </label>
                        <input 
                        type="password" 
                        placeholder="Nhập mật khẩu" 
                        className="input input-bordered w-full bg-gray-50 border-gray-200 text-gray-700 focus:border-gray-400 focus:bg-white"
                        required 
                        />
                    </div>

                    <div className="form-control mb-[10px]">
                        <label className="label">
                        <span className="label-text text-black font-[500]">Xác nhận mật khẩu</span>
                        </label>
                        <input 
                        type="password" 
                        placeholder="Nhập lại mật khẩu" 
                        className="input input-bordered w-full bg-gray-50 border-gray-200 text-gray-700 focus:border-gray-400 focus:bg-white"
                        required 
                        />
                    </div>
                    
                    <button type="submit" className="btn bg-gray-200 hover:bg-gray-400 text-black border-none w-full mt-2">
                        Đăng ký
                    </button>

                    <div className="relative mt-[24px] mb-[24px]">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="group flex items-center justify-center gap-3 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
                            <FaGoogle className="text-gray-600 group-hover:text-[#DB4437]" size={20} />
                            <span className="group-hover:text-[#DB4437]">Google</span>
                        </button>
                        <button type="button" className="group flex items-center justify-center gap-3 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
                            <FaFacebook className="text-gray-600 group-hover:text-[#1877F2]" size={20} />
                            <span className="group-hover:text-[#1877F2]">Facebook</span>
                        </button>
                    </div>

                    <p className="text-center text-sm mt-6 mb-4 text-gray-600">
                        Chuyển hướng đến trang chủ? {" "}
                        <Link to="/" className="text-gray-600 font-[700] hover:text-[#0e1216] hover:underline">
                            Đồng ý
                        </Link>
                    </p>
                </form>
            </div>
        </div>
            
        </>
    )
}