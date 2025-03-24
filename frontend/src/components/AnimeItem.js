import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { CharacterItem } from "../custom/CharacterItem";
import Swal from "sweetalert2";

export const AnimeItem = () => {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);
    const [animePrevent, setAnimePrevent] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [status, setStatus] = useState(""); // State để lưu giá trị status
    const [score, setScore] = useState(""); // State để lưu giá trị score

    const { title, episodes, synopsis, duration, aired_from, aired_to, season, large_image_url, mal_stats, status: animeStatus, rating, genres, producers } = anime || {};
    const { trailer } = animePrevent || {};

    // Get anime by id
    const getAnime = async (animeId) => {
        const response = await fetch(`http://127.0.0.1:8000/animes/${animeId}`);
        const data = await response.json();
        setAnime(data);
    };

    const getAnimePrevent = async (animeId) => {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        const data = await response.json();
        setAnimePrevent(data.data);
    };

    // Get characters
    const getCharacters = async (animeId) => {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
        const data = await response.json();
        setCharacters(data.data);
        console.log(data.data);
    };

    // Format aired date
    function formatAiredDate(start, end) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        const startDate = new Date(start).toLocaleString("en-US", options);
        const endDate = new Date(end).toLocaleString("en-US", options);
        return `${startDate} to ${endDate}`;
    }

    // Hàm xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire("Error!", "Please log in to add anime to your list!", "error");
            return;
        }

        if (!status || !score || score === "0") {
            Swal.fire("Error!", "Please select both status and score!", "error");
            return;
        }

        const statusMap = {
            watching: 1,
            completed: 2,
            onHold: 3,
            dropped: 4,
            planToWatch: 5,
        };

        const ratingData = {
            anime_id: parseInt(id),
            my_status: statusMap[status],
            my_score: parseInt(score),
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/rating/", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ratingData),
            });

            if (!response.ok) {
                throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
            }

            Swal.fire("Success!", `${title} has been added to your list!`, "success");
            setStatus(""); // Reset status
            setScore(""); // Reset score
            document.getElementById(`modal_${id}`).checked = false; // Đóng modal
        } catch (error) {
            console.error("Lỗi khi thêm anime vào danh sách:", error.message);
            Swal.fire("Error!", "Failed to add anime to your list.", "error");
        }
    };

    useEffect(() => {
        getAnime(id);
        getAnimePrevent(id);
        getCharacters(id);
        AOS.init({ duration: 800 });
        window.scrollTo(0, 0);
    }, [id]);

    const isLoading = !anime || !animePrevent;

    // Nếu chưa tải xong dữ liệu chính, hiển thị loading bar
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-bars absolute top-[50%] left-[50%] w-[64px]"></span>
            </div>
        );
    }

    return (
        <>
            <div className="py-[24px] px-[16px] sm:py-[32px] sm:px-[24px] md:py-[36px] md:px-[48px] lg:py-[42px] lg:px-[128px] xl:py-[48px] xl:px-[192px] 2xl:py-[48px] 2xl:px-[288px] bg-[#EDEDED]">
                <Link to="/" className="block bg-[#4F74C8] text-white text-center px-4 py-2 rounded-md hover:bg-[#294586] transition duration-300 mb-4 w-[10%]">
                    <i className="fa-solid fa-arrow-left mr-2"></i>
                    Back
                </Link>
                <h1 className="inline-block text-[28px] sm:text-[32px] md:text-[36px] lg:text-[42px] xl:text-[48px] mb-[16px] sm:mb-[20px] md:mb-[24px] cursor-pointer bg-custom-gradient font-[900] bg-clip-text text-transparent transition-all duration-custom ease-custom transform hover:text-gray-900">
                    {title}
                </h1>


                <div className="details bg-[#ffffff] rounded-[20px] p-[16px] sm:p-[24px] md:p-[28px] lg:p-[32px] border-[3px] sm:border-[4px] md:border-[5px] border-[#e5e7eb]">
                    <div className="detail grid grid-cols-1 md:grid-cols-2 gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[32px]">
                        <div className="image relative" data-aos="fade-down">
                            <div className="w-full md:max-w-full lg:max-w-[90%] xl:max-w-[80%] 2xl:max-w-[70%] mx-auto">
                                <img src={large_image_url} alt="" className="rounded-[7px] w-full" />
                            </div>
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
                                <label
                                    htmlFor={`modal_${anime.mal_id}`}
                                    className="absolute top-[0px] right-[16px] text-black text-[32px] cursor-pointer hover:text-gray-700"
                                >
                                    &times;
                                </label>
                                <h3 className="text-lg font-bold text-black">{title}</h3>
                                <form className="mt-[20px]" onSubmit={handleSubmit}>
                                    <div className="mb-[24px]">
                                        <label htmlFor="status" className="block text-sm font-medium text-black">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="bg-transparent w-full mt-[10px] p-[6px] border border-gray-300 rounded text-gray-800"
                                        >
                                            <option value="" disabled>
                                                Select status
                                            </option>
                                            <option value="watching">Watching</option>
                                            <option value="completed">Completed</option>
                                            <option value="dropped">Dropped</option>
                                            <option value="onHold">On-Hold</option>
                                            <option value="planToWatch">Plan to Watch</option>
                                        </select>
                                    </div>

                                    <div className="mb-[24px]">
                                        <label htmlFor="score" className="block text-sm font-medium text-black">
                                            Your Score
                                        </label>
                                        <select
                                            id="score"
                                            value={score}
                                            onChange={(e) => setScore(e.target.value)}
                                            className="bg-transparent w-full mt-[10px] p-[6px] border border-gray-300 rounded text-gray-800"
                                        >
                                            <option value="0">Select score</option>
                                            <option value="1">(1) Appalling</option>
                                            <option value="2">(2) Horrible</option>
                                            <option value="3">(3) Very Bad</option>
                                            <option value="4">(4) Bad</option>
                                            <option value="5">(5) Average</option>
                                            <option value="6">(6) Fine</option>
                                            <option value="7">(7) Good</option>
                                            <option value="8">(8) Very Good</option>
                                            <option value="9">(9) Great</option>
                                            <option value="10">(10) Masterpiece</option>
                                        </select>
                                    </div>
                                    <p className="text-center text-sm mt-[32px] mb-[24px] text-gray-700">
                                        If you haven't been able to add anime to your list yet,{" "}
                                        <Link
                                            to="/register"
                                            className="text-gray-800 hover:text-[#000000] hover:underline"
                                        >
                                            sign up here.
                                        </Link>
                                    </p>
                                    <button
                                        type="submit"
                                        className="btn bg-gray-400 text-black hover:text-[#aeaeae] border-none w-full mt-2 hover:bg-gray-700"
                                    >
                                        Add to your Anime List
                                    </button>
                                </form>
                            </div>
                            <label className="modal-backdrop" htmlFor={`modal_${id}`}></label>
                        </div>

                        <div className="anime-details flex flex-col justify-between gap-2 md:gap-1" data-aos="fade-left">
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] mt-[0px] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">
                                    Aired:
                                </span>
                                <span className="text-black text-[14px] mb-[1px] sm:text-[16px] md:text-[18px]">
                                    {formatAiredDate(aired_from, aired_to)}
                                </span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">
                                    Rating:
                                </span>
                                <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">{rating}</span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">
                                    Rank:
                                </span>
                                <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">{mal_stats.rank}</span>
                            </p>
                            <p className="flex gap-[4px] sm:gap-[6px] md:gap-[8px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">
                                    Score:
                                </span>
                                <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">
                                    {mal_stats.score.toFixed(2) || "No score yet"}
                                </span>
                                <i className="text-[#F3DF4C] mb-[2px] fa-solid fa-star"></i>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center flex-wrap">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">
                                    Scored By:
                                </span>
                                <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">
                                    {mal_stats.scored_by?.toLocaleString() || "No users scored yet"} users
                                </span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">
                                    Popularity:
                                </span>
                                <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">
                                    {mal_stats.popularity}
                                </span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">
                                    Status:
                                </span>
                                <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">
                                    {animeStatus}
                                </span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">
                                    Episodes:
                                </span>
                                <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">
                                    {episodes}
                                </span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">
                                    Season:
                                </span>
                                <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">
                                    {season}
                                </span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">
                                    Duration:
                                </span>
                                <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">
                                    {duration}
                                </span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-start flex-wrap">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">
                                    Producers:
                                </span>
                                <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">
                                    {producers &&
                                        producers.map((item, index) => (
                                            <span key={index}>
                                                {item.name}
                                                {index < producers.length - 1 && ", "}
                                            </span>
                                        ))}
                                </span>
                            </p>
                            <p className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-start flex-wrap">
                                <span className="font-[700] text-[#454e56] text-[16px] sm:text-[18px] md:text-[20px]">
                                    Genres:
                                </span>
                                <span className="text-black text-[14px] sm:text-[16px] md:text-[18px]">
                                    {genres &&
                                        genres.map((item, index) => (
                                            <span key={index}>
                                                {item.name}
                                                {index < genres.length - 1 && ", "}
                                            </span>
                                        ))}
                                </span>
                            </p>
                        </div>
                    </div>
                    <p
                        className="description mt-[40px] sm:mt-[60px] md:mt-[80px] lg:mt-[100px] text-[#6c7983] leading-[1.7] font-[500]"
                        data-aos="fade-up"
                    >
                        {showMore ? synopsis : synopsis?.substring(0, 450) + "..."}
                        <button
                            className="bg-transparent border-none outline-none cursor-pointer text-[16px] sm:text-[18px] md:text-[20px] text-[#27AE60] font-[800]"
                            onClick={() => setShowMore(!showMore)}
                        >
                            {showMore ? "Show less" : "Show more"}
                        </button>
                    </p>
                </div>
                <h3
                    className="trailer-title inline-block my-[24px] sm:my-[36px] md:my-[48px] mx-0 text-[24px] sm:text-[28px] md:text-[32px] cursor-pointer bg-custom-gradient bg-clip-text text-transparent font-[700]"
                    data-aos-delay="300"
                    data-aos="fade-up"
                >
                    Trailer
                </h3>
                <div className="trailer-container flex justify-center items-center" data-aos="fade-up" data-aos-delay="500">
                    {trailer?.embed_url && (
                        <iframe
                            src={trailer?.embed_url}
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full sm:w-[80%] md:w-[700px] lg:w-[800px] h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] outline-none border-[3px] sm:border-[4px] md:border-[5px] border-[#e5e7eb] rounded-[10px] bg-[#ffffff] p-[12px] sm:p-[16px] md:p-[20px] lg:p-[24px]"
                        ></iframe>
                    )}
                </div>
                <h3
                    className="characters-title inline-block my-[24px] sm:my-[36px] md:my-[48px] mx-0 text-[24px] sm:text-[28px] md:text-[32px] cursor-pointer bg-custom-gradient bg-clip-text text-transparent font-[700]"
                    data-aos="fade-up"
                    data-aos-delay="300"
                >
                    Characters
                </h3>
                <div
                    className="characters grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[32px] bg-white p-[16px] sm:p-[24px] md:p-[28px] lg:p-[32px] rounded-[20px] border-[3px] sm:border-[4px] md:border-[5px] border-[#e5e7eb]"
                    data-aos="fade-up"
                    data-aos-delay="500"
                >
                    {characters?.map((character, index) => (
                        <CharacterItem key={index} character={character} />
                    ))}
                </div>
            </div>
        </>
    );
};