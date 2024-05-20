import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../../api';
import { Spinner } from '../spinner/spinner';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { Movie, SlidersProps } from './dto/MovieList.dto';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores';
import { addFavoritesHandle, addWatchListHandle, deleteFavoritesHandle, deleteWatchListHandle } from '../../utils';
import {
    CheckCircleTwoTone,
    HeartOutlined,
    HeartTwoTone,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const MovieList: React.FC<SlidersProps> = ({type, title, queryKey, url, params }) => {
    const { favorites } = useSelector((state: RootState) => state.favorites);
    const watchList = useSelector((state: RootState) => state.watchList.watchList);
    const img_base_url = "https://image.tmdb.org/t/p/original"
    const notImg = "https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png";
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [queryKey],
        queryFn: () => fetchApi(url, params),
        select: (data) => data,
    });

    const [movies, setMovies] = useState<Movie[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [percentage, setPercentage] = useState(25); 
    useEffect(() => {
      function handleResize() {
        const newPercentage = window.innerWidth <= 992 ? window.innerWidth <= 600?window.innerWidth <= 400?110:55:34:25;
        setPercentage(newPercentage);
      }
  
      window.addEventListener('resize', handleResize);
  
      handleResize();
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
    useEffect(() => {
        if (data) {
            setMovies(data.results);
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, [params, refetch]);

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

    if (isLoading) return <Spinner />;
    if (isError) return <div>Error fetching data</div>;

    const startIndex = Math.max(0, currentSlide - 1);
    const endIndex = Math.min(movies.length - 1, currentSlide + 1);
    const handleItemClick = (id: number, type: string | undefined) => {
        navigate(`/movie/${id}?type=${type}`);
    };
    return (
        <div className="slider-container">
            <div className="top">
                <p>{title}</p>
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
                        transform: `translateX(-${currentSlide * percentage}%)`,
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
                                    handleItemClick(movie.id,type)
                                }}
                            />
                            <div className="bottom">
                                <p className="bottomLeft" onClick={()=>{
                                    handleItemClick(movie.id,type)
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
                                                    type:type
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
                                                    type:type
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

export default MovieList;
