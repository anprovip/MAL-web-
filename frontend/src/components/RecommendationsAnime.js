import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../context/global';
import AOS from "aos";
import 'aos/dist/aos.css';

export const RecommendationsAnime = () => {

    const {animeRecommendations, getAnimeRecommendations} = useGlobalContext();
    useEffect(() => {
        getAnimeRecommendations();
        AOS.init({duration: 800});
    }, []);
    const location = useLocation();
    const fromPage = location.state?.from || "/";

    const conditionalRender = () => {
        return animeRecommendations?.map((recommendation, index) => {
            const [anime1, anime2] = recommendation.entry;
            return (
                <div className="recommend-anime flex flex-wrap justify-between items-center mb-[64px]
                    bg-[#fff] border-t-[5px] border-b-[5px] p-[48px] border-[#e5e7eb]" key={`${recommendation.mal_id}-${index}`} data-aos="fade-up">
                    <div className='text-[20px] text-[#98C56C] font-[700]'>
                        If you liked:
                    </div>
                    <Link 
                        className="relative h-[500px] max-w-[370px] ml-[-300px] border-[5px] bg-[#e5e7eb] border-[#e5e7eb] pb-[64px] rounded-[7px] overflow-hidden"
                        to={`/anime/${anime1.mal_id}`} 
                        key={anime1.mal_id}
                    >
                        <img 
                            className="w-full h-full object-cover rounded-[5px]" 
                            src={anime1.images.jpg.large_image_url} 
                            alt={anime1.title} 
                        />
                        <div className="text-center font-[600] text-[18px] mt-[8px] mx-[4px] line-clamp-2">
                            {anime1.title}
                        </div>
                        <div className="absolute inset-0 rounded-[5px] bg-black bg-opacity-80 flex items-start p-[12px] justify-start opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <div className="text-white">
                                <h3 className="text-[24px] font-[700]">{anime1.title}</h3>
                                <p className="mt-[8px] mb-[32px]">Click to see score <i className="text-[#F3DF4C] fa-solid fa-star"></i></p>
                                <p className="text-[16px] mt-[16px] line-clamp-6">Click to see more information</p>
                            </div>
                        </div>
                    </Link>
                    <div className='text-[20px] text-[#98C56C] font-[700] mr-[-325px]'>
                        ...Then you might like:
                    </div>
                    <Link 
                        className="relative h-[500px] max-w-[370px] border-[5px] bg-[#e5e7eb] border-[#e5e7eb] pb-[64px] rounded-[7px] overflow-hidden"
                        to={`/anime/${anime2.mal_id}`} 
                        key={anime2.mal_id}
                    >
                        <img 
                            className="w-full h-full object-cover rounded-[5px]" 
                            src={anime2.images.jpg.large_image_url} 
                            alt={anime2.title} 
                        />
                        <div className="text-center font-[600] text-[18px] mt-[8px] mx-[4px] line-clamp-2">
                            {anime2.title}
                        </div>
                        <div className="absolute inset-0 rounded-[5px] bg-black bg-opacity-80 flex items-start p-[12px] justify-start opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <div className="text-white">
                                <h3 className="text-[24px] font-[700]">{anime2.title}</h3>
                                <p className="mt-[8px] mb-[32px]">Click to see score <i className="text-[#F3DF4C] fa-solid fa-star"></i></p>
                                <p className="text-[16px] mt-[16px] line-clamp-6">Click to see more information</p>
                            </div>
                        </div>
                    </Link>
                    <div className="text-center font-[500] text-[18px] mt-[64px] w-full mx-[200px]" data-aos="fade-up">
                        {recommendation.content}
                    </div>
                </div>
            );
        });
    }

    return(
        <>  
            <div className="bg-[#ededed] text-black px-[32px] py-[32px]">
                <Link to={fromPage} className="font-[700] text-[#EB5757] text-[22px] flex items-center gap-[8px]">
                    <i className="fas fa-arrow-left"></i>
                    Back to {fromPage === "/manga" ? "Manga Home" : "Anime Home"}
                </Link>
                <header className="py-[32px] px-[80px] w-[90%] mx-auto my-0 transition-all duration-custom ease-custom flex flex-col items-center justify-center">
                    <div className="logo flex items-center justify-center mb-[32px]">
                        <h1 className="text-[48px] font-[700]">
                            Anime Recommendations
                        </h1>
                    </div>
                    <div className="dropdown dropdown-hover mb-[64px]">
                        <div tabIndex={0} role="button" className="btn m-1 rounded-[30px] w-[275px] font-[500] text-[20px] h-[58px] hover:text-[#ffffff]">Recommendations <i class="fa-solid fa-chess-queen mb-[2px] ml-[4px]"></i></div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 z-[1] ml-[16px] p-[4px] shadow w-[250px] rounded-[20px]">
                            <li>
                                <Link to={`/recommendations/manga`} state={{fromPage}} className='text-[#A5ACBA] text-[16px] text-center hover:text-[#ffffff]'>Manga Recommendations</Link>
                            </li>
                            <li>
                                <Link to={`/recommendations/anime`} state={{fromPage}} className='text-[#A5ACBA] text-[16px] text-center hover:text-[#ffffff]'>Anime Recommendations</Link>
                            </li>
                        </ul>
                    </div>
                </header>
                <div className="w-full">
                    {conditionalRender()}
                </div>
            </div>
        </>
    )
}