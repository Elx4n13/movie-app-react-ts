import { Navigate, createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/home";
import RootLayout from "../layout";
import Favorites from "../pages/favorites/Favorites";
import WatchList from "../pages/watchList/WatchList";
import DetailsContainer from "../pages/details/Details";
import WithGenre from "../pages/withGenre/WithGenre";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to={"home"} />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/favorites",
        element: <Favorites />
      },
      {
        path: "/watch-list",
        element: <WatchList />
      },
      {
        path: 'movie/:id',
        element: <DetailsContainer />,
      },
      {
        path: 'discover/:genreId',
        element: <WithGenre />,
      }
    ],
  },
]);
