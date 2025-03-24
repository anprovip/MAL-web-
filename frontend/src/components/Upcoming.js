import { useGlobalContext } from "../context/global";
import { Sidebar } from "./Sidebar";
import { LazyLoadAnime } from "../custom/LazyLoadAnime";
import { LazyLoadSearchAnime } from "../custom/LazyLoadSearchAnime";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export const Upcoming = ({ rendered }) => {
    const { upcomingAnime, upcomingPage, upcomingTotal, isSearch, searchResults, loadMoreUpcomingAnime, loading } = useGlobalContext();

    const { ref, inView } = useInView({
        triggerOnce: false, // Kích hoạt nhiều lần để tải thêm
        threshold: 0.1, // Kích hoạt khi 10% sentinel vào viewport
    });

    // Tải thêm anime khi cuộn đến cuối
    useEffect(() => {
        if (inView && !loading) {
            const nextPage = upcomingPage + 1;
            loadMoreUpcomingAnime(nextPage, 4); // Tải thêm 4 anime
        }
    }, [inView, loading, upcomingPage, loadMoreUpcomingAnime]);

    const conditionalRender = () => {
        if (!isSearch && rendered === "upcoming") {
            return upcomingAnime?.map((anime) => <LazyLoadAnime key={anime.mal_id} anime={anime} />);
        } else {
            return searchResults?.map((anime) => <LazyLoadSearchAnime key={anime.mal_id} anime={anime} />);
        }
    };

    return (
        <>
            <div className="flex flex-col xl:flex-row">
                <div
                    className="popular-anime mt-[32px] pt-[32px] pb-[32px] px-[64px] sm:px-[32px] md:px-[48px] lg:pl-[80px] lg:pr-[32px] 
                    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-[16px] sm:gap-[24px] md:gap-[32px] w-full
                    bg-[#fff] border-t-[5px] border-[#e5e7eb]"
                >
                    {conditionalRender()}
                    {!isSearch && rendered === "upcoming" && upcomingAnime.length < upcomingTotal && (
                        <div ref={ref} className="col-span-full flex justify-center items-center h-16">
                            {loading && <span className="loading loading-spinner loading-xl scale-150"></span>}
                        </div>
                    )}
                </div>
                <Sidebar />
            </div>
        </>
    );
};