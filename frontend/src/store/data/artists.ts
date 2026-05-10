import { Artist } from "../types";

export const artists: Artist[] = [
  {
    slug: "balm",
    name: "Balm",
    image: "/img/products/balm-logo.png",
    bio: "Balm's collage approach blends lo-fi textures, warped samples, and hypnotic repetition in a way that feels indebted to Negativland and the meditative minimalism of Zomes.\n\nThe band's style sits somewhere between abstract electronic, deconstructed post-punk, and ambient noise, with a strong emphasis on atmosphere over traditional structure. The mood is hazy, slightly disorienting, and introspective, like drifting through a fragmented memory or a late-night broadcast bleeding between stations.\n\nFans of acts like Tobacco, Girl Talk, or Big Black, along with songs that favor texture and repetition over formula, will find a similar appeal here.",
    bandcampUrl: "https://balmsoothes.bandcamp.com/",
    spotifyUrl: "https://open.spotify.com/",
    paypalUrl: "https://paypal.me/Balmsoothes",
    venmoUrl: "https://venmo.com/u/Dave-Melkonian",
    shows: [
      {
        // Sentinel ISO date keeps the entry in the future-only filter;
        // dateLabel renders as "TBD" instead of an actual date.
        date: "2099-01-01",
        dateLabel: "TBD",
        venue: "TBD",
        city: "TBD",
      },
    ],
    releases: [
      {
        date: "2099-01-01",
        dateLabel: "TBD",
        title: "TBD",
        type: "TBD",
      },
    ],
  },
  {
    slug: "full-time-bionic",
    name: "Full Time Bionic",
    image: "/img/products/ftb-stacked.png",
    bio: "A dense mix of heavy abrasion and desert groove, where precise, repetitive riffs nod to Helmet's locked-in precision, Unsane's razor-sharp attack, and Fu Manchu's thick, rolling fuzz, driven by a deadpan, spoken delivery that echoes somewhere between Steve Albini and Eddie Glass. Heavy, hypnotic, and tightly controlled.",
    websiteUrl: "https://fulltimebionic.com/",
    bandcampUrl: "https://bandcamp.com/",
    spotifyUrl: "https://open.spotify.com/",
    paypalUrl: "https://paypal.me/FullTimeBionic",
    venmoUrl: "https://venmo.com/u/FullTimeBionic",
    shows: [
      {
        date: "2026-05-22",
        venue: "Loving Touch",
        city: "Ferndale, MI",
      },
    ],
    releases: [
      {
        // Mid-October sorts within fall; dateLabel overrides display.
        date: "2026-10-15",
        dateLabel: "Fall 2026",
        title: "Title TBD",
        type: "LP",
      },
    ],
  },
];
