import { useGlobalContext } from "../context/global"
import { MangaSidebar } from "./MangaSidebar";
import { LazyLoadManga } from "../custom/LazyLoadManga";

export const PopularManga = ({rendered}) => {
    const {popularManga, isSearchManga, searchResults} = useGlobalContext();
    console.log(popularManga);


    const conditionalRender = () => {
        if(!isSearchManga && rendered === 'popular') {
            return popularManga?.map((manga) => <LazyLoadManga key={manga.mal_id} manga={manga} />);
        } else {
            return searchResults?.map((manga) => <LazyLoadManga key={manga.mal_id} manga={manga} />);
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
                <MangaSidebar />
            </div>
        </>
    )
}
