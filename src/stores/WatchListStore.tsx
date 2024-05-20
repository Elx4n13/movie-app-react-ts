import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MovieStore } from "./dto/store.dto";



interface WatchListState {
  watchList: MovieStore[];
}

const initialState: WatchListState = {
  watchList: JSON.parse(localStorage.getItem("WATCHLIST") || "[]"),
};

const watchList = createSlice({
  name: "watchList",
  initialState,
  reducers: {
    addWatchList: (state, action: PayloadAction<MovieStore>) => {
      state.watchList = [action.payload, ...state.watchList];
      localStorage.setItem("WATCHLIST", JSON.stringify(state.watchList));
    },
    deleteWatchList: (state, action: PayloadAction<number>) => {
      state.watchList = state.watchList.filter(
        (movie) => movie.id !== action.payload
      );
      localStorage.setItem("WATCHLIST", JSON.stringify(state.watchList));
    },
  },
});

export const { addWatchList, deleteWatchList } = watchList.actions;

export default watchList.reducer;
