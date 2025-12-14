export const getImageUrl = (imageOrUrl: string | undefined): string => {
  if (!imageOrUrl) {
    return "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=500&c=7"
  }
  
  return imageOrUrl
}

export const normalizeSweet = (sweet: any) => {
  return {
    ...sweet,
    image_url: getImageUrl(sweet.image_url || sweet.image)
  }
}
