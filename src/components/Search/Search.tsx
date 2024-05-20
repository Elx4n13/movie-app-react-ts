import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdSearch } from "react-icons/io";
import { fetchApi } from "../../api";
import { useNavigate } from "react-router-dom";
import "./search.scss";

const Search: React.FC<any> = ({hideNavHamb}) => {
    type ApiResult = {
        id: number;
        title?: string;
        name?: string;
        [key: string]: any;
        type?: string;
    };
    const img_base_url = "https://image.tmdb.org/t/p/original";
    const notImg = "https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png";
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState<string>(i18n.language); 
    const [search, setSearch] = useState<string>('');
    const [movies, setMovies] = useState<ApiResult[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeLang = async () => {
            await i18n.changeLanguage(lang);
            setLang(lang);
        };

        initializeLang();
    }, []);

    useEffect(() => {
        setLang(i18n.language);
    }, [i18n.language]);

    const fetchData = async () => {
        try {
            const movieData = await Promise.all(["movie", "tv"].map(async (type) => {
                const apiUrl = `https://api.themoviedb.org/3/search/${type}`;
                const params = { language: lang, query: search };
                let result = (await fetchApi(apiUrl, params)).results;

                if (result) {
                    result = result.map((item: ApiResult) => ({ ...item, typeMovie:type }));
                    return result;
                }

                return [];
            }));
            const flattenedMovieData = [].concat(...movieData);
            console.log(flattenedMovieData)

            setMovies(flattenedMovieData);
        } catch (error) {
            console.log(error)
        }

    };

    useEffect(() => {
            console.log(`Searching`)
            fetchData();
    }, [search]);

    const handleItemClick = (id: number, type: string | undefined) => {
        hideNavHamb()
        setSearch('')
        navigate(`/movie/${id}?type=${type}`);
    };

    return (
        <div className="searchContainer">
            <input value={search} onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
            }} type="text" />
            <IoMdSearch className="searchIcon" />
            {movies.length ? (
                <ul>
                    {movies.map((movie, index) => (
                        <li key={index} onClick={() => handleItemClick(movie.id, movie.typeMovie)}>
                            <span> <img src={movie.poster_path ? img_base_url + movie.poster_path : notImg} alt="Poster img" /> </span>
                          <span>  {movie.title || movie.name} ({movie.typeMovie})</span>
                        </li>
                    ))}
                </ul>
            ):""}
        </div>
    );
};

export default Search;
