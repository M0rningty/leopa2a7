import PartWire from "./PartWire";
import { parts } from "./parts.config";

export default function Junjang(props) {
  const p = parts.junjang;
  return <PartWire url={p.url} thresholdAngle={p.thresholdAngle} opacity={p.opacity} {...props} />;
}
