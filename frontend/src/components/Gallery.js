import { Link, useParams, useLocation } from "react-router-dom";
import { useGlobalContext } from "../context/global";
import { useEffect, useState } from "react";

export const Gallery = () => {
    const {getAnimePictures, pictures} = useGlobalContext();
    const {id} = useParams();

    const [index, setIndex] = useState(0);

    const handleImageClick = (i) => {
        setIndex(i);
    }

    useEffect(() => {
        getAnimePictures(id);
    }, [id]);
    const location = useLocation();
    const fromPage = location.state?.from || "/";

    return(
        <>
            <div className="bg-[#ededed] min-h-screen flex flex-col items-center">
                <div className="back absolute top-[32px] left-[32px]">
                    <Link to={fromPage} className="font-[700] text-[#EB5757] text-[22px] flex items-center gap-[8px]">
                        <i className="fas fa-arrow-left"></i>
                        Back to {fromPage === "/manga" ? "Manga Home" : "Anime Home"}
                    </Link>
                </div>
                <div className="big-image inline-block p-[32px] my-[64px] mx-0 bg-[#fff] border-[5px] border-[#e5e7eb] rounded-[7px] relative">
                    <img src={pictures[index]?.jpg.image_url} alt="" className="w-[350px]"/>
                </div>
                <div className="small-images flex flex-wrap gap-[8px] w-[80%] p-[32px] bg-[#fff] border-[5px] border-[#e5e7eb] rounded-[7px]">
                    {pictures?.map((picture, idx) => {
                        return <div className="image-container" onClick={() => {
                            handleImageClick(idx);
                        }} key={idx}>
                            <img 
                                src={picture.jpg.image_url} 
                                alt="" 
                                className={"w-[96px] h-[96px] object-cover cursor-pointer rounded-[5px] transition-all duration-custom ease-custom border-[3px] "+(idx === index ? " border-[#101010] grayscale-0 scale-110" : "border-[#e5e7eb] grayscale-60 scale-100")}
                            />
                        </div>
                    })}
                </div>
            </div>
        </>
    )
}