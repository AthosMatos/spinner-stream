import { motion } from "framer-motion";
import { useState } from "react";
import useSound from "use-sound";
import fartaudio from "./fart.wav";

type TItem = {
  name: string;
};
type TItemWColor = {
  name: string;
  color: string;
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


const genColor = (index: number): string => {
  const hue = (index * 137) % 360; // Use golden angle approximation for better distribution
  return `hsl(${hue}, 80%, 70%)`; // Adjust saturation and lightness as needed
};


const interpolate = (x: number): number => {
  const t = 1 - Math.abs(x);
  return t * t ; // easing for sharper corners
};

function App() {
  const genItems = (items:any[])=>items.map((item,index) => ({ ...item, color: genColor(index) }))
  const [selectedItem, setSelectedItem] = useState(-1);
  const [items, setItems] = useState<TItemWColor[]>(genItems(is));
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
        setTimeout(() => animateSpin(delay * 1.02), delay); // Gradually increase delay
      } else {
        setIsSpinning(false);
        setSelectedItem(Math.floor(items.length / 2)); // Selects the middle item
      }
    };

    animateSpin(70); // Start with 100ms delay and gradually increase
  };

  const reset = () => {
    setSelectedItem(-1);
    const items = [...is];
    const suffleItems = items.sort(() => Math.random() - 0.5);

    setItems(genItems(suffleItems));
  }

  return (
    <div className="App ">
      <div className="w-screen h-screen justify-center flex-col bg-transparent text-white p-4 gap-4 items-center flex">
      <div className="w-full border-2 border-black rounded-3xl h-[60vh] flex items-center overflow-hidden">
          <div className="flex flex-col w-full">
          {items.map((item, index) => {
            const proportion = interpolate(index / Math.round(items.length / 2) - 1);
            console.log(proportion);
            const baseSize = 100; // Base size for the middle item
            //const width = baseSize * (proportion+0.1);
            const height = baseSize * (proportion * 2);
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            return (
              <motion.div
                key={item.name}
                layout
                style={{
                  backgroundColor: item.color,
                  
                }}
                animate={{
                 // width: `${width}%`,
                  height: `${height}px`,
                 fontSize: `${height/2.7}px`,
                  //opacity: proportion-0.3,
                }}
                transition={{ duration: isLast||isFirst?0:0.1, }}
                className={`flex border-black w-full border-t border-b justify-center items-center text-black font-bold`}
              >
                {item.name}
              </motion.div>
            );
          })}
          </div>
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
