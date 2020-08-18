import { useEffect, FunctionComponent } from "react";

const ScrollToTop: FunctionComponent = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};

export default ScrollToTop;
