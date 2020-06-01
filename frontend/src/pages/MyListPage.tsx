import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "../context/auth-context";
import { Title as ITitle } from "../core/interfaces/title";
import { getMyList } from "../api/title";
import Title from "../components/Title";
import ScrollToTop from "../components/ScrollToTop";

const MyListPage: FunctionComponent = () => {
  const { titles } = useMyList();

  return (
    <div>
      <ScrollToTop />
      <h1 className="mb-10 text-6xl font-bold">My List</h1>
      <div className="flex flex-wrap">
        {titles &&
          titles.map((title: ITitle) => <Title key={title.id} title={title} />)}
      </div>
    </div>
  );
};

export const useMyList = () => {
  const { token } = useAuth();
  const history = useHistory();
  const [titles, setTitles] = useState<ITitle[] | null>(null);
  const [error, setError] = useState(null);

  if (!token) history.push("/login");

  const getTitles = useCallback(async () => {
    try {
      const data = await getMyList();
      setTitles(data.results);

      // Cleanup
      error && setError(null);
    } catch (err) {
      console.log("error");
      setError(err);
    }
  }, []);

  useEffect(() => {
    getTitles();
  }, [token, getTitles]);

  return { titles, error };
};

export default MyListPage;
