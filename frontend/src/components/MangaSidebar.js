import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/global"
import { useEffect } from "react";

export const MangaSidebar = () => {

    const {topManga, getTopManga} = useGlobalContext();
    useEffect(() => {
        getTopManga();
    }, []);
    return(
        <>
            <div className="sidebar w-full xl:w-[350px] 2xl:w-[400px] mt-[32px] h-fit bg-[#fff] border-t-[5px] border-[#e5e7eb] p-[32px]">
                <h3 className="text-[1.5rem] font-[700] mb-[1.5rem]">Top 10 of All Times</h3>
                <div className="manga-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-1 gap-[1rem]">
                    {topManga?.slice(0,10).map((manga, index) => {
                        return (
                            <Link to={`/manga/${manga.mal_id}`} key={index}>
                                <div className="flex items-center gap-[1rem] cursor-pointer hover:bg-gray-100 p-[0.5rem] rounded-md">
                                    <img 
                                        src={manga.images.jpg.image_url} 
                                        alt="" 
                                        className="w-[4rem] h-[5rem] object-cover rounded-md"
                                    />
                                    <div className="details">
                                        <h4 className="text-[17px] font-[600] line-clamp-2">{manga.title}</h4>
                                        <div className="info flex gap-[0.5rem] mt-[0.5rem]">
                                            <span className="text-[13px]">{manga.volumes ? manga.volumes + ' Volumes' : 'Ongoing'}</span>
                                            <span className="text-[13px]">{manga.score} <i className="fas fa-star text-yellow-500"></i></span>
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