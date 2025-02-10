import { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/global';
import { UpcomingManga } from './UpcomingManga';
import { useNavigate, Link } from 'react-router-dom';
import { PopularManga } from './PopularManga';
import { FavouriteManga } from './FavouriteManga';


export const MangaHomePage = () => {
    const {getPopularManga, getUpcomingManga, getFavouriteManga, handleSubmitManga, searchMangas, handleChangeManga} = useGlobalContext();

    useEffect(() => {
        getPopularManga();
    }, []);

    const [rendered, setRendered] = useState('popular');

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
    return(
        <>
            <div className="bg-[#ededed] text-black">
                <button className="btn relative ml-[1690px] top-[20px] w-[10%] rounded-[20px] bg-gray-100 hover:bg-gray-300 text-gray-800 text-[16px]" onClick={() => document.getElementById('my_modal_2').showModal()}>
                    Login to see more
                </button>
                <dialog id="my_modal_2" className="modal">
                    <div className="modal-box bg-white shadow-lg">
                        <h3 className="font-bold text-lg mb-4 text-black">Đăng nhập</h3>
                        <form className="flex flex-col gap-4">
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
                            {rendered === 'popular' ? 'Popular Manga' : 
                            rendered === 'favourite' ? 'Favourite Manga' : 'Upcoming Manga'}
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
                        <form action="" className="search-form relative w-full" onSubmit={handleSubmitManga}>
                            <div className="input-control relative transition-all duration-custom ease-custom">
                                <input
                                    className="w-full py-[12px] px-[16px] outline-none rounded-[30px] text-[20px] bg-[#fff] border-[3px] border-[#2A3441] transition-all duration-custom ease-custom"
                                    type="text" 
                                    placeholder="Search Manga" 
                                    value={searchMangas} 
                                    onChange={handleChangeManga} 
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
                                setRendered('favourite')
                                getFavouriteManga();
                            }}>Favourite</button>
                        </div>
                        <div className="filter-button upcoming-filter">
                            <button className="flex items-center gap-[8px] py-[11px] px-[24px] font-[500] rounded-[30px] outline-none text-[20px] bg-[#fff] border-[3px] border-[#2A3441] cursor-pointer transition-all duration-custom ease-custom hover:bg-[#e5e7eb]" onClick={() => {
                                setRendered('upcoming')
                                getUpcomingManga();
                            }}>Upcoming</button>
                        </div>
                        <div className="filter-button manga-filter">
                            <button className="w-[230px] flex items-center gap-[8px] py-[11px] px-[24px] font-[500] rounded-[30px] outline-none text-[20px] bg-[#fff] border-[3px] border-[#2A3441] cursor-pointer transition-all duration-custom ease-custom hover:bg-[#e5e7eb]" onClick={handleAnime}>
                                Explore Anime
                                <i class="fa-solid fa-meteor"></i>
                            </button>
                        </div>
                        <div className="dropdown dropdown-hover">
                            <div tabIndex={0} role="button" className="btn m-1 rounded-[30px] w-[275px] font-[500] text-[20px] h-[58px] hover:text-[#ffffff]">Recommendations <i class="fa-solid fa-chess-queen mb-[2px] ml-[4px]"></i></div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 z-[1] ml-[16px] p-[4px] shadow w-[250px] rounded-[20px]">
                                <li>
                                    <Link to={`/recommendations/manga`} state={{from: '/manga'}} className='text-[#A5ACBA] text-[16px] text-center hover:text-[#ffffff]'>Manga Recommendations</Link>
                                </li>
                                <li>
                                    <Link to={`/recommendations/anime`} state={{from: '/manga'}} className='text-[#A5ACBA] text-[16px] text-center hover:text-[#ffffff]'>Anime Recommendations</Link>
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