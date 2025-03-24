import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/global"
import { useEffect } from "react";

export const Sidebar = () => {

    const {topAnime, getTopAnime} = useGlobalContext();
    useEffect(() => {
        getTopAnime();
    }, []);
    return(
        <>
            <div className="sidebar w-full xl:w-[350px] 2xl:w-[400px] mt-[32px] h-fit bg-[#fff] border-t-[5px] border-[#e5e7eb] p-[32px]">
                <h3 className="text-[1.5rem] font-[700] mb-[1.5rem]">Top 10 Anime</h3>
                {/* Thay đổi từ lg:flex-col thành xl:flex-col để list anime hiển thị theo cột từ xl trở lên */}
                <div className="anime-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-1 gap-[1rem]">
                    {topAnime?.slice(0,10).map((anime, index) => {
                        return (
                            <Link to={`/anime/${anime.mal_id}`} key={index}>
                                <div className="flex items-center gap-[1rem] cursor-pointer hover:bg-gray-100 p-[0.5rem] rounded-md">
                                    <img 
                                        src={anime.large_image_url} 
                                        alt="" 
                                        className="w-[4rem] h-[5rem] object-cover rounded-md"
                                    />
                                    <div className="details">
                                        <h4 className="text-[17px] font-[600] line-clamp-2">{anime.title}</h4>
                                        <div className="info flex gap-[0.5rem] mt-[0.5rem]">
                                            <span className="text-[13px]">{anime.episodes} Episodes</span>
                                            <span className="text-[13px]">{anime.mal_stats.score.toFixed(2)} <i className="fas fa-star text-yellow-500"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    )
}