import { redirect } from "next/navigation";

// Alohida "/templates" bo'limi yo'q: barcha dizaynlar bosh sahifada (#designs).
// Eski havolalar (ulashilgan link, brauzer tarixi) o'sha bo'limga yo'naltiriladi.
export default function TemplatesIndexPage() {
  redirect("/#designs");
}
