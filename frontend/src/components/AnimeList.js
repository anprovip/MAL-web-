import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from 'sweetalert2';


export const AnimeList = () => {
    const { username } = useParams(); // Lấy username từ URL
    console.log("ĐÃ LẤY ĐƯỢC USERNAME: ", username);
    const [animeList, setAnimeList] = useState([]); // State để lưu danh sách anime
    const [loading, setLoading] = useState(true); // State để xử lý trạng thái loading
    const [selectedAnime, setSelectedAnime] = useState(null); // State để lưu anime được chọn khi update
    const [newScore, setNewScore] = useState(""); // State để lưu điểm mới
    const [newStatus, setNewStatus] = useState(""); // State để lưu trạng thái mới

    // Hàm fetch thông tin chi tiết anime từ API
    const fetchAnimeDetails = async (malId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Không tìm thấy token, vui lòng đăng nhập lại!");
            return null;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/animes/${malId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin anime:", error.message);
            return null;
        }
    };

    // Hàm fetch danh sách anime ban đầu
    useEffect(() => {
        const getAnimeListWithDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Không tìm thấy token, vui lòng đăng nhập lại!");
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/rating/`, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                const animeDetailsPromises = data.map((anime) => fetchAnimeDetails(anime.anime_id));
                const animeDetails = await Promise.all(animeDetailsPromises);
                const updatedAnimeList = data.map((anime, index) => ({
                    ...anime,
                    title: animeDetails[index]?.title || "Unknown",
                    image: animeDetails[index]?.large_image_url || "../assets/anime.png",
                }));
                setAnimeList(updatedAnimeList);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu anime list:", error.message);
                setLoading(false);
            }
        };

        getAnimeListWithDetails();
    }, []);

    // Hàm xử lý xóa rating
    const handleRemove = async (malId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Không tìm thấy token, vui lòng đăng nhập lại!");
            return;
        }

        // Hiển thị Swal để xác nhận trước khi xóa
        Swal.fire({
            title: "Are you sure?",
            text: "You are going to remove this anime from your list!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, I'm going to delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/rating/delete`, {
                        method: "DELETE",
                        headers: {
                            "Accept": "*/*",
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ anime_id: malId }),
                    });

                    if (!response.ok) {
                        throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
                    }

                    // Xóa anime khỏi danh sách sau khi xóa thành công
                    setAnimeList(animeList.filter((anime) => anime.anime_id !== malId));
                    Swal.fire("Deleted!", "Anime has been removed from your list.", "success");
                    console.log(`Đã xóa anime với mal_id: ${malId}`);
                } catch (error) {
                    console.error("Lỗi khi xóa rating:", error.message);
                    Swal.fire("Error!", "Failed to remove the anime.", "error");
                }
            }
        });
    };

    // Hàm xử lý cập nhật rating
    const handleUpdate = async (malId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Không tìm thấy token, vui lòng đăng nhập lại!");
            return;
        }

        if (!newScore || !newStatus) {
            alert("Vui lòng nhập đầy đủ điểm và trạng thái!");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/rating/update/`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    anime_id: malId,
                    my_status: parseInt(newStatus),
                    my_score: parseInt(newScore),
                }),
            });

            if (!response.ok) {
                throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
            }

            // Cập nhật danh sách anime sau khi update thành công
            setAnimeList(
                animeList.map((anime) =>
                    anime.anime_id === malId
                        ? { ...anime, my_score: parseInt(newScore), my_status: parseInt(newStatus) }
                        : anime
                )
            );
            setSelectedAnime(null); // Đóng modal
            setNewScore(""); // Reset input
            setNewStatus(""); // Reset input

            Swal.fire({
                title: "Updated!",
                text: "Anime đã được cập nhật thành công.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });

            console.log(`Đã cập nhật anime với mal_id: ${malId}`);

        } catch (error) {
            console.error("Lỗi khi cập nhật rating:", error.message);
        }
    };

    // Mapping trạng thái từ số sang text
    const statusMap = {
        1: "Watching",
        2: "Completed",
        3: "On-Hold",
        4: "Dropped",
        5: "Plan to Watch",
    };

    if (loading) {
        return <span className="loading loading-bars absolute top-[50%] left-[50%] w-[64px]"></span>;
    }

    return (

        <div className="bg-[#ffffff] min-h-screen p-[24px]">
            <Link to="/" className="block bg-[#4F74C8] text-white text-center px-4 py-2 rounded-md hover:bg-[#294586] transition duration-300 mb-4 w-[7%]">
                    <i className="fa-solid fa-arrow-left mr-2"></i>
                    Back
            </Link>
            <div className="text-center text-[28px] text-black font-[700] mb-[64px]">
                {username}'s AnimeList
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th className="text-black font-[700] text-[18px]">Anime ID</th>
                            <th className="text-black font-[700] text-[18px]">Picture</th>
                            <th className="text-black font-[700] text-[18px]">Name</th>
                            <th className="text-black font-[700] text-[18px]">Created date</th>
                            <th className="text-black font-[700] text-[18px]">Your score</th>
                            <th className="text-black font-[700] text-[18px]">Status</th>
                            <th className="text-black font-[700] text-[18px]">Remove</th>
                            <th className="text-black font-[700] text-[18px]">Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {animeList.map((anime) => (
                            <tr key={anime.rating_id}>
                                <td className="text-[16px] text-gray-800 font-[500]">{anime.anime_id}</td>
                                <td>
                                    <Link to={`/anime/${anime.anime_id}`}>
                                        <img
                                            src={anime.image}
                                            alt={anime.title}
                                            className="w-[110px] h-[150px] object-cover"
                                        />
                                    </Link>
                                </td>
                                <td className="text-[16px] text-gray-800 font-[500]">{anime.title}</td>
                                <td className="text-[16px] text-gray-800 font-[500] pl-[30px]">
                                    {new Date(anime.created_at).toLocaleDateString()}
                                </td>
                                <td className="text-[16px] text-gray-800 font-[500] pl-[54px]">{anime.my_score}</td>
                                <td className="text-[16px] text-gray-800 font-[500]">
                                    {statusMap[anime.my_status] || "Unknown"}
                                </td>
                                <td className="text-[16px] text-gray-600 font-[500]">
                                    <i
                                        className="fa-solid fa-trash ml-[30px] hover:cursor-pointer hover:text-black"
                                        onClick={() => handleRemove(anime.anime_id)}
                                    ></i>
                                </td>
                                <td className="text-[18px] text-gray-600 font-[500]">
                                    <i
                                        className="fa-solid fa-pen-to-square ml-[30px] hover:cursor-pointer hover:text-black"
                                        onClick={() => setSelectedAnime(anime)}
                                    ></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal để update */}
            {selectedAnime && (
                <div className="modal modal-open fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-1000">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Update {selectedAnime.title}</h3>
                        <div className="py-4">
                            <label className="block mb-2">Score (0-10):</label>
                            <select
                                value={newScore}
                                onChange={(e) => setNewScore(e.target.value)}
                                className="select select-bordered w-full mb-4"
                            >
                                <option value="" disabled>Select score</option>
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
                            <label className="block mb-2">Status:</label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="select select-bordered w-full"
                            >
                                <option value="" disabled>Select status</option>
                                <option value="1">Watching</option>
                                <option value="2">Completed</option>
                                <option value="3">On-Hold</option>
                                <option value="4">Dropped</option>
                                <option value="5">Plan to Watch</option>
                            </select>
                        </div>
                        <div className="modal-action">
                            <button
                                className="btn btn-primary"
                                onClick={() => handleUpdate(selectedAnime.anime_id)}
                            >
                                Save
                            </button>
                            <button className="btn" onClick={() => setSelectedAnime(null)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};