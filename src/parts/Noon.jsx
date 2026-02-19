import PartWire from "./PartWire";
import { parts } from "./parts.config";

export default function Noon(props) {
  const p = parts.noon;
  return <PartWire url={p.url} thresholdAngle={p.thresholdAngle} opacity={p.opacity} {...props} />;
}
