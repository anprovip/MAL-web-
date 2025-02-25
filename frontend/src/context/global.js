import { createContext, useEffect, useContext, useReducer, useState } from 'react';
import Swal from 'sweetalert2';

const GlobalContext = createContext();

const baseUrl = "https://api.jikan.moe/v4";

const LOADING = "LOADING";
const SEARCH = "SEARCH";
const GET_POPULAR_ANIME = "GET_POPULAR_ANIME";
const GET_UPCOMING_ANIME = "GET_UPCOMING_ANIME";
const GET_TOP_ANIME = "GET_TOP_ANIME";
const GET_AIRING_ANIME = "GET_AIRING_ANIME";
const GET_PICTURES = "GET_PICTURES";
const GET_POPULAR_MANGA = "GET_POPULAR_MANGA";
const GET_UPCOMING_MANGA = "GET_UPCOMING_MANGA";
const GET_FAVOURITE_MANGA = "GET_FAVOURITE_MANGA";
const GET_TOP_MANGA = "GET_TOP_MANGA";
const GET_ANIME_RECOMMENDATIONS = "GET_ANIME_RECOMMENDATIONS";
const GET_MANGA_RECOMMENDATIONS = "GET_MANGA_RECOMMENDATIONS";

const reducer = (state, action) => {
    switch(action.type) {
        case LOADING:
            return {
                ...state,
                loading: true
            }
        case GET_POPULAR_ANIME:
            return {
                ...state,
                popularAnime: action.payload,
                loading: false
            }
        case SEARCH:
            return{
                ...state,
                searchResults: action.payload,
                loading: false
            }
        case GET_UPCOMING_ANIME:
            return {
                ...state,
                upcomingAnime: action.payload,
                loading: false
            }
        case GET_AIRING_ANIME:
            return {
                ...state,
                airingAnime: action.payload,
                loading: false
            }
        case GET_PICTURES:
            return {
                ...state,
                pictures: action.payload,
                loading: false
            }
        case GET_TOP_ANIME:
            return {
                ...state,
                topAnime: action.payload,
                loading: false
            }
        case GET_TOP_MANGA:
            return {
                ...state,
                topManga: action.payload,
                loading: false
            }
        case GET_FAVOURITE_MANGA:
            return {
                ...state,
                favouriteManga: action.payload,
                loading: false
            }
        case GET_POPULAR_MANGA:
            return {
                ...state,
                popularManga: action.payload,
                loading: false
            }
        case GET_UPCOMING_MANGA:
            return {
                ...state,
                upcomingManga: action.payload,
                loading: false
            }
        case GET_ANIME_RECOMMENDATIONS:
            return {
                ...state,
                animeRecommendations: action.payload,
                loading: false
            }
        case GET_MANGA_RECOMMENDATIONS:
            return {
                ...state,
                mangaRecommendations: action.payload,
                loading: false
            }
        default:
            return state;
    }
}

