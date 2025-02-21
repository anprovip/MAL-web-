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
