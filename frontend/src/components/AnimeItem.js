import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import AOS from "aos";
import 'aos/dist/aos.css';
import { CharacterItem } from "../custom/CharacterItem";

export const AnimeItem = () => {
    const {id} = useParams();
    const [anime, setAnime] = useState({});
    const [characters, setCharacters] = useState([]);
    const [showMore, setShowMore] = useState(false);

    const {title, episodes, synopsis, trailer, duration, aired, season, images, rank, score, scored_by, popularity, status, rating, genres, producers} = anime;

    // Get anime by id
    const getAnime = async (anime) => {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${anime}`);
        const data = await response.json();
        setAnime(data.data);
    }

    // get characters
    const getCharacters = async (anime) => {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${anime}/characters`);
        const data = await response.json();
        setCharacters(data.data);
        console.log(data.data);
    }
    
    useEffect(() => {
        getAnime(id);
        getCharacters(id);
        AOS.init({duration: 800});
        window.scrollTo(0, 0);
    }, []);

    return(
        <>
            <div className="py-[24px] px-[16px] sm:py-[32px] sm:px-[24px] md:py-[36px] md:px-[48px] lg:py-[42px] lg:px-[128px] xl:py-[48px] xl:px-[192px] 2xl:py-[48px] 2xl:px-[288px] bg-[#EDEDED]">
                <h1 className="inline-block text-[28px] sm:text-[32px] md:text-[36px] lg:text-[42px] xl:text-[48px] mb-[16px] sm:mb-[20px] md:mb-[24px] cursor-pointer bg-custom-gradient font-[900] bg-clip-text text-transparent transition-all duration-custom ease-custom transform hover:text-gray-900">
                    {title}
                </h1>
                <div className="details bg-[#ffffff] rounded-[20px] p-[16px] sm:p-[24px] md:p-[28px] lg:p-[32px] border-[3px] sm:border-[4px] md:border-[5px] border-[#e5e7eb]">
                    <div className="detail grid grid-cols-1 md:grid-cols-2 gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[32px]">
                        <div className="image relative" data-aos="fade-down">
                            {/* Added max width to limit image size on 2xl screens */}
                            <div className="w-full md:max-w-full lg:max-w-[90%] xl:max-w-[80%] 2xl:max-w-[70%] mx-auto">
                                <img src={images?.jpg.large_image_url} alt="" className="rounded-[7px] w-full"/>
                            </div>
                            
                            {/* Added positioning improvements for the button */}
                            <div className="md:absolute lg:left-[16px] xl:left-[60px] 2xl:left-[92px] mt-[15px]">
                                <label
                                    htmlFor={`modal_${id}`}
                                    className="p-0 bg-[#4F74C8] border-none shadow-md hover:bg-[#294586] focus:bg-[#294586] active:bg-[#294586] transition-all duration-300 ease-in-out rounded-[8px] px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-[8px] sm:gap-[12px] cursor-pointer w-fit"
                                    data-aos="fade-down"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <i className="fa-solid fa-square-plus text-[#ffffff] text-[16px] sm:text-[18px] md:text-[20px] transition-all duration-300 ease-in-out ml-[4px] sm:ml-[8px]"></i>
                                    <span className="text-[#ffffff] text-sm sm:text-base md:text-lg font-[500] transition-all duration-300 ease-in-out mr-[4px] sm:mr-[8px]">
                                        Add to My Anime List
                                    </span>
                                </label>
                            </div>
                        </div>

                        <input type="checkbox" id={`modal_${id}`} className="modal-toggle" />
                        <div className="modal" role="dialog">
                            <div className="modal-box bg-[#efecec] w-[90%] max-w-lg">
                                <h3 className="text-lg font-bold text-black">{anime.title}</h3>
                                
                                <form className="mt-[20px]">
                                    <div className="mb-[24px]">
                                        <label htmlFor="status" className="block text-sm font-medium text-black">Status</label>
                                        <select
                                            id="status"
                                            className="bg-transparent w-full mt-[10px] p-[6px] border border-gray-300 rounded text-gray-800"
                                        >
                                            <option value="watching">Watching</option>
                                            <option value="completed">Completed</option>
                                            <option value="dropped">Dropped</option>
                                            <option value="onHold">On-Hold</option>
                                            <option value="planToWatch">Plan to Watch</option>
                                        </select>
                                    </div>

                                    <div className="mb-[24px]">
                                        <label htmlFor="score" className="block text-sm font-medium text-black">Your Score</label>
                                        <select
                                            id="score"
                                            className="bg-transparent w-full mt-[10px] p-[6px] border border-gray-300 rounded flex flex-col items-center text-gray-800"
                                        >
                                            <option value="0">Select score</option>
                                            <option value="1">(1)  Appalling</option>
                                            <option value="2">(2)  Horrible</option>
                                            <option value="3">(3)  Very Bad</option>
                                            <option value="4">(4)  Bad</option>
                                            <option value="5">(5)  Average</option>
                                            <option value="6">(6)  Fine</option>
                                            <option value="7">(7)  Good</option>
                                            <option value="8">(8)  Very Good</option>
                                            <option value="9">(9)  Great</option>
                                            <option value="10">(10)  Masterpiece</option>
                                        </select>
                                    </div>
                                    <p className="text-center text-sm mt-[32px] mb-[24px] text-gray-700">
                                        If you haven't been able to add anime to your list yet, {" "}
                                        <Link to="/register" className="text-gray-800 hover:text-[#000000] hover:underline">
                                            sign up here.
                                        </Link>
                                    </p>
                                    <button type="submit" className="btn bg-gray-400 text-black hover:text-[#aeaeae] border-none w-full mt-2 hover:bg-gray-700">
                                        Add to your Anime List
                                    </button>
                                </form>
                            </div>
                            <label className="modal-backdrop" htmlFor={`modal_${id}`}></label>
                        </div>

                        <div className="anime-details flex flex-col justify-between gap-2 md:gap-1" data-aos="fade-left">
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">Aired:</span> <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">{aired?.string}</span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">Rating: </span> <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">{rating}</span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">Rank:</span> <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">{rank}</span>
                            </p>
                            <p className="flex gap-[4px] sm:gap-[6px] md:gap-[8px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">Score:</span> <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">{score}</span> <i className="text-[#F3DF4C] mb-[2px] fa-solid fa-star"></i>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center flex-wrap">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">Scored By:</span> <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">{scored_by?.toLocaleString() || 'No users scored yet'} users</span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">Popularity:</span> <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">{popularity}</span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">Status:</span> <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">{status}</span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">Episodes:</span> <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">{episodes}</span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">Season:</span> <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">{season}</span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">Duration:</span> <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">{duration}</span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-start flex-wrap">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">Producers:</span>
                                <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">
                                    {producers && producers.map((item, index) => (
                                        <span key={index}>
                                            {item.name}
                                            {index < producers.length - 1 && ", "}
                                        </span>
                                    ))}
                                </span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-start flex-wrap">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">Genres:</span>
                                <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">
                                    {genres && genres.map((item, index) => (
                                        <span key={index}>
                                            {item.name}
                                            {index < genres.length - 1 && ", "}
                                        </span>
                                    ))}
                                </span>
                            </p>
                        </div>
                    </div>
                    <p className="description mt-[40px] sm:mt-[60px] md:mt-[80px] lg:mt-[100px] text-[#6c7983] leading-[1.7] font-[500]" data-aos="fade-up">
                        {showMore ? synopsis : synopsis?.substring(0, 450) + '...'}
                        <button className="bg-transparent border-none outline-none cursor-pointer text-[16px] sm:text-[18px] md:text-[20px] text-[#27AE60] font-[800]" onClick={() => {
                            setShowMore(!showMore);
                        }}>
                            {showMore ? 'Show less' : 'Show more'}
                        </button>
                    </p>
                </div>
                <h3 className="trailer-title inline-block my-[24px] sm:my-[36px] md:my-[48px] mx-0 text-[24px] sm:text-[28px] md:text-[32px] cursor-pointer bg-custom-gradient bg-clip-text text-transparent font-[700]" data-aos-delay="300" data-aos="fade-up">
                    Trailer
                </h3>
                <div className="trailer-container flex justify-center items-center" data-aos="fade-up" data-aos-delay="500">
                    {trailer?.embed_url && 
                        <iframe 
                            src={trailer?.embed_url} 
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full sm:w-[80%] md:w-[700px] lg:w-[800px] h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] outline-none border-[3px] sm:border-[4px] md:border-[5px] border-[#e5e7eb] rounded-[10px] bg-[#ffffff] p-[12px] sm:p-[16px] md:p-[20px] lg:p-[24px]"    
                        >
                        </iframe>
                    }
                </div>
                <h3 className="characters-title inline-block my-[24px] sm:my-[36px] md:my-[48px] mx-0 text-[24px] sm:text-[28px] md:text-[32px] cursor-pointer bg-custom-gradient bg-clip-text text-transparent font-[700]" data-aos="fade-up" data-aos-delay="300">
                    Characters
                </h3>
                <div className="characters grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[32px] bg-white p-[16px] sm:p-[24px] md:p-[28px] lg:p-[32px] rounded-[20px] border-[3px] sm:border-[4px] md:border-[5px] border-[#e5e7eb]" data-aos="fade-up" data-aos-delay="500">
                    {characters?.map((character, index) => (
                        <CharacterItem key={index} character={character} />
                    ))}
                </div>
            </div>
        </>
    )
}