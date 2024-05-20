import React, { useEffect, useState, useRef } from 'react';
import { fetchApi } from '../../api';
import { Spinner } from '../../components/spinner/spinner';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { RootState } from '../../stores';
import { addFavoritesHandle, addWatchListHandle, deleteFavoritesHandle, deleteWatchListHandle } from '../../utils';
import { CheckCircleTwoTone, HeartOutlined, HeartTwoTone, PlusCircleOutlined } from "@ant-design/icons";
import { WatchlistMovie } from './dto/WatchList.dto';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const WatchList: React.FC = () => {
    const { favorites } = useSelector((state: RootState) => state.favorites);
    const watchList = useSelector((state: RootState) => state.watchList.watchList);
    const img_base_url = "https://image.tmdb.org/t/p/original"
    const notImg = "https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png";
    const [movies, setMovies] = useState<WatchlistMovie[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const { t, i18n } = useTranslation();
  const [lang, setLang] = useState<string>(i18n.language); 

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
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const movieData = await Promise.all(watchList.map(async (favorite) => {
                    const apiUrl = `https://api.themoviedb.org/3/${favorite.type}/${favorite.id}`;
                    const params = { language: lang};
                    let result = await fetchApi(apiUrl, params);
                    const favoriteMovieData = {
                        typeMovie: favorite.type,
                        ...result 
                    };
                
                    return favoriteMovieData;
                }));
                console.log(movieData)
                setMovies(movieData);
            } catch (error) {
                setError('Error fetching data');
            }

            setIsLoading(false);
        };

        fetchData();
    }, [watchList,lang]);

    const nextSlide = () => {
        if (currentSlide < movies.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const startIndex = Math.max(0, currentSlide - 1);
    const endIndex = Math.min(movies.length - 1, currentSlide + 1);

    if (isLoading) return <Spinner />;
    if (error) return <div>{error}</div>;
    const handleItemClick = (id: number, type: string | undefined) => {
        navigate(`/movie/${id}?type=${type}`);
    };
    return (
        <div className="slider-container">
            <div className="top">
                <p>{t("watchList")}</p>
                <div className="buttons">
                    <button className="prevbutton" onClick={prevSlide} disabled={currentSlide === 0}>
                        <FaArrowLeft />
                    </button>
                    <div className="dots">
                        {movies.slice(startIndex, endIndex + 1).map((_, index) => (
                            <span
                                key={startIndex + index}
                                className={`dot ${startIndex + index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(startIndex + index)}
                            ></span>
                        ))}
                    </div>
                    <button
                        className="nextbutton"
                        onClick={nextSlide}
                        disabled={currentSlide === movies.length - 1}
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>
            <div className="main" ref={sliderRef}>
                <div
                    className="slider"
                    style={{
                        transform: `translateX(-${currentSlide * 25}%)`,
                    }}
                >
                    {movies?.map((movie) => (
                        <div className="card" key={movie.id}>
                            <img
                                src={
                                    movie.poster_path ? img_base_url + movie.poster_path : notImg
                                }
                                alt="poster img"
                                onClick={()=>{
                                    handleItemClick(movie.id,movie.typeMovie)
                                }}
                            />
                            <div className="bottom">
                                <p className="bottomLeft" onClick={()=>{
                                    handleItemClick(movie.id,movie.typeMovie)
                                }}>{movie.title || movie.name}</p>
                                <div className="bottomright">
                                    {watchList.find((item) => movie.id === item.id) ? (
                                        <p
                                            className='watched'
                                            onClick={() => {
                                                deleteWatchListHandle(movie.id);
                                            }}
                                        >
                                            <CheckCircleTwoTone />
                                        </p>
                                    ) : (
                                        <p
                                            className='watched'
                                            onClick={() => {
                                              let obj = {
                                                  id: movie.id,
                                                  type:movie.typeMovie
                                              }
                                                addWatchListHandle(obj);
                                            }}
                                        >
                                            <PlusCircleOutlined />
                                        </p>
                                    )}
                                    {favorites.find((item) => movie.id === item.id) ? (
                                        <p
                                            className='heart'
                                            onClick={() => {
                                                deleteFavoritesHandle(movie.id);
                                            }}
                                        >
                                            <HeartTwoTone />
                                        </p>
                                    ) : (
                                        <p
                                            className='heart'
                                            onClick={() => {
                                                let obj = {
                                                    id: movie.id,
                                                    type:movie.typeMovie
                                                }
                                                addFavoritesHandle(obj);
                                            }}
                                        >
                                            <HeartOutlined />
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WatchList;
