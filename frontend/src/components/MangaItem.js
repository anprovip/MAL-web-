import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import AOS from "aos";
import 'aos/dist/aos.css';

export const MangaItem = () => {
    const {id} = useParams();
    const [manga, setManga] = useState({});
    const [characters, setCharacters] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [showMore, setShowMore] = useState(false);

    const {title, status, chapters, volumes, published, synopsis, images, rank, score, scored_by, popularity, authors, genres, demographics} = manga;

    // Get anime by id
    const getManga = async (manga) => {
        const response = await fetch(`https://api.jikan.moe/v4/manga/${manga}`);
        const data = await response.json();
        setManga(data.data);
    }

    // get characters
    const getCharacters = async (manga) => {
        const response = await fetch(`https://api.jikan.moe/v4/manga/${manga}/characters`);
        const data = await response.json();
        setCharacters(data.data);
        console.log(data.data);
    }
    
    const getReviews = async (manga) => {
        const response = await fetch(`https://api.jikan.moe/v4/manga/${manga}/reviews`);
        const data = await response.json();
        setReviews(data.data);
    }
    useEffect(() => {
        getManga(id);
        getCharacters(id);
        getReviews(id);
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
                        <div className="image relative" data-aos="fade-down">
                            <img src={images?.jpg.large_image_url} alt="" className="rounded-[7px]"/>

                            <label
                                htmlFor={`modal_${id}`}
                                className="p-0 absolute left-0 mt-[15px] bg-[#4F74C8] border-none shadow-md hover:bg-[#294586] focus:bg-[#294586] active:bg-[#294586] transition-all duration-300 ease-in-out rounded-[8px] px-4 py-2 flex items-center gap-[12px] cursor-pointer"
                                onClick={(e) => e.stopPropagation()} // Ngăn chặn điều hướng khi click nút
                            >
                                <i className="fa-solid fa-square-plus text-[#ffffff] text-[20px] transition-all duration-300 ease-in-out ml-[8px]"></i>
                                <span className="text-[#ffffff] text-lg font-[500] transition-all duration-300 ease-in-out mr-[8px]">
                                    Add to My Manga List
                                </span>
                            </label>

                        </div>

                        <input type="checkbox" id={`modal_${id}`} className="modal-toggle" />
                        <div className="modal" role="dialog">
                            <div className="modal-box bg-[#efecec]">
                                <h3 className="text-lg font-bold text-black">{manga.title}</h3>
                                
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
                                        If you haven't been able to add manga to your list yet, {" "}
                                        <Link to="/register" className="text-gray-800 hover:text-[#000000] hover:underline">
                                            sign up here.
                                        </Link>
                                    </p>
                                    <button type="submit" className="btn bg-gray-400 text-black hover:text-[#aeaeae] border-none w-full mt-2 hover:bg-gray-700">
                                        Add to your Manga List
                                    </button>
                                </form>
                                
                            </div>
                            <label className="modal-backdrop text-[50px]" htmlFor={`modal_${id}`}>Đóng</label>
                        </div>

                        <div className="manga-details flex flex-col justify-between" data-aos="fade-left">
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Published:</span> <span className="text-black text-[18px]">{published?.string}</span>
                            </p>
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Status:</span> <span className="text-black text-[18px]">{status}</span>
                            </p>
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Chapters:</span> <span className="text-black text-[18px]">{chapters || "Unknown"}</span>
                            </p>
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Volumes:</span> <span className="text-black text-[18px]">{volumes || "Unknown"}</span>
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
                                <span className="font-[700] text-[#454e56] text-[20px]">Authors:</span>
                                <span className="text-black text-[18px]">
                                    {authors && authors.map((item, index) => (
                                        <span key={index}>
                                            {item.name}
                                            {index < authors.length - 1 && ", "}
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
                            <p className="flex gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[20px]">Demographics:</span>
                                <span className="text-black text-[18px]">
                                    {demographics && demographics.map((item, index) => (
                                        <span key={index}>
                                            {item.name}
                                            {index < demographics.length - 1 && ", "}
                                        </span>
                                    ))}
                                </span>
                            </p>
                        </div>
                    </div>
                    <p className="description mt-[100px] text-[#6c7983] leading-[1.7] font-[500]" data-aos="fade-up">
                        {showMore ? synopsis : synopsis?.substring(0, 450) + '...'}
                        <button className="bg-transparent border-none outline-none cursor-pointer text-[20px] text-[#27AE60] font-[800]" onClick={() => {
                            setShowMore(!showMore);
                        }}>
                            {showMore ? 'Show less' : 'Show more'}
                        </button>
                    </p>
                </div>
                <h3 className="review-title inline-block my-[48px] mx-0 text-[32px] cursor-pointer bg-custom-gradient bg-clip-text text-transparent font-[700]" data-aos-delay="300" data-aos="fade-up">
                    Reviews
                </h3>
                <div className="review-container" data-aos="fade-up" data-aos-delay="500">
                    {reviews?.slice(0, 1).map((reviewed, index) => {
                        const { date, review, score } = reviewed;
                        const { username, images } = reviewed.user;
                        return (
                            <div
                                className="flex gap-[8px] mb-[16px] items-start justify-between review py-[8px] px-[10px] rounded-[7px] bg-[#EDEDED] transition-all duration-custom ease-custom hover:scale-105"
                                key={index}
                            >
                                <img src={images?.jpg.image_url} alt={username} className="h-[56px] w-auto" />
                                <h4 className="py-[8px] px-0 text-[#27AE60] text-[18px]">{username}</h4>
                                <p className="text-[#454e56] text-[14px] mt-[13px]">{new Date(date).toLocaleDateString()}</p>
                                <p className="text-[#454e56] font-[500] p-[8px]">{review}</p>
                                <p className="text-[#27AE60] font-[700] mt-[8px]">Score: {score}</p>
                            </div>
                        );
                    })}
                </div>

                <h3 className="characters-title inline-block my-[48px] mx-0 text-[32px] cursor-pointer bg-custom-gradient bg-clip-text text-transparent font-[700]" data-aos="fade-up" data-aos-delay="300">
                    Characters
                </h3>
                <div className="characters grid grid-cols-5 gap-[32px] bg-white p-[32px] rounded-[20px] border-[5px] border-[#e5e7eb]" data-aos="fade-up" data-aos-delay="500">
                    {characters?.map((character, index) => {
                        const {role} = character;
                        const {images, name, mal_id} = character.character;
                        return <Link to={`/character/${mal_id}`} state={{from: '/manga'}} key={index}>
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