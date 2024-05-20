import React, { useEffect, useState } from "react";
import "./Ant.css";
import styles from "./MoviesList.module.scss";
import { useLocation, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { List } from "antd";
import { useSelector } from "react-redux";
import {
    CheckCircleTwoTone,
    HeartOutlined,
    HeartTwoTone,
    PlusCircleOutlined,
    StarOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { RootState } from "../../stores";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../../api";
import {
    addWatchListHandle,
    deleteWatchListHandle,
    deleteFavoritesHandle,
    addFavoritesHandle,
} from "../../utils";

// Type definition for movie item
interface MovieItem {
    id: number;
    name:string;
    poster_path: string | null;
    vote_average: number;
    title: string;
    release_date: string;
}

interface ApiResponse {
    results: MovieItem[];
    total_results: number;
    total_pages: number;
}

const WithGenre: React.FC = () => {
    const img_base_url = "https://image.tmdb.org/t/p/original";
    const notImg = "https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png";
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState<string>(i18n.language);
    const { genreId } = useParams<{ genreId: string }>();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type') || 'movie';

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang, i18n]);

    useEffect(() => {
        setLang(i18n.language);
    }, [i18n.language]);

    const { data, isLoading, isError, refetch } = useQuery<ApiResponse>({
        queryKey: ['MovieDetails', genreId, type, lang],
        queryFn: () => fetchApi(`https://api.themoviedb.org/3/discover/${type}`, {
            language: lang,
            with_genres: genreId,
        }),
        enabled: !!genreId, // Ensure genreId is not null before fetching
    });

    useEffect(() => {
        refetch();
    }, [genreId, type, lang, refetch]);

    const { favorites } = useSelector((state: RootState) => state.favorites);
    const watchList = useSelector((state: RootState) => state.watchList.watchList);

    if (isLoading) return <p>{t('Loading')}...</p>;
    if (isError) return <p>{t('Error loading data')}.</p>;

    return (
        <div className={styles.movieListContainer}>
            <p className={styles.itemsCount}>
                {data?.total_results ? data.total_results : 1} {t('items')}
            </p>
            <List
                pagination={{
                    onChange: (page) => {
                        setSearchParams({ page: `${page}` });
                    },
                    pageSize: 20,
                    current: parseInt(searchParams.get("page") || '1', 10),
                    total: data?.total_pages,
                    showSizeChanger: false,
                }}
                grid={{
                    gutter: 36,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 3,
                    xl: 4,
                    xxl: 5,
                }}
                dataSource={data?.results || []}
                renderItem={(item: MovieItem) => (
                    <List.Item key={item.id}>
                        <div className={styles.cardContainer}>
                            <div
                                className={styles.top}
                                onClick={() => navigate(`/movie/${item.id}`)}
                            >
                                <img
                                    src={item.poster_path ? img_base_url + item.poster_path : notImg}
                                    alt="poster img"
                                />
                                <div className={styles.rating}>
                                    <p>
                                        <StarOutlined /> {item.vote_average}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.footer}>
                                <div
                                    className={styles.left}
                                    onClick={() => navigate(`/movie/${item.id}`)}
                                >
                                    <p className={styles.title}>{item.title||item.name}</p>
                                    <p>{item.release_date}</p>
                                </div>
                                <div className={styles.right}>
                                    {watchList.some((movie) => movie.id === item.id) ? (
                                        <p
                                            className={styles.watched}
                                            onClick={() => deleteWatchListHandle(item.id)}
                                        >
                                            <CheckCircleTwoTone />
                                        </p>
                                    ) : (
                                        <p
                                            className={styles.watched}
                                            onClick={() => {
                                                let obj = {
                                                    id: item.id,
                                                    type:type
                                                }
                                                  addWatchListHandle(obj);
                                              }}
                                        >
                                            <PlusCircleOutlined />
                                        </p>
                                    )}
                                    {favorites.some((movie) => movie.id === item.id) ? (
                                        <p
                                            className={styles.heart}
                                            onClick={() => deleteFavoritesHandle(item.id)}
                                        >
                                            <HeartTwoTone />
                                        </p>
                                    ) : (
                                        <p
                                            className={styles.heart}
                                            onClick={() => {
                                                let obj = {
                                                    id: item.id,
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
                    </List.Item>
                )}
            />
        </div>
    );
};

export default WithGenre;
