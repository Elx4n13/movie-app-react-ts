import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Genres from "../../components/Genres/Genres";
import "./home.scss";
import MovieList from "../../components/MovieList/MovieList";
import VideoHeader from "../../components/VideoHeader/VideoHeader";
import video from "../../assets/video.mp4"
export const Home = () => {
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
  return (
    <div className="homeContainer">
      <VideoHeader poster="https://image.tmdb.org/t/p/original/obYjrjFT4iZV09YAXu53iBA51Js.jpg" src={video}/>
      <div className="movies">
        <p className="content-title">{t("movies")}</p>
        <Genres
        type="movie"
          queryKey="OurGenres"
          title={t("ourGenres")}
          url="https://api.themoviedb.org/3/genre/movie/list"
          params={{ language: lang }}
        />
        <MovieList type="movie" title={t("topRated")}  queryKey="TopRated" url='https://api.themoviedb.org/3/movie/top_rated' params={{ language: lang, page: '1' }} />
        <MovieList type="movie" title={t("popular")} queryKey="Popular" url='https://api.themoviedb.org/3/movie/popular' params={{ language: lang, page: '1' }} />

      </div>
      <div className="shows">
        <p className="content-title">{t("shows")}</p>

        <Genres
        type="tv"
        title={t("ourGenresShows")}
          queryKey="OurGenresShows"
          url="https://api.themoviedb.org/3/genre/tv/list"
          params={{ language: lang }}
        />
        {t("topRatedShows")}
        <MovieList type="tv" title={t("topRatedShows")} queryKey="TopRatedShows" url='https://api.themoviedb.org/3/tv/top_rated' params={{ language: lang, page: '1' }} />
        <MovieList type="tv" title={t("popularShows")} queryKey="PopularShows" url='https://api.themoviedb.org/3/tv/popular' params={{ language: lang, page: '1' }} />

      </div>
      <div className="trail">
        <div className="left">
          <p className="left-top">{t("startTrial")} </p>
          <p className="left-bottom">{t("cta")} </p>
        </div>
        <div className="right">
          <button> {t("startButton")}</button>
        </div>
      </div>
    </div>
  );
};
