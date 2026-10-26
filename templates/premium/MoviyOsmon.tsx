import { PremiumInvitation, type PremiumProps } from "./shared/PremiumInvitation";

export function MoviyOsmon(props: PremiumProps) {
  return <PremiumInvitation {...props} variant="sky" edition="05" title="Céleste" subtitle="Muhabbatimiz — cheksiz osmon" image="moviy-osmon" />;
}
