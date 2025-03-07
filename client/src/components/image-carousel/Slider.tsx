import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
const data = [
  {
    src: "../images/85fdc341901865.57b8e89847dfd.jpg",
  },
  {
    src: "../images/Mobile-ads-and-best-strategies.png",
  },
  {
    src: "../images/laptop2.jpg",
  },
];

export default function Slider() {
  const [next, setNext] = useState(0);
  const ref = useRef<undefined | number | NodeJS.Timeout>(undefined);

  const handleNext = () => {
    setNext((previousValue) => {
      if (previousValue == data.length - 1) {
        return 0;
      }
      return previousValue + 1;
    });
  };

  const handlePre = () => {
    if (next == 0) {
      setNext(data.length - 1);
    } else {
      setNext(next - 1);
    }
  };

  useEffect(() => {
    ref.current = setInterval(handleNext, 2000);
    return () => {
      clearInterval(ref.current);
    };
  }, []);
  return (
    <div
      onMouseEnter={() => clearInterval(ref.current)}
      onMouseLeave={() => (ref.current = setInterval(handleNext, 2000))}
    >
      <div className="absolute top-[40%] left-[10%] ">
        <button
          onClick={handlePre}
          className=" bg-zinc-500 rounded-lg p-2 cursor-pointer"
        >
          <FaAngleLeft />
        </button>
      </div>
      <img
        className="w-[90%] h-80 mx-auto mt-10"
        src={data[next].src}
        alt="image"
      />
      <div className="absolute top-[40%] right-[10%]">
        <button
          onClick={handleNext}
          className="cursor-pointer bg-zinc-500 rounded-lg p-2"
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
}
