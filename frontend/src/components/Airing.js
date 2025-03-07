import { useGlobalContext } from "../context/global"
import { Sidebar } from "./Sidebar";
import { LazyLoadAnime } from "../custom/LazyLoadAnime";

export const Airing = ({rendered}) => {
    const {airingAnime, isSearch, searchResults} = useGlobalContext();

    const conditionalRender = () => {
        if(!isSearch && rendered === 'airing') {
            return airingAnime?.map((anime) => <LazyLoadAnime key={anime.mal_id} anime={anime} />);
        } else {
            return searchResults?.map((anime) => <LazyLoadAnime key={anime.mal_id} anime={anime} />);
        }
    }
    return(
        <>
            <div className="flex flex-col xl:flex-row">
                <div className="popular-anime mt-[32px] pt-[32px] pb-[32px] px-[64px] sm:px-[32px] md:px-[48px] lg:pl-[80px] lg:pr-[32px] 
                grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-[16px] sm:gap-[24px] md:gap-[32px] w-full
                bg-[#fff] border-t-[5px] border-[#e5e7eb]">
                    {conditionalRender()}
                </div>
                <Sidebar />
            </div>
        </>
    )
}
