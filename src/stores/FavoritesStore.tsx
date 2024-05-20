import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MovieStore } from "./dto/store.dto";

interface FavoritesState {
  favorites: MovieStore[]; // Eğer MovieStore ile aynı yapıya sahipse MovieStore[] olarak değiştirilebilir
}

const initialState: FavoritesState = {
  favorites: JSON.parse(localStorage.getItem("FAVORITES") || "[]"),
};

const favorites = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorites: (state, action: PayloadAction<MovieStore>) => {
      state.favorites = [action.payload, ...state.favorites];
      localStorage.setItem("FAVORITES", JSON.stringify(state.favorites));
    },
    deleteFavorites: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(
        (movie) => movie.id !== action.payload
      );
      localStorage.setItem("FAVORITES", JSON.stringify(state.favorites));
    },
  },
});

export const { addFavorites, deleteFavorites } = favorites.actions;

export default favorites.reducer;
