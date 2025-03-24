import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../context/global';
import AOS from "aos";
import 'aos/dist/aos.css';

export const RecommendationsAnime = () => {
    const { animeRecommendations, getAnimeRecommendations, loading } = useGlobalContext();
    const location = useLocation();
    const fromPage = location.state?.from || "/";

    useEffect(() => {
        getAnimeRecommendations();
        AOS.init({ duration: 800 });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center" data-aos="fade-down">
                    Anime Đề Xuất
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    </div>
                ) : !animeRecommendations ? (  // Thêm kiểm tra này
                    <p className="text-center text-gray-500 text-lg">Đang khởi tạo dữ liệu...</p>
                ) : animeRecommendations.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">Không tìm thấy anime nào để đề xuất</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {animeRecommendations.map((anime, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <img
                                    src={anime.large_image_url || anime.small_image_url}
                                    alt={anime.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                                    }}
                                />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                                        {anime.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                        {anime.synopsis}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            {anime.type}
                                        </span>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                            {anime.episodes} tập
                                        </span>
                                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                            {anime.season} {anime.year}
                                        </span>
                                    </div>
                                    <Link
                                        to={`/`}
                                        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};