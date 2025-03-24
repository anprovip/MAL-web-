import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../context/global';
import AOS from "aos";
import 'aos/dist/aos.css';

export const RecommendationsManga = () => {
    const { loading } = useGlobalContext();
    const location = useLocation();
    const fromPage = location.state?.from || "/";

    // State để lưu hai ID anime và dữ liệu so sánh
    const [animeId1, setAnimeId1] = useState('');
    const [animeId2, setAnimeId2] = useState('');
    const [comparisonData, setComparisonData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        AOS.init({ duration: 800 });
    }, []);

    // Hàm gọi API so sánh
    const fetchComparison = async () => {
        if (!animeId1 || !animeId2) {
            setError('Vui lòng nhập cả hai ID anime');
            return;
        }

        setError('');
        setComparisonData(null);

        try {
            const response = await fetch(`http://127.0.0.1:8000/animes/compare/${animeId1}/${animeId2}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể lấy dữ liệu so sánh');
            }

            const data = await response.json();
            setComparisonData(data);
        } catch (err) {
            setError(err.message);
            setComparisonData(null);
        }
    };

    // Xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchComparison();
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Tiêu đề */}
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center" data-aos="fade-down">
                    CompareAnime
                </h1>

                {/* Form nhập ID */}
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center mb-8" data-aos="fade-up">
                    <input
                        type="number"
                        value={animeId1}
                        onChange={(e) => setAnimeId1(e.target.value)}
                        placeholder="Nhập ID Anime 1 (VD: 1)"
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        value={animeId2}
                        onChange={(e) => setAnimeId2(e.target.value)}
                        placeholder="Nhập ID Anime 2 (VD: 20)"
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        So sánh
                    </button>
                </form>

                {/* Hiển thị lỗi nếu có */}
                {error && (
                    <p className="text-red-500 text-center mb-4" data-aos="fade-up">
                        {error}
                    </p>
                )}

                {/* Hiển thị loading */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    </div>
                )}

                {/* Hiển thị kết quả so sánh */}
                {comparisonData && !loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-aos="fade-up">
                        {/* Anime 1 */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={comparisonData.entry[0].images.jpg.large_image_url}
                                alt={comparisonData.entry[0].title}
                                className="w-full h-64 object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                                }}
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    {comparisonData.entry[0].title}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    MAL ID: {comparisonData.entry[0].mal_id}
                                </p>
                                <Link
                                    to={comparisonData.entry[0].url}
                                    target="_blank"
                                    className="text-blue-500 hover:underline mt-2 block"
                                >
                                    Xem trên MyAnimeList
                                </Link>
                            </div>
                        </div>

                        {/* Nội dung so sánh */}
                        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                So sánh giữa hai anime
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {comparisonData.content}
                            </p>
                        </div>

                        {/* Anime 2 */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={comparisonData.entry[1].images.jpg.large_image_url}
                                alt={comparisonData.entry[1].title}
                                className="w-full h-64 object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                                }}
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    {comparisonData.entry[1].title}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    MAL ID: {comparisonData.entry[1].mal_id}
                                </p>
                                <Link
                                    to={comparisonData.entry[1].url}
                                    target="_blank"
                                    className="text-blue-500 hover:underline mt-2 block"
                                >
                                    Xem trên MyAnimeList
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nút quay lại */}
                <div className="mt-8 text-center">
                    <Link
                        to={fromPage}
                        className="text-blue-500 hover:underline font-semibold"
                    >
                        Quay lại {fromPage === "/manga" ? "Manga Home" : "Anime Home"}
                    </Link>
                </div>
            </div>
        </div>
    );
};