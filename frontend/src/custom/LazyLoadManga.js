import { Link, useNavigate } from "react-router-dom";
import { useCharacterInView } from "./useCharacterInView";

export const LazyLoadManga = ({ manga }) => {
    const { ref, inView } = useCharacterInView();
    const navigate = useNavigate();

    return (
        <div 
            ref={ref} 
            key={manga.mal_id} 
            className="relative h-[600px] sm:h-[450px] md:h-[480px] lg:h-[500px] border-[5px] bg-[#e5e7eb] border-[#e5e7eb] pb-[64px] rounded-[7px] overflow-hidden"
        >
            {inView ? (
                <>
                    <Link to={`/manga/${manga.mal_id}`}>
                        <img className="w-full h-full object-cover rounded-[5px]" src={manga.images.jpg.large_image_url} alt="" />
                        <div className="text-center font-[600] text-[20px] sm:text-[16px] md:text-[18px] mt-[8px] mx-[4px] line-clamp-2">
                            {manga.title}
                        </div>
                    </Link>

                    <div
                        className="absolute inset-0 rounded-[5px] bg-black bg-opacity-80 flex flex-col items-start p-[8px] sm:p-[10px] md:p-[12px] justify-start opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        onClick={() => navigate(`/manga/${manga.mal_id}`)}
                    >
                        <div className="text-white">
                            <h3 className="text-[28px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-[700]">{manga.title}</h3>
                            <p className="mt-[24px] mb-[64px] sm:mt-[8px] sm:mb-[24px] md:mb-[32px]">
                                {manga.score} <i className="text-[#F3DF4C] fa-solid fa-star"></i>
                            </p>
                            <p className="text-[20px] line-clamp-6 sm:text-[15px] md:text-[16px] mt-[10px] sm:mt-[12px] md:mt-[16px] sm:line-clamp-5 md:line-clamp-6">
                                {manga.synopsis}
                            </p>

                            <label
                                htmlFor={`modal_${manga.mal_id}`}
                                className="btn p-0 absolute right-[10px] sm:right-[15px] md:right-[20px] bottom-[10px] sm:bottom-[12px] md:bottom-[15px] bg-transparent border-none shadow-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <i className="fa-solid fa-plus text-white text-[32px] sm:text-[24px] md:text-[28px] hover:text-[#98C56C]"></i>
                            </label>
                        </div>
                    </div>

                    <input type="checkbox" id={`modal_${manga.mal_id}`} className="modal-toggle" />
                    <div className="modal" role="dialog">
                        <div className="modal-box bg-[#efecec] w-[90%] max-w-[500px]">
                            <h3 className="text-lg font-bold text-black">{manga.title}</h3>
                            
                            <form className="mt-[20px]">
                                <div className="mb-[24px]">
                                    <label htmlFor="status" className="block text-sm font-medium text-black">Status</label>
                                    <select
                                        id="status"
                                        className="bg-transparent w-full mt-[10px] p-[6px] border border-gray-300 rounded text-gray-800"
                                    >
                                        <option value="reading">Reading</option>
                                        <option value="completed">Completed</option>
                                        <option value="dropped">Dropped</option>
                                        <option value="onHold">On-Hold</option>
                                        <option value="planToRead">Plan to Read</option>
                                    </select>
                                </div>

                                <div className="mb-[24px]">
                                    <label htmlFor="score" className="block text-sm font-medium text-black">Your Score</label>
                                    <select
                                        id="score"
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
                        <label className="modal-backdrop" htmlFor={`modal_${manga.mal_id}`}>Close</label>
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center h-full">
                    <span className="loading loading-dots loading-lg"></span>
                </div>
            )}
        </div>
    );
};
