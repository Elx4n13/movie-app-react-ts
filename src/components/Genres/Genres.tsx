import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../../api';
import { Spinner } from '../spinner/spinner';
import { GenresObj, SlidersProps } from './dto/Sliders.dto';
import genresImg from '../../assets/genres.png';
import './genres.scss';
import { FaArrowRight,FaArrowLeft, FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Genres: React.FC<SlidersProps> = ({type,title, queryKey, url, params }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchApi(url, params),
    select: (data) => data,
  });
  const [genres, setGenres] = useState<GenresObj[]>([]);
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
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
      setGenres(data.genres);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [params, refetch]);

  const nextSlide = () => {
    if (currentSlide < genres.length - 1) {
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
  const endIndex = Math.min(genres.length - 1, currentSlide + 1);
  const handleItemClick = (id: number) => {
    navigate(`/discover/${id}?type=${type}&page=1`);
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
            {genres.slice(startIndex, endIndex + 1).map((_, index) => (
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
            disabled={currentSlide === genres.length - 1}
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
          {genres.map((genre) => (
            <div className="card" key={genre.id}>
              <img src={genresImg} alt={genre.name}  onClick={()=>{
                                    handleItemClick(genre.id);
                                }}/>
              <div className="bottom">
                <p className="bottomLeft">{genre.name}</p>
                <div className="bottomright">
                <FaArrowRightLong />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Genres;
