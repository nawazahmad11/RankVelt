import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Agar URL mein #about-me mojood hai
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      
      if (element) {
        // Thora sa delay taake React component render ho jaye phir scroll kare
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } else {
      // Agar koi hash nahi hai, to normal top par le jaye
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // Dono changes par monitor karega

  return null;
};

export default ScrollToTop;