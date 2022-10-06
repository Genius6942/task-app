import { createContext } from "react";
import { useState } from "react";
import { useContext } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const ConfettiContext = createContext({
  /**
   * @param {number} x
   * @param {number} y
   */
  createConfetti: (x, y) => {},
});

const ConfettiProvider = ({ ...props }) => {
  const [confetties, setConfetties] = useState([
    { x: 0, y: 0, count: 0, key: 0 },
  ]);
  /**
   *
   * @param {number} x
   * @param {number} y
   */
  const createConfetti = (x, y) => {
    setConfetties([
      ...confetties,
      { x, y, count: 200, key: confetties.at(-1).key + 1 },
    ]);
  };

  const { width, height } = useWindowSize();
  return (
    <ConfettiContext.Provider value={{ createConfetti }}>
      {props.children}
      {confetties.map((confetti, idx) => (
        <Confetti
          key={confetti.key}
          width={width}
          height={height}
          confettiSource={{
            width: 10,
            height: 10,
            x: confetti.x,
            y: confetti.y,
          }}
          tweenDuration={50}
          recycle={false}
          numberOfPieces={confetti.count}
          onConfettiComplete={() => {
            const copy = [...confetties];
            copy.splice(idx, 1);
            setConfetties(copy);
          }}
        />
      ))}
    </ConfettiContext.Provider>
  );
};

const useConfetti = () => useContext(ConfettiContext);

export { useConfetti, ConfettiProvider };
