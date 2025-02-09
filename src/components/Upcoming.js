import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/global"
import { Sidebar } from "./Sidebar";

export const Upcoming = ({rendered}) => {
    const {upcomingAnime, isSearch, searchResults} = useGlobalContext();

    const navigate = useNavigate();

    const conditionalRender = () => {
        if(!isSearch && rendered === 'upcoming') {
            return upcomingAnime?.map((anime) => {
                return (
                    <div key={anime.mal_id} className="relative h-[500px] border-[5px] bg-[#e5e7eb] border-[#e5e7eb] pb-[64px] rounded-[7px] overflow-hidden">
                        <Link to={`/anime/${anime.mal_id}`}>
                            <img className="w-full h-full object-cover rounded-[5px]" src={anime.images.jpg.large_image_url} alt="" />
                            <div className="text-center font-[600] text-[18px] mt-[8px] mx-[4px] line-clamp-2">{anime.title}</div>
                        </Link>

                        <div
                            className="absolute inset-0 rounded-[5px] bg-black bg-opacity-80 flex flex-col items-start p-[12px] justify-start opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            onClick={() => navigate(`/anime/${anime.mal_id}`)} // Click vào overlay sẽ điều hướng
                        >
                            <div className="text-white">
                                <h3 className="text-[24px] font-[700]">{anime.title}</h3>
                                <p className="mt-[8px] mb-[32px]">
                                    {anime.score} <i className="text-[#F3DF4C] fa-solid fa-star"></i>
                                </p>
                                <p className="text-[16px] mt-[16px] line-clamp-6">{anime.synopsis}</p>

                                <label
                                    htmlFor={`modal_${anime.mal_id}`}
                                    className="btn p-0 absolute right-[20px] bottom-[15px] bg-transparent border-none shadow-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
                                    onClick={(e) => e.stopPropagation()} // Ngăn chặn điều hướng khi click nút
                                >
                                    <i class="fa-solid fa-plus text-white text-[28px] hover:text-[#98C56C]"></i>
                                </label>
                            </div>
                        </div>

                        <input type="checkbox" id={`modal_${anime.mal_id}`} className="modal-toggle" />
                        <div className="modal" role="dialog">
                            <div className="modal-box bg-[#efecec]">
                                <h3 className="text-lg font-bold">{anime.title}</h3>
                                
                                <form className="mt-[20px]">

                                    <div className="mb-[24px]">
                                        <label htmlFor="status" className="block text-sm font-medium text-black">Status</label>
                                        <select
                                            id="status"
                                            className="bg-transparent w-full mt-[10px] p-[6px] border border-gray-300 rounded"
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
                                            className="bg-transparent w-full mt-[10px] p-[6px] border border-gray-300 rounded flex flex-col items-center"
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
                            <label className="modal-backdrop text-[50px]" htmlFor={`modal_${anime.mal_id}`}>Đóng</label>
                        </div>
                    </div>
                );
            });
        }
        else{
            return searchResults?.map((anime) => {
                return (
                    <div key={anime.mal_id} className="relative h-[500px] border-[5px] bg-[#e5e7eb] border-[#e5e7eb] pb-[64px] rounded-[7px] overflow-hidden">
                        <Link to={`/anime/${anime.mal_id}`}>
                            <img className="w-full h-full object-cover rounded-[5px]" src={anime.images.jpg.large_image_url} alt="" />
                            <div className="text-center font-[600] text-[18px] mt-[8px] mx-[4px] line-clamp-2">{anime.title}</div>
                        </Link>

                        <div
                            className="absolute inset-0 rounded-[5px] bg-black bg-opacity-80 flex flex-col items-start p-[12px] justify-start opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            onClick={() => navigate(`/anime/${anime.mal_id}`)} // Click vào overlay sẽ điều hướng
                        >
                            <div className="text-white">
                                <h3 className="text-[24px] font-[700]">{anime.title}</h3>
                                <p className="mt-[8px] mb-[32px]">
                                    {anime.score} <i className="text-[#F3DF4C] fa-solid fa-star"></i>
                                </p>
                                <p className="text-[16px] mt-[16px] line-clamp-6">{anime.synopsis}</p>

                                <label
                                    htmlFor={`modal_${anime.mal_id}`}
                                    className="btn p-0 absolute right-[20px] bottom-[15px] bg-transparent border-none shadow-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
                                    onClick={(e) => e.stopPropagation()} // Ngăn chặn điều hướng khi click nút
                                >
                                    <i class="fa-solid fa-plus text-white text-[28px] hover:text-[#98C56C]"></i>
                                </label>
                            </div>
                        </div>

                        <input type="checkbox" id={`modal_${anime.mal_id}`} className="modal-toggle" />
                        <div className="modal" role="dialog">
                            <div className="modal-box bg-[#efecec]">
                                <h3 className="text-lg font-bold">{anime.title}</h3>
                                
                                <form className="mt-[20px]">

                                    <div className="mb-[24px]">
                                        <label htmlFor="status" className="block text-sm font-medium text-black">Status</label>
                                        <select
                                            id="status"
                                            className="bg-transparent w-full mt-[10px] p-[6px] border border-gray-300 rounded"
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
                                            className="bg-transparent w-full mt-[10px] p-[6px] border border-gray-300 rounded flex flex-col items-center"
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
                            <label className="modal-backdrop text-[50px]" htmlFor={`modal_${anime.mal_id}`}>Đóng</label>
                        </div>
                    </div>
                );
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
                <Sidebar />
            </div>
        </>
    )
}
