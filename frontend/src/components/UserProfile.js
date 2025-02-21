import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import AOS from "aos";
import 'aos/dist/aos.css';
import mangaImage from '../assets/manga.png';
import animeImage from '../assets/anime.png';
export const UserProfile = () => {
    const {id} = useParams();
    const [user, setUser] = useState([]);

    const getUser = async (username) => {
        const response = await fetch(`https://api.jikan.moe/v4/users/${username}/full`);
        const data = await response.json();
        setUser(data.data);
    }
    
    useEffect(() => {
        getUser(id);
        AOS.init({duration: 800});
        window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');    
    };

    if (!user || !user.statistics || !user.statistics.anime) {
        return <span className="loading loading-bars absolute top-[50%] left-[50%] w-[64px]"></span>;
    }

    return(
        <>
            <div className="bg-[#ffffff] min-h-screen p-[24px]">
                <div className="text-black text-[24px] font-[600] pb-[2px] border-b-[3px] border-[#363535] mb-[64px] flex justify-between">
                    {user.username}'s Profile
                    <button className="text-[20px] flex items-center gap-[8px] hover:text-[#f53535]" onClick={handleLogout}>
                        <i class="fa-solid fa-right-from-bracket"></i>
                        <p className="mb-[3px]">Logout</p>
                    </button>
                </div>
                <div className="flex">
                    <div className="w-[20%] flex flex-col">
                        <div>
                            <p className="flex gap-[16px] items-center mb-[12px]">
                                    <span className="font-[700] text-[#000000] text-[18px]">Total Anime in List:</span> <span className="text-black text-[18px]">{user?.statistics?.anime?.total_entries || 0}</span>
                            </p>
                            <p className="flex gap-[16px] items-center mb-[12px]">
                                <span className="font-[700] text-[#000000] text-[18px]">Total Manga in List: </span> <span className="text-black text-[18px]">{user?.statistics?.manga?.total_entries || 0}</span>
                            </p>
                            <p className="flex gap-[16px] items-center mb-[12px]">
                                <span className="font-[700] text-[#000000] text-[18px]">Your</span> <Link to={`/recommendations/manga`} state={{from: '/'}} className='text-[#000000] text-[18px] font-[600] text-center hover:text-[#484444] cursor-pointer underline'>Manga Recommendations</Link>
                            </p>
                            <p className="flex gap-[16px] items-center mb-[12px]">
                                <span className="font-[700] text-[#000000] text-[18px]">Your</span> <Link to={`/recommendations/anime`} state={{from: '/'}} className='text-[#000000] text-[18px] font-[600] text-center hover:text-[#484444] cursor-pointer underline'>Anime Recommendations</Link>
                            </p>
                            <p className="flex gap-[16px] items-center mb-[16px] mt-[128px]">
                                <span className="font-[700] text-[#000000] text-[18px]">Explore</span> <Link to={`/`} className='text-[#000000] text-[18px] font-[600] text-center hover:text-[#484444] cursor-pointer underline'>Most Popular Anime right now</Link>
                            </p>
                            <p className="flex gap-[16px] items-center mb-[16px]">
                                <span className="font-[700] text-[#000000] text-[18px]">Explore</span> <Link to={`/manga`} className='text-[#000000] text-[18px] font-[600] text-center hover:text-[#484444] cursor-pointer underline'>Most Popular Manga right now</Link>
                            </p>
                        </div>
                    </div>
                    <div className="w-[80%] border-l-[3px] border-[#363535] pl-[32px] flex justify-between items-start gap-[32px]">
                        <div className="collapse bg-[#f4f0f0] rounded-lg shadow-lg overflow-hidden">
                            <input type="checkbox" />
                            <div className="collapse-title text-xl font-medium m-0 p-0">
                                <div className="p-[16px] text-[20px] text-black font-[600]">
                                    Anime Stats
                                </div>
                                <div className="flex items-center justify-between p-[16px]">
                                    <div className="font-[700] text-[#000000] text-[18px] flex items-center gap-[8px]">
                                        <p>Mean Score: </p>
                                        <span>{user?.statistics?.anime?.mean_score || 0}</span>
                                    </div>
                                    <div className="font-[700] text-[#000000] text-[18px] flex items-center gap-[8px]">
                                        <p>Episodes: </p>
                                        <span>{user?.statistics?.anime?.episodes_watched.toLocaleString() || 0}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-[8px] p-[16px]">
                                    <div className="flex items-center gap-[8px]">
                                        <i className="fa-solid fa-circle text-[#338543] mr-[6px] text-[16px]"></i>
                                        <p className="text-[#2D4276] text-[16px] font-[600]">Watching</p>
                                        <span className="mt-[3px] text-[18px] text-black ml-[48px] font-[500]">
                                            {user?.statistics?.anime?.watching || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-[8px]">
                                        <i className="fa-solid fa-circle text-[#2D4276] mr-[6px] text-[16px]"></i>
                                        <p className="text-[#2D4276] text-[16px] font-[600]">Completed</p>
                                        <span className="mt-[3px] text-[18px] text-black ml-[48px] font-[500]">
                                            {user?.statistics?.anime?.completed || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-[8px]">
                                        <i className="fa-solid fa-circle text-[#C9A31F] mr-[6px] text-[16px]"></i>
                                        <p className="text-[#2D4276] text-[16px] font-[600]">On-Hold</p>
                                        <span className="mt-[3px] text-[18px] text-black ml-[48px] font-[500]">
                                            {user?.statistics?.anime?.on_hold || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-[8px]">
                                        <i className="fa-solid fa-circle text-[#832F30] mr-[6px] text-[16px]"></i>
                                        <p className="text-[#2D4276] text-[16px] font-[600]">Dropped</p>
                                        <span className="mt-[3px] text-[18px] text-black ml-[48px] font-[500]">
                                            {user?.statistics?.anime?.dropped || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-[8px]">
                                        <i className="fa-solid fa-circle text-[#747474] mr-[6px] text-[16px]"></i>
                                        <p className="text-[#2D4276] text-[16px] font-[600]">Plan to Watch</p>
                                        <span className="mt-[3px] text-[18px] text-black ml-[48px] font-[500]">
                                            {user?.statistics?.anime?.plan_to_watch || 0}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-black text-[22px] font-[600] py-[16px] pl-[16px]">
                                    <i className="fa-solid fa-caret-down text-[24px] mr-[12px] text-black"></i>
                                    View All Anime List
                                </div>
                            </div>
                            <div className="collapse-content">
                                <div className="overflow-hidden relative h-[400px]">
                                    <Link to={`/animelist/1`}>
                                        <img className="w-full h-full object-cover rounded-[5px] opacity-75" src={animeImage} alt="" />
                                    </Link>
                                        <div
                                            className="absolute inset-0 rounded-[5px] bg-black bg-opacity-80 flex flex-col items-center p-[12px] justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                            onClick={() => navigate(`/animelist/1`)} // Click vào overlay sẽ điều hướng
                                        >
                                            <i className="fa-solid fa-bars text-center text-white text-[36px] relative z-10 hover:text-[#b7b4b4]"></i>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="collapse bg-[#f4f0f0] rounded-lg shadow-lg overflow-hidden">
                            <input type="checkbox" />
                            <div className="collapse-title text-xl font-medium m-0 p-0">
                                <div className="p-[16px] text-[20px] text-black font-[600]">
                                    Manga Stats
                                </div>
                                <div className="flex items-center justify-between p-[16px]">
                                    <div className="font-[700] text-[#000000] text-[18px] flex items-center gap-[8px]">
                                        <p>Mean Score: </p>
                                        <span>{user?.statistics?.manga?.mean_score || 0}</span>
                                    </div>
                                    <div className="font-[700] text-[#000000] text-[18px] flex items-center gap-[8px]">
                                        <p>Chapters: </p>
                                        <span>{user?.statistics?.manga?.chapters_read.toLocaleString() || 0}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-[8px] p-[16px]">
                                    <div className="flex items-center gap-[8px]">
                                        <i className="fa-solid fa-circle text-[#338543] mr-[6px] text-[16px]"></i>
                                        <p className="text-[#2D4276] text-[16px] font-[600]">Reading</p>
                                        <span className="mt-[3px] text-[18px] text-black ml-[48px] font-[500]">
                                            {user?.statistics?.manga?.reading || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-[8px]">
                                        <i className="fa-solid fa-circle text-[#2D4276] mr-[6px] text-[16px]"></i>
                                        <p className="text-[#2D4276] text-[16px] font-[600]">Completed</p>
                                        <span className="mt-[3px] text-[18px] text-black ml-[48px] font-[500]">
                                            {user?.statistics?.manga?.completed || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-[8px]">
                                        <i className="fa-solid fa-circle text-[#C9A31F] mr-[6px] text-[16px]"></i>
                                        <p className="text-[#2D4276] text-[16px] font-[600]">On-Hold</p>
                                        <span className="mt-[3px] text-[18px] text-black ml-[48px] font-[500]">
                                            {user?.statistics?.manga?.on_hold || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-[8px]">
                                        <i className="fa-solid fa-circle text-[#832F30] mr-[6px] text-[16px]"></i>
                                        <p className="text-[#2D4276] text-[16px] font-[600]">Dropped</p>
                                        <span className="mt-[3px] text-[18px] text-black ml-[48px] font-[500]">
                                            {user?.statistics?.manga?.dropped || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-[8px]">
                                        <i className="fa-solid fa-circle text-[#747474] mr-[6px] text-[16px]"></i>
                                        <p className="text-[#2D4276] text-[16px] font-[600]">Plan to Watch</p>
                                        <span className="mt-[3px] text-[18px] text-black ml-[48px] font-[500]">
                                            {user?.statistics?.manga?.plan_to_watch || 0}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-black text-[22px] font-[600] py-[16px] pl-[16px]">
                                    <i className="fa-solid fa-caret-down text-[24px] mr-[12px] text-black"></i>
                                    View All Manga List
                                </div>
                            </div>
                            <div className="collapse-content">
                                <div className="overflow-hidden relative h-[400px]">
                                    <Link to={`/animelist/1`}>
                                        <img className="w-full h-full object-cover rounded-[5px] opacity-75" src={mangaImage} alt="" />
                                    </Link>
                                        <div
                                            className="absolute inset-0 rounded-[5px] bg-black bg-opacity-80 flex flex-col items-center p-[12px] justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                            onClick={() => navigate(`/mangalist/1`)} // Click vào overlay sẽ điều hướng
                                        >
                                            <i className="fa-solid fa-bars text-center text-white text-[36px] relative z-10 hover:text-[#b7b4b4]"></i>
                                        </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}