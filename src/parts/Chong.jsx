import PartWire from "./PartWire";
import { parts } from "./parts.config";

export default function Chong(props) {
  const p = parts.chong;
  return <PartWire url={p.url} thresholdAngle={p.thresholdAngle} opacity={p.opacity} {...props} />;
}
