import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import AOS from "aos";
import 'aos/dist/aos.css';

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
            <div className="py-[48px] px-[288px] bg-[#EDEDED]">
                <h1 className="inline-block text-[48px] mb-[24px] cursor-pointer bg-custom-gradient font-[900] bg-clip-text text-transparent transition-all duration-custom ease-custom transform hover:text-gray-900">
                    {title}
                </h1>
                <div className="details bg-[#ffffff] rounded-[20px] p-[32px] border-[5px] border-[#e5e7eb]">
                    <div className="detail grid grid-cols-2 gap-[32px]">
                        <div className="image" data-aos="fade-down">
                            <img src={images?.jpg.large_image_url} alt="" className="rounded-[7px]"/>
                        </div>
                        <div className="anime-details flex flex-col justify-between" data-aos="fade-left">
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Aired:</span> <span className="text-black text-[18px]">{aired?.string}</span>
                            </p>
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Rating: </span> <span className="text-black text-[18px]">{rating}</span>
                            </p>
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Rank:</span> <span className="text-black text-[18px]">{rank}</span>
                            </p>
                            <p className="flex gap-[8px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Score:</span> <span className="text-black text-[18px]">{score}</span> <i class="text-[#F3DF4C] mb-[2px] fa-solid fa-star"></i>
                            </p>
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Scored By:</span> <span className="text-black text-[18px]">{scored_by?.toLocaleString() || 'No users scored yet'} users</span>
                            </p>
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Popularity:</span> <span className="text-black text-[18px]">{popularity}</span>
                            </p>
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Status:</span> <span className="text-black text-[18px]">{status}</span>
                            </p>
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Episodes:</span> <span className="text-black text-[18px]">{episodes}</span>
                            </p>
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Season:</span> <span className="text-black text-[18px]">{season}</span>
                            </p>
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Duration:</span> <span className="text-black text-[18px]">{duration}</span>
                            </p>
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Producers:</span>
                                <span className="text-black text-[18px]">
                                    {producers && producers.map((item, index) => (
                                        <span key={index}>
                                            {item.name}
                                            {index < producers.length - 1 && ", "}
                                        </span>
                                    ))}
                                </span>
                            </p>
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Genres:</span>
                                <span className="text-black text-[18px]">
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
                    <p className="description mt-[32px] text-[#6c7983] leading-[1.7] font-[500]" data-aos="fade-up">
                        {showMore ? synopsis : synopsis?.substring(0, 450) + '...'}
                        <button className="bg-transparent border-none outline-none cursor-pointer text-[20px] text-[#27AE60] font-[800]" onClick={() => {
                            setShowMore(!showMore);
                        }}>
                            {showMore ? 'Show less' : 'Show more'}
                        </button>
                    </p>
                </div>
                <h3 className="trailer-title inline-block my-[48px] mx-0 text-[32px] cursor-pointer bg-custom-gradient bg-clip-text text-transparent font-[700]" data-aos-delay="300" data-aos="fade-up">
                    Trailer
                </h3>
                <div className="trailer-container flex justify-center items-center" data-aos="fade-up" data-aos-delay="500">
                    {trailer?.embed_url && 
                        <iframe 
                            src={trailer?.embed_url} 
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-[800px] h-[450px] outline-none border-[5px] border-[#e5e7eb] rounded-[10px] bg-[#ffffff] p-[24px]"    
                        >
                        </iframe>
                    }
                </div>
                <h3 className="characters-title inline-block my-[48px] mx-0 text-[32px] cursor-pointer bg-custom-gradient bg-clip-text text-transparent font-[700]" data-aos="fade-up" data-aos-delay="300">
                    Characters
                </h3>
                <div className="characters grid grid-cols-5 gap-[32px] bg-white p-[32px] rounded-[20px] border-[5px] border-[#e5e7eb]" data-aos="fade-up" data-aos-delay="500">
                    {characters?.map((character, index) => {
                        const {role} = character;
                        const {images, name, mal_id} = character.character;
                        return <Link to={`/character/${mal_id}`} state={{from: '/'}} key={index}>
                            <div className="character py-[8px] px-[10px] rounded-[7px] bg-[#EDEDED] transition-all duration-custom ease-custom hover:scale-105">
                                <img src={images?.jpg.image_url} alt="" className="w-full"/>
                                <h4 className="py-[8px] px-0 text-[#454e56]">{name}</h4>
                                <p className="text-[#27AE60]">{role}</p>
                            </div>
                        </Link>
                    })}
                </div>
            </div>
        </>
    )
}