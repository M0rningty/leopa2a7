import PartWire from "./PartWire";
import { parts } from "./parts.config";

export default function Potaap(props) {
  const p = parts.potaap;
  return <PartWire url={p.url} thresholdAngle={p.thresholdAngle} opacity={p.opacity} {...props} />;
}
