import { PremiumInvitation, type PremiumProps } from "./shared/PremiumInvitation";

export function Yoz(props: PremiumProps) {
  return <PremiumInvitation {...props} variant="summer" edition="03" title="Riviera" subtitle="Quyosh, dengiz va bir umr sevgi" image="yoz" />;
}
