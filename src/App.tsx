import { motion } from "framer-motion";
import { useState } from "react";
import useSound from "use-sound";
import fartaudio from "./fart.wav";

type TItem = {
  name: string;
};

const is: TItem[] = [
  { name: "Item 1" },
  { name: "Item 2" },
  { name: "Item 3" },
  { name: "Item 4" },
  { name: "Item 5" },
  { name: "Item 6" },
  { name: "Item 7" },
  { name: "Item 8" },
  { name: "Item 9" },
  { name: "Item 10" },
];

const interpolate = (x: number): number => {
  return 1 - Math.abs(x);
};

function App() {
  const [selectedItem, setSelectedItem] = useState(-1);
  const [items, setItems] = useState<TItem[]>(is);
  const [isSpinning, setIsSpinning] = useState(false);
  const [play, { stop }] = useSound(fartaudio, { volume: 0.1 });

  const spinOnce = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.unshift(newItems.pop()!);
      return newItems;
    });
    play();
  };

  const spin = () => {
    if (isSpinning) return;

    const nTimes =  Math.floor(Math.random() * 50) + 10;
    let count = 0;
    setIsSpinning(true);

    const animateSpin = (delay: number) => {
      if (count < nTimes) {
        spinOnce();
        count++;
        setTimeout(() => animateSpin(delay * 1.03), delay); // Gradually increase delay
      } else {
        setIsSpinning(false);
        setSelectedItem(Math.floor(items.length / 2)); // Selects the middle item
      }
    };

    animateSpin(50); // Start with 100ms delay and gradually increase
  };

  const reset = () => {
    setSelectedItem(-1);
  }

  return (
    <div className="App ">
      <div className="w-screen h-screen justify-center flex-col bg-transparent text-white p-4 gap-4 items-center flex">
        <div className="w-full  flex flex-col items-center">
          {items.map((item, index) => {
            const proportion = interpolate(index / Math.round(items.length / 2) - 1);
            console.log(proportion);
            const baseSize = 100; // Base size for the middle item
            const width = baseSize * proportion;
            const height = baseSize * proportion;

            return (
              <motion.div
                key={item.name}
                layout
                animate={{
                  width: `${width}%`,
                  height: `${height}px`,
                  backgroundColor:`rgba(255,255,255,${proportion})`,
                  //opacity: proportion-0.3,
                }}
                transition={{ duration: 0.3, }}
                className={`flex border-black border-2 min-w-fit max-h-14 justify-center items-center text-black rounded-lg`}
              >
                {item.name}
              </motion.div>
            );
          })}
        </div>
        <h1 className="text-2xl p-4 rounded-lg bg-black border-white border">{selectedItem !== -1 ? items[selectedItem].name : "Nada"}</h1>
        <div className="flex gap-4">
        <button onClick={spin} className="bg-white border border-black rounded-full px-6 text-black p-3 " disabled={isSpinning}>
          {isSpinning ? "Spinning..." : "Spin"}
        </button>
        <button onClick={reset} className="bg-white border border-black rounded-full px-6 text-black p-3 " disabled={isSpinning}>
            Reset
        </button>
      </div>
      </div>
    </div>
  );
}

export default App;
