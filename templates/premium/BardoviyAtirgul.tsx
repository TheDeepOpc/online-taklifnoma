import { PremiumInvitation, type PremiumProps } from "./shared/PremiumInvitation";

export function BardoviyAtirgul(props: PremiumProps) {
  return <PremiumInvitation {...props} variant="rose" edition="01" title="Rose Noire" subtitle="Atirgul iforidagi abadiy muhabbat" />;
}
