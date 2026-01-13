import marqueeConfigText from "../assets/Stocks.yaml?raw";
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/solid";
import yaml from "js-yaml";
import Marquee from "react-fast-marquee";

const marqueeConfig = yaml.load(marqueeConfigText);

const MarqueeComponent = ({ title, value, change }) => {
  const isUp = change.includes("+");
  const color = isUp ? "text-green-500" : "text-red-400";
  const Icon = isUp ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

  return (
    <div className="flex items-center gap-1">
      <p className="font-bold">{title}</p>
      <p className={`font-bold ${color}`}>{value}</p>
      <p className={color}>{change}</p>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
  );
};

const MarqueeBar = () => {
  return (
    <Marquee
      speed={marqueeConfig.speed}
      pauseOnHover={marqueeConfig.pauseOnHover}
      direction={marqueeConfig.direction}
    >
      <div className="flex gap-8 px-4">
        {(marqueeConfig?.items ?? []).map(item => (
          <MarqueeComponent key={item.id} {...item} />
        ))}
      </div>
    </Marquee>
  );
};

export default MarqueeBar;
