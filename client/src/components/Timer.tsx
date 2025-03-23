import { useEffect, useState } from "react";
import { TbRectangleVerticalFilled } from "react-icons/tb";

export default function Timer() {
  const endTime = new Date("March 25, 2025").getTime();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date().getTime();
      const distance = (endTime - now) / 1000;
      if (distance > 0) {
        const days = Math.floor(distance / 60 / 60 / 24);
        const hours = Math.floor((distance / 60 / 60) % 24);
        const minutes = Math.floor((distance / 60) % 60);
        const seconds = Math.floor(distance % 60);
        setDays(days);
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
      } else {
        clearInterval(timerId);
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, [endTime]);
  return (
    <section className="flex flex-col  justify-center sm:ml-[10%] ml-2">
      <div className="flex  text-red-500 items-center mt-10  font-semibold">
        <TbRectangleVerticalFilled className="text-3xl" />
        <p className="text-2xl">Today's</p>
      </div>
      <div className=" mt-7 flex ">
        <h1 className="font-bold text-[13px] sm:text-3xl mr-3">Flash Sales</h1>
        <div className="flex justify-center -mt-3 ">
          <div className="mx-2 ">
            <p className="font-semibold text-[12px]">Day</p>
            <div className="font-bold sm:text-2xl flex sm:px-2">
              {days} <p className="text-red-500 ml-[50%]">:</p>
            </div>
          </div>
          <div className="mx-2">
            <p className="font-semibold text-[12px]">Hour</p>
            <div className="font-bold sm:text-2xl flex justify-center items-center sm:px-2">
              {hours}
              <p className="text-red-500 ml-[50%]">:</p>
            </div>
          </div>
          <div className="mx-2">
            <p className="font-semibold text-[12px]">Minute</p>
            <div className="font-bold sm:text-2xl flex justify-center items-center sm:px-2">
              {minutes}
              <p className="text-red-500 ml-[50%]">:</p>
            </div>
          </div>
          <div className="mx-2">
            <p className="font-semibold text-[12px]">Second</p>
            <div className="font-bold sm:text-2xl">{seconds}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
