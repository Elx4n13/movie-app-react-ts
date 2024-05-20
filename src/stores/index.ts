import { configureStore } from '@reduxjs/toolkit'
import favorites from './FavoritesStore'
import watchList from './WatchListStore'


const store = configureStore({
    reducer: {
        favorites,
        watchList
    }
})
export type RootState = ReturnType<typeof store.getState>;

export default store