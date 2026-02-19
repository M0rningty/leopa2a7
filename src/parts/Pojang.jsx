import PartWire from "./PartWire";
import { parts } from "./parts.config";

export default function Pojang(props) {
  const p = parts.pojang;
  return <PartWire url={p.url} thresholdAngle={p.thresholdAngle} opacity={p.opacity} {...props} />;
}
