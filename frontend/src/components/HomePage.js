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
            <div className="bg-[#ededed] text-black min-h-screen">
                {/* Login/Logout Section */}
                {!isLoggedIn ? (
                    <button
                        className="btn absolute top-4 right-4 w-28 sm:w-32 md:w-40 lg:w-48 xl:w-[10%] rounded-[20px] bg-gray-100 hover:bg-gray-300 text-gray-800 text-sm sm:text-base lg:text-[16px]"
                        onClick={() => document.getElementById('my_modal_2').showModal()}
                    >
                        Login to see more
                    </button>
                ) : (
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4 pr-4">
                        <button
                            className="btn rounded-[20px] bg-[#4F74C8] hover:bg-[#21386d] text-white text-sm sm:text-base lg:text-lg px-2 sm:px-4"
                            onClick={() => navigate('/profile/LittleBisuzz')}
                        >
                            Go to your Profile
                        </button>
                        <button
                            className="btn bg-red-500 hover:bg-red-700 text-white rounded-[20px] text-sm sm:text-base lg:text-lg px-2 sm:px-4"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}

                {/* Modal Login */}
                <dialog id="my_modal_2" className="modal">
                    <div className="modal-box bg-white shadow-lg w-11/12 max-w-md sm:max-w-lg md:max-w-xl">
                        <h3 className="font-bold text-lg sm:text-xl mb-4 text-black">Đăng nhập</h3>
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
                                    <span className="label-text text-black font-[500] text-sm sm:text-base">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    className="input input-bordered w-full bg-gray-50 border-gray-200 text-gray-700 focus:border-gray-400 focus:bg-white text-sm sm:text-base"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-black font-[500] text-sm sm:text-base">Mật khẩu</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    className="input input-bordered w-full bg-gray-50 border-gray-200 text-gray-700 focus:border-gray-400 focus:bg-white text-sm sm:text-base"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn bg-gray-200 hover:bg-gray-400 text-black border-none w-full mt-2 text-sm sm:text-base">
                                Đăng nhập
                            </button>
                            <p className="text-center text-xs sm:text-sm mt-2 text-gray-600">
                                Chưa có tài khoản?{" "}
                                <Link to="/register" className="text-gray-600 font-[700] hover:text-[#0e1216] hover:underline">
                                    Đăng ký tại đây
                                </Link>
                            </p>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

                {/* Header */}
                <header className="py-4 sm:py-6 md:py-8 px-4 sm:px-8 md:px-12 lg:px-20 w-full sm:w-[90%] mx-auto transition-all duration-custom ease-custom">
                    <div className="logo flex items-center justify-center mb-4 sm:mb-6 md:mb-8">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-[700] text-center">
                            {rendered === 'popular' ? 'Popular Anime' : rendered === 'airing' ? 'Airing Anime' : 'Upcoming Anime'}
                        </h1>
                    </div>

                    {/* Search Container */}
                    <div className="search-container flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 flex-wrap">
                        <button
                            className="py-2 px-4 sm:py-3 sm:px-6 font-[500] rounded-[30px] text-sm sm:text-base md:text-lg bg-[#fff] border-[3px] border-[#2A3441] hover:bg-[#e5e7eb] transition-all duration-custom ease-custom"
                            onClick={() => setRendered('popular')}
                        >
                            Popular <i className="fas fa-fire"></i>
                        </button>
                        <form action="" className="search-form relative w-full sm:w-auto flex-grow" onSubmit={handleSubmit}>
                            <div className="input-control relative">
                                <input
                                    className="w-full py-2 px-4 sm:py-3 sm:px-6 rounded-[30px] text-sm sm:text-base md:text-lg bg-[#fff] border-[3px] border-[#2A3441] outline-none transition-all duration-custom ease-custom"
                                    type="text"
                                    placeholder="Search Anime"
                                    value={search}
                                    onChange={handleChange}
                                />
                                <button
                                    className="absolute right-0 top-0 h-full px-4 sm:px-6 rounded-[30px] text-sm sm:text-base md:text-lg bg-[#fff] border-[3px] border-[#2A3441] hover:bg-[#e5e7eb] transition-all duration-custom ease-custom"
                                    type="submit"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                        <button
                            className="py-2 px-4 sm:py-3 sm:px-6 font-[500] rounded-[30px] text-sm sm:text-base md:text-lg bg-[#fff] border-[3px] border-[#2A3441] hover:bg-[#e5e7eb] transition-all duration-custom ease-custom"
                            onClick={() => {
                                setRendered('airing');
                                getAiringAnime();
                            }}
                        >
                            Airing
                        </button>
                        <button
                            className="py-2 px-4 sm:py-3 sm:px-6 font-[500] rounded-[30px] text-sm sm:text-base md:text-lg bg-[#fff] border-[3px] border-[#2A3441] hover:bg-[#e5e7eb] transition-all duration-custom ease-custom"
                            onClick={() => {
                                setRendered('upcoming');
                                getUpcomingAnime();
                            }}
                        >
                            Upcoming
                        </button>
                        <button
                            className="w-full sm:w-auto py-2 px-4 sm:py-3 sm:px-6 font-[500] rounded-[30px] text-sm sm:text-base md:text-lg bg-[#fff] border-[3px] border-[#2A3441] hover:bg-[#e5e7eb] transition-all duration-custom ease-custom"
                            onClick={handleManga}
                        >
                            Explore Manga <i className="fa-solid fa-meteor"></i>
                        </button>
                        <div className="dropdown dropdown-hover w-full sm:w-auto">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn m-1 rounded-[30px] w-full sm:w-[250px] font-[500] text-sm sm:text-base md:text-lg h-12 sm:h-[58px] hover:text-[#ffffff]"
                            >
                                Recommendations <i className="fa-solid fa-chess-queen mb-[2px] ml-[4px]"></i>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-100 z-[1] p-2 shadow w-full sm:w-[250px] rounded-[20px]"
                            >
                                <li>
                                    <Link
                                        to={`/recommendations/manga`}
                                        state={{ from: '/' }}
                                        className="text-[#A5ACBA] text-sm sm:text-base text-center hover:text-[#ffffff]"
                                    >
                                        Manga Recommendations
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={`/recommendations/anime`}
                                        state={{ from: '/' }}
                                        className="text-[#A5ACBA] text-sm sm:text-base text-center hover:text-[#ffffff]"
                                    >
                                        Anime Recommendations
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>

                {/* Rendered Component */}
                {switchComponent()}
            </div>
        </>
    )
}