export const GlobalContextProvider = ({ children }) => {
    //initial state
    const initialState = {
        popularAnime: [],
        upcomingAnime: [],
        airingAnime: [],
        pictures: [],
        isSearch: false,
        isSearchManga: false,
        searchResults: [],
        loading: false,
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const [search, setSearch] = useState('');
    const [searchMangas, setSearchMangas] = useState('');

    const handleChange = (event) => {
        setSearch(event.target.value);
        if(event.target.value === ''){
            state.isSearch = false;
        }
    }

    const handleChangeManga = (event) => {
        setSearchMangas(event.target.value);
        if(event.target.value === ''){
            state.isSearchManga = false;
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(search){
            searchAnime(search);
            state.isSearch = true;
        }
        else{
            state.isSearch = false;
            Swal.fire("Please enter a search term!");
        }
    }

    const handleSubmitManga = (event) => {
        event.preventDefault();
        if(searchMangas){
            searchManga(searchMangas);
            state.isSearchManga = true;
        }
        else{
            state.isSearchManga = false;
            Swal.fire("Please enter a search term!");
        }
    }

    const getPopularAnime = async () => {
        dispatch({ type: LOADING });
        const response = await fetch(`${baseUrl}/top/anime?filter=bypopularity`);
        const data = await response.json();
        dispatch({ type: GET_POPULAR_ANIME, payload: data.data });
    }

    const getUpcomingAnime = async () => {
        dispatch({ type: LOADING });
        const response = await fetch(`${baseUrl}/top/anime?filter=upcoming`);
        const data = await response.json();
        dispatch({ type: GET_UPCOMING_ANIME, payload: data.data });
    }

    const getAiringAnime = async () => {
        dispatch({ type: LOADING });
        const response = await fetch(`${baseUrl}/top/anime?filter=airing`);
        const data = await response.json();
        dispatch({ type: GET_AIRING_ANIME, payload: data.data });
    }

    const getTopAnime = async () => {
        dispatch({ type: LOADING });
        const response = await fetch(`${baseUrl}/top/anime`);
        const data = await response.json();
        dispatch({ type: GET_TOP_ANIME, payload: data.data });
    }

    const getTopManga = async () => {
        dispatch({ type: LOADING });
        const response = await fetch(`https://api.jikan.moe/v4/top/manga`);
        const data = await response.json();
        dispatch({ type: GET_TOP_MANGA, payload: data.data });
    }

    const getFavouriteManga = async () => {
        dispatch({ type: LOADING });
        const response = await fetch(`https://api.jikan.moe/v4/top/manga?filter=favorite`);
        const data = await response.json();
        dispatch({ type: GET_FAVOURITE_MANGA, payload: data.data });
    }

    const getPopularManga = async () => {
        dispatch({ type: LOADING });
        const response = await fetch(`https://api.jikan.moe/v4/top/manga?filter=bypopularity`);
        const data = await response.json();
        dispatch({ type: GET_POPULAR_MANGA, payload: data.data });
    }

    const getUpcomingManga = async () => {
        dispatch({ type: LOADING });
        const response = await fetch(`https://api.jikan.moe/v4/top/manga?filter=upcoming`);
        const data = await response.json();
        dispatch({ type: GET_UPCOMING_MANGA, payload: data.data });
    }

    const searchAnime = async (anime) => {
        dispatch({ type: LOADING });
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${anime}&order_by=popularity&sort=asc&sfw`);
        const data = await response.json();
        dispatch({ type: SEARCH, payload: data.data });
    }

    const searchManga = async (manga) => {
        dispatch({ type: LOADING });
        const response = await fetch(`https://api.jikan.moe/v4/manga?q=${manga}&order_by=popularity&sort=asc&sfw`);
        const data = await response.json();
        dispatch({ type: SEARCH, payload: data.data });
    }

    const getAnimePictures = async (id) => {
        dispatch({ type: LOADING });
        const response = await fetch(`https://api.jikan.moe/v4/characters/${id}/pictures`);
        const data = await response.json();
        dispatch({ type: GET_PICTURES, payload: data.data });
    }

    const getAnimeRecommendations = async () => {
        dispatch({ type: LOADING });
        const response = await fetch(`https://api.jikan.moe/v4/recommendations/anime`);
        const data = await response.json();
        dispatch({ type: GET_ANIME_RECOMMENDATIONS, payload: data.data });
    }

    const getMangaRecommendations = async () => {
        dispatch({ type: LOADING });
        const response = await fetch(`https://api.jikan.moe/v4/recommendations/manga`);
        const data = await response.json();
        dispatch({ type: GET_MANGA_RECOMMENDATIONS, payload: data.data });
    }
    useEffect(() => {
        getPopularAnime();
    }, []);

    return(
        <GlobalContext.Provider value={{
            ...state,
            handleChange,
            handleSubmit,
            handleChangeManga,
            handleSubmitManga,
            searchAnime,
            searchManga,
            search,
            setSearch,
            searchMangas,
            setSearchMangas,
            getPopularAnime,
            getUpcomingAnime,
            getAiringAnime,
            getTopAnime,
            getTopManga,
            getFavouriteManga,
            getPopularManga,
            getUpcomingManga,
            getAnimePictures,
            getAnimeRecommendations,
            getMangaRecommendations
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}