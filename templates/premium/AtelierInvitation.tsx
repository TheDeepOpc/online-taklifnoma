import { PremiumInvitation, type PremiumProps } from "./shared/PremiumInvitation";
import type { InvitationLayout } from "@/lib/invitationArt";
const editions: Record<string, { title: string; subtitle: string; variant: InvitationLayout }> = {
  "atelier-opera-rubis": { title: "Opéra Rubis", subtitle: "Muhabbatimizning buyuk premyerasi", variant: "rose" },
  "atelier-samarqand-palace": { title: "Samarqand", subtitle: "Qadriyatlar bilan bezalgan yangi hayot", variant: "royal" },
  "atelier-cristal-celeste": { title: "Cristal Céleste", subtitle: "Osmon kabi cheksiz muhabbat", variant: "sky" },
  "atelier-lettre-royale": { title: "Lettre Royale", subtitle: "Qalbimizdan yo‘llangan eng aziz maktub", variant: "royal" },
  "atelier-jardin-de-verre": { title: "Jardin de Verre", subtitle: "Muhabbat gullagan go‘zal kun", variant: "botanical" },
  "atelier-album-heritage": { title: "Héritage", subtitle: "Birgalikda yozilayotgan abadiy hikoya", variant: "autumn" },
  "atelier-tresor-eternel": { title: "Trésor Éternel", subtitle: "Muhabbat — eng aziz xazinamiz", variant: "gold" },
};
export function AtelierInvitation(props: PremiumProps) {
  const edition = editions[props.theme.id];
  return <PremiumInvitation {...props} {...edition} edition="III" />;
}
