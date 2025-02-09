import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/global"
import { MangaSidebar } from "./MangaSidebar";

export const PopularManga = ({rendered}) => {
    const {popularManga, isSearchManga, searchResults} = useGlobalContext();
    console.log(popularManga);

    const navigate = useNavigate();

    const conditionalRender = () => {
        if(!isSearchManga && rendered === 'popular') {
            return popularManga?.map((manga) => {
                return <Link className="relative h-[500px] border-[5px] bg-[#e5e7eb] border-[#e5e7eb] pb-[64px] rounded-[7px] overflow-hidden" to={`/manga/${manga.mal_id}`} key={manga.mal_id}>
                    <img className="w-full h-full object-cover rounded-[5px]" src={manga.images.jpg.large_image_url} alt="" />
                    <div className="text-center font-[600] text-[18px] mt-[8px] mx-[4px] line-clamp-2">{manga.title}</div>
                    <div className="absolute inset-0 rounded-[5px] bg-black bg-opacity-80 flex items-start p-[12px] justify-start opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="text-white">
                            <h3 className="text-[24px] font-[700]">{manga.title}</h3>
                            <p className="mt-[8px] mb-[32px]">{manga.score} <i class="text-[#F3DF4C] fa-solid fa-star"></i></p>
                            <p className="text-[16px] mt-[16px] line-clamp-6">{manga.synopsis}</p>
                        </div>
                    </div>
                </Link>
            });
        }
        else{
            return searchResults?.map((manga) => {
                return <Link className="relative h-[500px] border-[5px] bg-[#e5e7eb] border-[#e5e7eb] pb-[64px] rounded-[7px] overflow-hidden" to={`/manga/${manga.mal_id}`} key={manga.mal_id}>
                    <img className="w-full h-full object-cover rounded-[5px]" src={manga.images.jpg.large_image_url} alt="" />
                    <div className="text-center font-[600] text-[18px] mt-[8px] mx-[4px] line-clamp-2">{manga.title}</div>
                    <div className="absolute inset-0 rounded-[5px] bg-black bg-opacity-80 flex items-start p-[12px] justify-start opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="text-white">
                            <h3 className="text-[24px] font-[700]">{manga.title}</h3>
                            <p className="mt-[8px] mb-[32px]">{manga.score} <i class="text-[#F3DF4C] fa-solid fa-star"></i></p>
                            <p className="text-[16px] mt-[16px] line-clamp-6">{manga.synopsis}</p>
                        </div>
                    </div>
                </Link>
            });
        }
    }
    return(
        <>
            <div className="flex">
                <div className="popular-anime mt-[32px] pt-[32px] pb-[32px] pl-[80px] pr-[32px] grid grid-cols-4 gap-[32px] w-full
                bg-[#fff] border-t-[5px] border-[#e5e7eb]">
                    {conditionalRender()}
                </div>
                <MangaSidebar />
            </div>
        </>
    )
}
