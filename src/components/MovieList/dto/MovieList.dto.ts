export interface SlidersProps {
  type:string;
  title: string;
  queryKey: string;
  url: string;
  params: { [key: string]: any };
}
export interface Movie {
  id: number;
  name: string;
  title: string;
  poster_path: string | null;
  vote_average: number;
}