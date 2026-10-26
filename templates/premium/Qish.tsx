import { PremiumInvitation, type PremiumProps } from "./shared/PremiumInvitation";

export function Qish(props: PremiumProps) {
  return <PremiumInvitation {...props} variant="winter" edition="01" title="Cristal" subtitle="Qor kabi beg‘ubor muhabbat" image="qish" />;
}
