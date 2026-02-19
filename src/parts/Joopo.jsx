import PartWire from "./PartWire";
import { parts } from "./parts.config";

export default function Joopo(props) {
  const p = parts.joopo;
  return (
    <PartWire
      url={p.url}
      thresholdAngle={p.thresholdAngle}
      opacity={p.opacity}
      {...props}
    />
  );
}
