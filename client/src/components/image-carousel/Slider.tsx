import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
const data = [
  {
    src: "https://etedge-insights.com/wp-content/uploads/2020/11/ET-Banner.jpg",
  },
  {
    src: "https://i.ytimg.com/vi/NqPeeO-7yT4/maxresdefault.jpg",
  },
  {
    src: "https://the-fragrance-shop.imgix.net/Promos/2019/happy-week/TFS-800x500-dior-sauvage-2019-subbrand.jpg",
  },
];

export default function Slider() {
  const [next, setNext] = useState(0);
  const ref = useRef<undefined | number | NodeJS.Timeout>(undefined);

  const handleNext = () => {
    setNext((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  const handlePre = () => {
    setNext((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  useEffect(() => {
    ref.current = setInterval(handleNext, 2000);
    return () => clearInterval(ref.current);
  }, []);

  return (
    <div
      onMouseEnter={() => clearInterval(ref.current)}
      onMouseLeave={() => (ref.current = setInterval(handleNext, 2000))}
      className="relative w-[90vw] max-h-[80vh] mx-auto mt-10 rounded-xl overflow-hidden"
    >
      {/* Blurred background */}
      <img
        src={data[next].src}
        alt="bg-blur"
        className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 z-0"
      />

      {/* Foreground image */}
      <div className="relative  flex items-center justify-center w-full h-full">
        <img
          className="max-w-full max-h-[80vh] object-contain"
          src={data[next].src}
          alt="slider"
        />
      </div>

      {/* Controls */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 ">
        <button
          onClick={handlePre}
          className="bg-zinc-500 rounded-lg p-2 cursor-pointer"
        >
          <FaAngleLeft />
        </button>
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 ">
        <button
          onClick={handleNext}
          className="bg-zinc-500 rounded-lg p-2 cursor-pointer"
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
}
