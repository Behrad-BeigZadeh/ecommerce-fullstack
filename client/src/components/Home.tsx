import Slider from "./image-carousel/Slider";
import FlashSales from "./products/FlashSales";
import RegularProducts from "./products/RegularProducts";
import Timer from "./Timer";

export default function Home() {
  return (
    <div>
      <Slider />
      <Timer />
      <FlashSales />
      <RegularProducts />
    </div>
  );
}
