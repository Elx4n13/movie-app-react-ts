import  { useEffect, useState } from "react";
import styles from "./DetailsContainer.module.scss";
import "./Ant.css";
import "./ANTDetail.css";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { CheckCircleTwoTone, HeartOutlined, HeartTwoTone, PlusCircleOutlined, StarOutlined } from "@ant-design/icons";
import { Spinner } from "../../components/spinner";
import { fetchApi } from "../../api";
import { addWatchListHandle, deleteWatchListHandle, deleteFavoritesHandle, addFavoritesHandle } from "../../utils";
import { RootState } from "../../stores";

const DetailsContainer = () => {
    const img_base_url = "https://image.tmdb.org/t/p/original";
    const notImg = "https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png";
    const { id } = useParams();
    const [movie, setMovie] = useState<any>({});
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState(i18n.language);
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['MovieDetails'],
        queryFn: () => fetchApi(`https://api.themoviedb.org/3/${type}/${id}`, { language: lang }),
        enabled: !!id && !!type 
    });

    useEffect(() => {
        const initializeLang = async () => {
            await i18n.changeLanguage(lang);
            setLang(lang);
        };
        initializeLang();
    }, [i18n, lang]);

    useEffect(() => {
        setLang(i18n.language);
    }, [i18n.language]);

    useEffect(() => {
        if (data) {
            setMovie(data);
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, [id, type, lang, refetch]);

    const { watchList } = useSelector((state: RootState) => state.watchList);
    const { favorites } = useSelector((state: RootState) => state.favorites);

    if (isLoading) return <Spinner />;
    if (isError) return <div>Error fetching data</div>;

    return (
        <div className={styles.detailsContainer}>
            <div className={styles.main}>
                <div
                    className={styles.backdrop}
                    style={{
                        backgroundImage: `linear-gradient(180deg, rgba(54, 44, 146, 0.4) 0%, rgba(18, 98, 151, 0.4) 100%),url(${movie?.backdrop_path ? img_base_url + movie.backdrop_path : notImg})`,
                    }}
                >
                    <div className={styles.titleContent}>
                        <div className={styles.titles}>
                            <div className={styles.top}>
                                <p>TMDB</p>
                            </div>
                            <div className={styles.bottom}>
                                <p>{movie.title}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.movieContent}>
                    <div className={styles.detailContent}>
                        <div className={styles.left}>
                            <img src={movie.poster_path ? img_base_url + movie.poster_path : notImg} alt="Poster img" />
                        </div>
                        <div className={styles.right}>
                            <div className={styles.tagline}>
                                <p>{movie.tagline ? movie.tagline : "Özet"}</p>
                            </div>
                            <div className={styles.info}>
                                <p>{movie.overview ? movie.overview : `Türkçeye çevrilmiş bir özet henüz bulunmuyor. Film için bir tane ekleyerek katkıda bulunabilirsiniz.`}</p>
                            </div>
                            <div className={styles.rating}>
                                <p><StarOutlined /> {movie.vote_average}</p>
                            </div>
                            <div className={styles.type}>
                                <p className={styles.typeTitle}>{t("type")}</p>
                                <p className={styles.typeName}>{t("movie")}</p>
                            </div>
                            <div className={styles.release}>
                                <p className={styles.top}>{t("release")}</p>
                                <p className={styles.bottom}>{movie.release_date ? movie.release_date : `${t("unkown")}`}</p>
                            </div>
                            <div className={styles.runTime}>
                                <p className={styles.top}>{t("runTime")}</p>
                                <p className={styles.bottom}>{movie.runtime}</p>
                            </div>
                            <div className={styles.genres}>
                                <p className={styles.top}>{t("genres")}</p>
                                <p className={styles.bottom}>
                                    {movie.genres?.length ? movie.genres.map((element: any, index: any) => (
                                        <span key={index}> {element.name} </span>
                                    )) : "-"}
                                </p>
                            </div>
                            <div className={styles.footer}>
                                {watchList.find((item) => movie.id === item.id) ? (
                                    <p className={styles.watched} onClick={() => deleteWatchListHandle(movie.id)}>
                                        <CheckCircleTwoTone />
                                    </p>
                                ) : (
                                    <p className={styles.watched} onClick={() => {
                                        let obj = {
                                            id: movie.id,
                                            type:type
                                        }
                                        addWatchListHandle(obj);
                                    }}>
                                        <PlusCircleOutlined />
                                    </p>
                                )}
                                {favorites.find((item) => movie.id === item.id) ? (
                                    <p className={styles.heart} onClick={() => deleteFavoritesHandle(movie.id)}>
                                        <HeartTwoTone />
                                    </p>
                                ) : (
                                    <p className={styles.heart} onClick={() =>{
                                        let obj = {
                                            id: movie.id,
                                            type:type
                                        }
                                        addFavoritesHandle(obj);
                                    } }>
                                        <HeartOutlined />
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsContainer;
