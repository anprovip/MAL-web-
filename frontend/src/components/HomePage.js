import { useState, useEffect } from 'react';
import { Popular } from './Popular';
import { useGlobalContext } from '../context/global';
import { Upcoming } from './Upcoming';
import { Airing } from './Airing';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const HomePage = () => {
    const {getUpcomingAnime, getAiringAnime, handleSubmit, search, handleChange} = useGlobalContext();

    const [rendered, setRendered] = useState('popular');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    const switchComponent = () => {
        switch(rendered) {
            case 'popular':
                return <Popular rendered={rendered} />;
            case 'airing':
                return <Airing rendered={rendered} />;
            case 'upcoming':
                return <Upcoming rendered={rendered} />;
            default:
                return <Popular rendered={rendered} />;
        }
    }

    const navigate = useNavigate();

    const handleManga = () => {
        navigate(`/manga`);
        
    };
    
    // const handleLogin = async (event) => {
    //     event.preventDefault();
    //     const email = event.target.email.value;
    //     const password = event.target.password.value;

    //     try {
    //         const response = await fetch('http://localhost:8000/login', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ email, password }),
    //         });

    //         if (!response.ok) {
    //             alert('Sai email hoặc mật khẩu');
    //             return;
    //         }

    //         const data = await response.json();
    //         localStorage.setItem('token', data.access_token);
    //         localStorage.setItem('username', data.username);

    //         setUsername(data.username);
    //         setIsLoggedIn(true);
    //         document.getElementById('my_modal_2').close();
    //     } catch (error) {
    //         console.error('Lỗi đăng nhập:', error);
    //     }
    // };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        Swal.fire({
            title: "Are you sure?",
            text: "You are going to log out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, I'm logging out!"
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoggedIn(false);
                setUsername('');
            }
        });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        }
    }, []);

    return(
        <>
            <div className="bg-[#ededed] text-black">
                {!isLoggedIn ? (
                    <button className="btn ml-[1690px] relative top-[20px] w-[10%] rounded-[20px] bg-gray-100 hover:bg-gray-300 text-gray-800 text-[16px]" onClick={() => document.getElementById('my_modal_2').showModal()}>
                        Login to see more
                    </button>
                ) : (
                    <div className="flex justify-end gap-[16px] pt-[20px] pr-[16px]">
                        <button
                            className="btn rounded-[20px] bg-[#4F74C8] hover:bg-[#21386d] text-white text-[16px]"
                            onClick={() => navigate('/profile/LittleBisuzz')}
                        >
                            Go to your Profile
                        </button>
                        <button 
                            className="btn bg-red-500 hover:bg-red-700 text-white rounded-[20px] text-[16px]"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                      
                )}
                <dialog id="my_modal_2" className="modal">
                    <div className="modal-box bg-white shadow-lg">
                        <h3 className="font-bold text-lg mb-4 text-black">Đăng nhập</h3>
                        <form 
                            className="flex flex-col gap-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                setIsLoggedIn(true);
                                document.querySelector('#my_modal_2').close();
                            }}    
                        >
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
                            
                            <button type="submit" className="btn bg-gray-200 hover:bg-gray-400 text-black border-none w-full mt-2">
                                Đăng nhập
                            </button>
                            
                            <p className="text-center text-sm mt-2 text-gray-600">
                                Chưa có tài khoản? {" "}
                                <Link to="/register" className="text-gray-700 hover:text-[#0e1216] hover:underline">
                                Đăng ký tại đây
                                </Link>
                            </p>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
                <header className="py-[32px] px-[80px] w-[90%] mx-auto my-0 transition-all duration-custom ease-custom">
                    <div className="logo flex items-center justify-center mb-[32px]">
                        <h1 className="text-[48px] font-[700]">
                            {rendered === 'popular' ? 'Popular Anime' : 
                            rendered === 'airing' ? 'Airing Anime' : 'Upcoming Anime'}
                        </h1>
                    </div>
                    <div className="search-container flex items-center justify-center gap-[16px]">
                        <div className="filter-button popular-filter">
                            <button className="flex items-center gap-[8px] py-[11px] px-[24px] font-[500] rounded-[30px] outline-none text-[20px] bg-[#fff] border-[3px] border-[#2A3441] cursor-pointer transition-all duration-custom ease-custom hover:bg-[#e5e7eb]" onClick={() => {
                                setRendered('popular')
                            }}>
                                Popular
                                <i className="fas fa-fire"></i>
                            </button>
                        </div>
                        <form action="" className="search-form relative w-full" onSubmit={handleSubmit}>
                            <div className="input-control relative transition-all duration-custom ease-custom">
                                <input
                                    className="w-full py-[12px] px-[16px] outline-none rounded-[30px] text-[20px] bg-[#fff] border-[3px] border-[#2A3441] transition-all duration-custom ease-custom"
                                    type="text" 
                                    placeholder="Search Anime" 
                                    value={search} 
                                    onChange={handleChange} 
                                />
                                <button className="absolute right-0 top-[50%] translate-y-[-50%] flex items-center gap-[8px] py-[11px] px-[24px] font-[500] rounded-[30px] outline-none text-[20px] bg-[#fff] border-[3px] border-[#2A3441] cursor-pointer transition-all duration-custom ease-custom hover:bg-[#e5e7eb]" 
                                    type="submit"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                        <div className="filter-button airing-filter">
                            <button className="flex items-center gap-[8px] py-[11px] px-[24px] font-[500] rounded-[30px] outline-none text-[20px] bg-[#fff] border-[3px] border-[#2A3441] cursor-pointer transition-all duration-custom ease-custom hover:bg-[#e5e7eb]" onClick={() => {
                                setRendered('airing')
                                getAiringAnime();
                            }}>Airing</button>
                        </div>
                        <div className="filter-button upcoming-filter">
                            <button className="flex items-center gap-[8px] py-[11px] px-[24px] font-[500] rounded-[30px] outline-none text-[20px] bg-[#fff] border-[3px] border-[#2A3441] cursor-pointer transition-all duration-custom ease-custom hover:bg-[#e5e7eb]" onClick={() => {
                                setRendered('upcoming')
                                getUpcomingAnime();
                            }}>Upcoming</button>
                        </div>
                        <div className="filter-button manga-filter">
                            <button className="w-[230px] flex items-center gap-[8px] py-[11px] px-[24px] font-[500] rounded-[30px] outline-none text-[20px] bg-[#fff] border-[3px] border-[#2A3441] cursor-pointer transition-all duration-custom ease-custom hover:bg-[#e5e7eb]" onClick={handleManga}>
                                Explore Manga
                                <i class="fa-solid fa-meteor"></i>
                            </button>
                        </div>
                        <div className="dropdown dropdown-hover">
                            <div tabIndex={0} role="button" className="btn m-1 rounded-[30px] w-[275px] font-[500] text-[20px] h-[58px] hover:text-[#ffffff]">Recommendations <i class="fa-solid fa-chess-queen mb-[2px] ml-[4px]"></i></div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 z-[1] ml-[16px] p-[4px] shadow w-[250px] rounded-[20px]">
                                <li>
                                    <Link to={`/recommendations/manga`} state={{from: '/'}} className='text-[#A5ACBA] text-[16px] text-center hover:text-[#ffffff]'>Manga Recommendations</Link>
                                </li>
                                <li>
                                    <Link to={`/recommendations/anime`} state={{from: '/'}} className='text-[#A5ACBA] text-[16px] text-center hover:text-[#ffffff]'>Anime Recommendations</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>
                {switchComponent()}
            </div>
        </>
    )
}