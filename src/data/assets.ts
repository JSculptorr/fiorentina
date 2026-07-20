export const imageAssets = {
  stadium: "/images/stadium-franchi-aerial.jpg",
  fansFlags: "/images/fans-flags-franchi.jpg",
  fansTifo: "/images/fans-tifo-stands.jpg",
  fansCurva: "/images/fans-curva.avif",
  playerMain: "/images/player-main.webp",
  playerHeader: "/images/player-header-main.jpg",
  kitGroup: "/images/kit-home-players.webp",
  kitCathedral: "/images/kit-cathedral.jpg",
  kitPortrait: "/images/kit-player-portrait.jpeg",
  clubLogo: "/images/club-logo.webp",
  abstractStadium: "/images/viola-stadium-atmosphere.jpg",
} as const;

export type ImageAssetKey = keyof typeof imageAssets;
