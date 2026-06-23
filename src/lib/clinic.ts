export const CLINIC = {
  name: "Odontal Dental Clinic",
  shortName: "Odontal",
  tagline: "Thoughtful, patient-centred dental care in Aguda, Surulere.",
  privacyUrl: "/privacy",
  phone: "0807 105 6340",
  phoneIntl: "+2348071056340",
  whatsapp: "+2348071056340",
  email: "hello@odontaldentalclinic.ng",
  address: "21 Agbebi St, Ijesha Rd, Surulere, Lagos 101282",
  area: "Aguda, Lagos",
  mapsUrl: "https://www.google.com/maps?q=21+Agbebi+St,+Ijesha+Rd,+Surulere,+Lagos",
  mapsEmbed:
    "https://www.google.com/maps?q=21+Agbebi+St,+Ijesha+Rd,+Surulere,+Lagos&output=embed",
  instagram: "https://instagram.com/odontaldentalclinicng",
  xTwitter: "https://x.com/odontaldentalclinicng",
  facebook: "https://facebook.com/odontaldentalclinicng",
  hours: [
    { day: "Monday", open: "8:00 AM – 8:00 PM" },
    { day: "Tuesday", open: "8:00 AM – 8:00 PM" },
    { day: "Wednesday", open: "8:00 AM – 8:00 PM" },
    { day: "Thursday", open: "8:00 AM – 8:00 PM" },
    { day: "Friday", open: "8:00 AM – 8:00 PM" },
    { day: "Saturday", open: "9:00 AM – 5:00 PM" },
    { day: "Sunday", open: "9:00 AM – 5:00 PM" },
  ],
} as const;

export function formatNGN(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}
