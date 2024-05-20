import { MovieStore } from '../stores/dto/store.dto'
import store from '../stores'
import { addFavorites, deleteFavorites } from '../stores/FavoritesStore'
import { addWatchList, deleteWatchList } from '../stores/WatchListStore'


export const addFavoritesHandle = (movie: MovieStore) => {
    store.dispatch(addFavorites(movie))
}

export const deleteFavoritesHandle = (id: number) => {
    store.dispatch(deleteFavorites(id))
}

export const addWatchListHandle = (movie: MovieStore) => {
    store.dispatch(addWatchList(movie))
}

export const deleteWatchListHandle = (id: number) => {
    store.dispatch(deleteWatchList(id))
}
