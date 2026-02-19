import PartWire from "./PartWire";
import { parts } from "./parts.config";

export default function Baqui(props) {
  const p = parts.baqui;
  return <PartWire url={p.url} thresholdAngle={p.thresholdAngle} opacity={p.opacity} {...props} />;
}
