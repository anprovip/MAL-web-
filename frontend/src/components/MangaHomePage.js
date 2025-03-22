import { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/global';
import { UpcomingManga } from './UpcomingManga';
import { useNavigate, Link } from 'react-router-dom';
import { PopularManga } from './PopularManga';
import { FavouriteManga } from './FavouriteManga';
import Swal from 'sweetalert2';

export const MangaHomePage = () => {
    const {getPopularManga, getUpcomingManga, getFavouriteManga, handleSubmitManga, searchMangas, handleChangeManga} = useGlobalContext();


    const [rendered, setRendered] = useState('popular');

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    const switchComponent = () => {
        switch(rendered) {
            case 'popular':
                return <PopularManga rendered={rendered} />;
            case 'favourite':
                return <FavouriteManga rendered={rendered} />;
            case 'upcoming':
                return <UpcomingManga rendered={rendered} />;
            default:
                return <PopularManga rendered={rendered} />;
        }
    }

    const navigate = useNavigate();

    const handleAnime = () => {
        navigate(`/`);
        
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        console.log("Đang gửi login request với:", { username, password });
    
        try {
            // Tạo FormData
            const formData = new FormData();
            formData.append("username", username); // Gửi username
            formData.append("password", password);
    
            const response = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                body: formData, // Gửi dưới dạng form-data, không cần header Content-Type
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.log("Error từ backend:", errorData);
                let errorMessage = "Đăng nhập thất bại!";
                if (errorData.detail) {
                    if (typeof errorData.detail === "string") {
                        errorMessage = errorData.detail;
                    } else if (Array.isArray(errorData.detail)) {
                        errorMessage = errorData.detail
                            .map((err) => (err.msg ? err.msg : JSON.stringify(err)))
                            .join(", ");
                    } else if (typeof errorData.detail === "object") {
                        errorMessage = JSON.stringify(errorData.detail);
                    }
                }
                throw new Error(errorMessage);
            }
    
            const data = await response.json();
            console.log("ĐÂY LÀ TOKEN: ", data.access_token);
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("username", username);
            console.log("ĐÂY LÀ USERNAME:", username);
            setUsername(username);
            setIsLoggedIn(true);
            document.getElementById("my_modal_2").close();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleLogout = () => {
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
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                setIsLoggedIn(false);
                setUsername('');
            }
        });
    };

    useEffect(() => {
        getPopularManga();
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
                            onClick={() => navigate(`/profile/${username}`)}
                        >
                            Go to your Profile, {username}
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
                            onSubmit={handleLogin}
                        >
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-black font-[500] text-sm sm:text-base">Username</span>
                                </label>
                                <input
                                    type="text"
                                    name="username" // Thêm name để event.target.email.value hoạt động
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
                                    name="password" // Thêm name để event.target.password.value hoạt động
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
                            {rendered === 'popular' ? 'Popular Manga' : rendered === 'favourite' ? 'Favourite Manga' : 'Upcoming Manga'}
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
                        <form action="" className="search-form relative w-full sm:w-auto flex-grow" onSubmit={handleSubmitManga}>
                            <div className="input-control relative">
                                <input
                                    className="w-full py-2 px-4 sm:py-3 sm:px-6 rounded-[30px] text-sm sm:text-base md:text-lg bg-[#fff] border-[3px] border-[#2A3441] outline-none transition-all duration-custom ease-custom"
                                    type="text"
                                    placeholder="Search Manga"
                                    value={searchMangas}
                                    onChange={handleChangeManga}
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
                                setRendered('favourite');
                                getFavouriteManga();
                            }}
                        >
                            Favourite
                        </button>
                        <button
                            className="py-2 px-4 sm:py-3 sm:px-6 font-[500] rounded-[30px] text-sm sm:text-base md:text-lg bg-[#fff] border-[3px] border-[#2A3441] hover:bg-[#e5e7eb] transition-all duration-custom ease-custom"
                            onClick={() => {
                                setRendered('upcoming');
                                getUpcomingManga();
                            }}
                        >
                            Upcoming
                        </button>
                        <button
                            className="w-full sm:w-auto py-2 px-4 sm:py-3 sm:px-6 font-[500] rounded-[30px] text-sm sm:text-base md:text-lg bg-[#fff] border-[3px] border-[#2A3441] hover:bg-[#e5e7eb] transition-all duration-custom ease-custom"
                            onClick={handleAnime}
                        >
                            Explore Anime <i className="fa-solid fa-meteor"></i>
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
                                        state={{ from: '/manga' }}
                                        className="text-[#A5ACBA] text-sm sm:text-base text-center hover:text-[#ffffff]"
                                    >
                                        Manga Recommendations
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={`/recommendations/anime`}
                                        state={{ from: '/manga' }}
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