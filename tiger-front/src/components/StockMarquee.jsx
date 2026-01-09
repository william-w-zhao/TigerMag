import { useState, useEffect, } from 'react'

import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid'
import Marquee from "react-fast-marquee";
import yaml from "js-yaml";

async function loadMarqueeConfig() {
  const res = await fetch("/src/assets/Stocks.yaml");
  const text = await res.text();
  return yaml.load(text);
}

const MarqueeComponent = ({ title, value, change }) => {
  const color = change >= 0 ? "text-green-400" : "text-red-400";
  const Icon = change >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

  return (
    <div className="flex items-center gap-1 whitespace-nowrap">
      <span className="font-bold">{title}</span>
      <span className={`font-bold ${color}`}>{value}</span>
      <span className={color}>{change}</span>
      <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
    </div>
  );
};


const MarqueeBar = () => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    loadMarqueeConfig().then(setConfig);
  }, []);

  if (!config) return null;

  return (
    <Marquee
      speed={config.speed}
      pauseOnHover={config.pauseOnHover}
      direction={config.direction}
      className="h-8"
    >
    <div className="flex items-center gap-8 px-4 whitespace-nowrap">
      {config.items.map(item => (
        <MarqueeComponent key={item.id} {...item} />
      ))}
    </div>
    </Marquee>
  );
};

export default MarqueeBar;
