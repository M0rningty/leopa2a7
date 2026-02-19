import PartWire from "./PartWire";
import { parts } from "./parts.config";

export default function Chache(props) {
  const p = parts.chache;
  return <PartWire url={p.url} thresholdAngle={p.thresholdAngle} opacity={p.opacity} {...props} />;
}
