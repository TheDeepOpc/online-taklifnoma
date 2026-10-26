import { PremiumInvitation, type PremiumProps } from "./shared/PremiumInvitation";

export function Kuz(props: PremiumProps) {
  return <PremiumInvitation {...props} variant="autumn" edition="02" title="Amber" subtitle="Qalblar iliqlikka to‘lgan fasl" image="kuz" />;
}
