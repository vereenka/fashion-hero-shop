// Benchmarks from seller_economics.csv — 500 sellers, medians per category
export const BENCHMARKS = {
  returnRate: {
    dresses: 19.3,   // "premium damskie" closest match
    shoes: 17.0,     // "obuwie premium"
    streetwear: 17.7, // global median (no streetwear category in CSV)
  },
  ticketsPer100Orders: {
    negotiated: 0.8, // benchmark for large/negotiated-tier sellers
    standard: 1.4,   // benchmark for standard-tier sellers
  },
  repeatRate: 28, // global benchmark %
} as const;

export type SignalColor = "green" | "yellow" | "red";

export interface SellerMetric {
  label: string;
  value: number | null; // null = insufficient data
  benchmark: number;
  unit: string;
  direction: "lower-is-better" | "higher-is-better";
  noDataLabel?: string;
}

export interface SellerProfilePersona {
  id: "bartek" | "dorota" | "kamil";
  displayName: string;
  storeName: string;
  category: string;
  tier: "standard" | "negotiated";
  monthsActive: number;
  signal: SignalColor;
  signalLabel: string;
  signalDescription: string;
  metrics: SellerMetric[];
  repeatRate: { value: number | null; benchmark: number };
  insight: { text: string; ctaLabel: string; ctaHref: string };
}

export const sellerProfiles: SellerProfilePersona[] = [
  {
    id: "bartek",
    displayName: "Bartek",
    storeName: "Premium Wedding & Dresses",
    category: "Sukienki premium",
    tier: "negotiated",
    monthsActive: 18,
    signal: "yellow",
    signalLabel: "Twój profil operacyjny ma obszary do poprawy",
    signalDescription: "Dwa wskaźniki powyżej mediany kategorii.",
    metrics: [
      {
        label: "Return rate",
        value: 24,
        benchmark: BENCHMARKS.returnRate.dresses,
        unit: "%",
        direction: "lower-is-better",
      },
      {
        label: "Tickety support / 100 zam.",
        value: 4.2,
        benchmark: BENCHMARKS.ticketsPer100Orders.negotiated,
        unit: "",
        direction: "lower-is-better",
      },
    ],
    repeatRate: { value: 31, benchmark: BENCHMARKS.repeatRate },
    insight: {
      text: "Twoje 3 produkty z kategorii sukienek weselnych mają łącznie 67 zwrotów w ostatnich 30 dniach. Najczęstszy powód: kolor na żywo różni się od zdjęcia (38% zwrotów). Sellerzy którzy dodali zdjęcia w naturalnym świetle widzieli –11pp return rate w tej kategorii.",
      ctaLabel: "Sprawdź produkty z najwyższym return rate →",
      ctaHref: "/account",
    },
  },
  {
    id: "dorota",
    displayName: "Dorota",
    storeName: "Dorota Premium Shoes",
    category: "Obuwie premium",
    tier: "standard",
    monthsActive: 10,
    signal: "green",
    signalLabel: "Twój profil operacyjny jest w czołówce twojej kategorii",
    signalDescription: "Wszystkie wskaźniki poniżej lub zbliżone do mediany.",
    metrics: [
      {
        label: "Return rate",
        value: 8,
        benchmark: BENCHMARKS.returnRate.shoes,
        unit: "%",
        direction: "lower-is-better",
      },
      {
        label: "Tickety support / 100 zam.",
        value: 0.6,
        benchmark: BENCHMARKS.ticketsPer100Orders.standard,
        unit: "",
        direction: "lower-is-better",
      },
    ],
    repeatRate: { value: 44, benchmark: BENCHMARKS.repeatRate },
    insight: {
      text: "Twoje produkty z rozszerzonym opisem materiału (powyżej 150 słów) mają 6% zwrotów vs 14% dla produktów z krótszym opisem. Masz 8 produktów które nie mają jeszcze rozszerzonego opisu — to Twoja największa szansa na utrzymanie tego wyniku.",
      ctaLabel: "Zaktualizuj opisy 8 produktów →",
      ctaHref: "/account",
    },
  },
  {
    id: "kamil",
    displayName: "Kamil",
    storeName: "Kamil Streetwear",
    category: "Streetwear",
    tier: "standard",
    monthsActive: 2,
    signal: "red",
    signalLabel: "Twój profil operacyjny wymaga uwagi",
    signalDescription: "Za mało zamówień na pełne dane. Widoczny problem z konwersją.",
    metrics: [
      {
        label: "Return rate",
        value: null,
        benchmark: BENCHMARKS.returnRate.streetwear,
        unit: "%",
        direction: "lower-is-better",
        noDataLabel: "Min. 20 zamówień",
      },
      {
        label: "Tickety support / 100 zam.",
        value: null,
        benchmark: BENCHMARKS.ticketsPer100Orders.standard,
        unit: "",
        direction: "lower-is-better",
        noDataLabel: "Brak danych",
      },
    ],
    repeatRate: { value: null, benchmark: BENCHMARKS.repeatRate },
    insight: {
      text: "Twoje produkty mają dobry ruch (średnio 180 wyświetleń) ale niską konwersję: 0.3% vs 1.1% mediany nowych sellerów w streetwear. Najczęstsza różnica: liczba zdjęć (3 vs 7 u sprzedających) i czas odpowiedzi na pytania kupujących (22h vs 3h).",
      ctaLabel: "Dodaj zdjęcia do 3 produktów z największym ruchem →",
      ctaHref: "/account",
    },
  },
];
