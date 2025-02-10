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
            <div className="mt-[32px] bg-[#fff] border-t-[5px] border-[#e5e7eb] pl-[60px] pt-[32px]">
                <h3 className="text-[24px] font-[700]">Top 5 of All Times</h3>
                <div className="anime flex flex-col width-[125px]">
                    {topAnime?.slice(0,5).map((anime) => {
                        return <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="mt-[16px] flex flex-col gap-[6px] text-[#98C56C] font-[600]">
                            <img src={anime.images.jpg.large_image_url} alt="" className="w-[80%] rounded-[5px] border-[5px] border-[#e5e7eb]"/>
                            <h5 className="text-[18px]">{anime.title}</h5>
                        </Link>
                    })}
                </div>
            </div>
        </>
    )
}