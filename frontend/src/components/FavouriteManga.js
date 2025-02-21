import { LazyLoadManga } from "../custom/LazyLoadManga";
import { useGlobalContext } from "../context/global"
import { MangaSidebar } from "./MangaSidebar";

export const FavouriteManga = ({rendered}) => {
    const {favouriteManga, isSearchManga, searchResults} = useGlobalContext();

    const conditionalRender = () => {
        if(!isSearchManga && rendered === 'favourite') {
            return favouriteManga?.map((manga) => <LazyLoadManga key={manga.mal_id} manga={manga} />);
        } else {
            return searchResults?.map((manga) => <LazyLoadManga key={manga.mal_id} manga={manga} />);
        }
    }
    return(
        <>
            <div className="flex">
                <div className="popular-anime mt-[32px] pt-[32px] pb-[32px] pl-[80px] pr-[32px] grid grid-cols-4 gap-[32px] w-full
                bg-[#fff] border-t-[5px] border-[#e5e7eb]">
                    {conditionalRender()}
                </div>
                <MangaSidebar />
            </div>
        </>
    )
}
