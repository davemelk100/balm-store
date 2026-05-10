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
    bandcampUrl: "https://fulltimebionic.bandcamp.com/album/woodshed-studios-ep",
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
  {
    slug: "brightwire-designs",
    name: "Brightwire Designs",
    image: "/img/products/brightwire-logo.png",
    websiteUrl: "https://brightwiredesigns.com/",
    gallery: [
      "/img/products/brightwire-installation.png",
      "/img/products/brightwire-portrait.png",
      "/img/products/brightwire-sculpture.png",
      "/img/products/brightwire-silhouette.png",
      "/img/products/brightwire-bowl.png",
      "/img/products/brightwire-spheres-outdoor.png",
      "/img/products/brightwire-spheres-stack.png",
      "/img/products/brightwire-chandelier.png",
    ],
    bio: "My approach to wire art is based on the mastery of two things: process and material. By understanding the limits and properties of the material, I can fine tune my techniques.\n\nI got into wire art because I developed a new way of working with a material, which happened to be strangely therapeutic. And I could make stuff people would buy.\n\nNothing about the wire art I'd seen intrigued me, and I didn't really have any desire to pursue any visual art form. It was a visit to the local metal recycling center that changed my trajectory. Among the piles of copper wire and scrap aluminum, I noticed two massive bins loaded with wire; gold in the first and silver in the second. The employee told me it was brass EDM wire. I left that day with a couple big coolers full, having no idea what I might do with it. At some point that winter I opened one of the coolers and pulled out a thick mass of the wire and it fell over my hand, supporting itself in a dome shape about fifteen inches in diameter. That was the moment I realized I could make a cool lampshade out of brass wire. I made one, and sold it pretty quick. But it took two more years before I understood how to make certain shapes consistently. There were no YouTube videos to watch, no workshops to sign up for. I became my own teacher and apprentice, eventually developing my own techniques for working with EDM and MIG wire.",
  },
];
