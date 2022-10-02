import { useState } from "react";
import { motion, usePresence, AnimatePresence } from "framer-motion";
import { generateId } from "../../../../lib/firebase/firestore";

const name = () => `${generateId()}`;
const initialState = [...Array(4)].map(name);

export default function Demo() {
  const [items, setItems] = useState(initialState);
  const [isSorted, setIsSorted] = useState(false);

  const addAtStart = () => setItems([name(), ...items]);
  const removeAtStart = () => {
    items.shift();
    setItems([...items]);
  };
  const reset = () => setItems([...initialState]);
  const removeSelf = (n) => {
    setItems([...items.filter((name) => name !== n)]);
  };

  const handleSort = () => setIsSorted(!isSorted);
  const sorter = (a, b) => (isSorted ? a.localeCompare(b) : 0);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "stretch",
          gap: 1,
        }}
      >
        <button className="add" onClick={addAtStart}>
          Add
        </button>
        <button className="remove" onClick={removeAtStart}>
          Remove
        </button>
        <button className="sort" onClick={handleSort}>
          Sort: {!isSorted ? "A → Z" : "as added"}
        </button>
        <button className="reset" onClick={reset}>
          Reset
        </button>
      </div>
      <AnimatePresence>
        {[...items].sort(sorter).map((name, i) => (
          <ListItem color={"#000"} key={i} onClick={() => removeSelf(name)}>
            {name}
          </ListItem>
        ))}
      </AnimatePresence>
    </div>
  );
}

const transition = { type: "spring", stiffness: 500, damping: 50, mass: 1 };
function ListItem({ children, onClick, color }) {
  const [isPresent, safeToRemove] = usePresence();

  const animations = {
    layout: true,
    initial: "out",
    style: {
      color: color,
      position: isPresent ? "static" : "absolute",
    },
    animate: isPresent ? "in" : "out",
    whileTap: "tapped",
    variants: {
      in: { scaleY: 1, opacity: 1, color: color },
      out: { scaleY: 0, opacity: 0, zIndex: -1, color: color },
      tapped: { scale: 0.98, opacity: 0.5, transition: { duration: 0.1 } },
    },
    onAnimationComplete: () => !isPresent && safeToRemove(),
    transition,
  };

  return (
    <motion.h2 {...animations} onClick={onClick}>
      <div style={{ margin: 10 }}>{children}</div>
    </motion.h2>
  );
}
