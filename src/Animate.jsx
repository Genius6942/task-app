import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

const pageVariants = {
  initial: {
    // x: "-30%",
    opacity: 0,
  },
  in: {
    // x: 0,
    opacity: 1,
  },
  out: {
    // x: "30%",
    opacity: 0,
  },
};

const pageTransition = {
  type: "tween",
  duration: 0.2,
};

export default function PageAnimateLayout({ children }) {
  const { pathname } = useLocation();
  return (
    <>
      <motion.div
        style={{ flexGrow: 1 }}
        key={pathname}
        initial="initial"
        animate="in"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </>
  );
}
