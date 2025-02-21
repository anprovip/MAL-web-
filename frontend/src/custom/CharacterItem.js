import { Link } from "react-router-dom";
import { useCharacterInView } from "../custom/useCharacterInView";

export const CharacterItem = ({ character }) => {
  const { role } = character;
  const { images, name, mal_id } = character.character;
  const { ref, inView } = useCharacterInView(); // Hook được gọi ở cấp đầu của component

  return (
    <Link to={`/character/${mal_id}`} state={{ from: '/' }}>
      <div ref={ref} className="character py-[8px] px-[10px] rounded-[7px] bg-[#EDEDED] transition-all duration-custom ease-custom hover:scale-105">
        {inView ? (
          <>
            <img src={images?.jpg.image_url} alt={name} className="w-full" />
            <h4 className="py-[8px] px-0 text-[#454e56]">{name}</h4>
            <p className="text-[#27AE60]">{role}</p>
          </>
        ) : (
          <span className="loading loading-spinner w-[80px] ml-[64px] text-[#1E1E1E]"></span>
        )}
      </div>
    </Link>
  );
};
