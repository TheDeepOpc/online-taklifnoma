import { PremiumInvitation, type PremiumProps } from "./shared/PremiumInvitation";

export function TillaHayot(props: PremiumProps) {
  return <PremiumInvitation {...props} variant="gold" edition="04" title="Éternité" subtitle="Oltin lahzalardan abadiy hayotga" image="tilla-hayot" />;
}
