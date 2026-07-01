export type ListingMediaItem = {
  image_url: string;
  hero?: boolean;
};

export type Listing = {
  id: string;
  title: string;
  facts: string[];
  media: ListingMediaItem[];
};

/** Fixed listing identifiers — do not change between sessions. */
export const WILLOW_TERRACE_LISTING_ID = 'listing-willow-terrace-residence';
export const MAPLE_AVENUE_LISTING_ID = 'listing-maple-avenue-apt-5b';

export const LISTINGS: Listing[] = [
  {
    id: WILLOW_TERRACE_LISTING_ID,
    title: 'Willow Terrace Residence',
    facts: ['4 bed', '2 bath', '2 story', 'Terrace'],
    media: [
      { hero: true, image_url: '/images/property/08_living_room_furnished.png' },
      { image_url: '/images/property/07_entry_hallway.png' },
      { image_url: '/images/property/09_living_room_angle2.png' },
      { image_url: '/images/property/living_room_angle3.png' },
      { image_url: '/images/property/living_room_angle4.png' },
      { image_url: '/images/property/10_kitchen_furnished.png' },
      { image_url: '/images/property/11_kitchen_dining_angle.png' },
      { image_url: '/images/property/13_staircase_landing.png' },
      { image_url: '/images/property/14_master_bedroom_furnished.png' },
      { image_url: '/images/property/15_bedroom2_empty.png' },
      { image_url: '/images/property/16_kids_room_furnished.png' },
      { image_url: '/images/property/16_kids_room_angle2.png' },
      { image_url: '/images/property/17_study_empty.png' },
      { image_url: '/images/property/18_bathroom1_empty.png' },
      { image_url: '/images/property/19_bathroom2_empty.png' },
      { image_url: '/images/property/20_laundry_utility.png' },
      { image_url: '/images/property/21_balcony_terrace.png' },
    ],
  },
  {
    id: MAPLE_AVENUE_LISTING_ID,
    title: '1234 Maple Avenue, Apt 5B',
    facts: ['3 bed', '2 bath', 'Apt 5B', 'Gym access'],
    media: [
      { hero: true, image_url: '/images/property/maple-avenue/01_living_room.png' },
      { image_url: '/images/property/maple-avenue/02_living_room_angle2.png' },
      { image_url: '/images/property/maple-avenue/03_living_room_angle3.jpg' },
      { image_url: '/images/property/maple-avenue/04_living_room_angle4.png' },
      { image_url: '/images/property/maple-avenue/05_dining_room.png' },
      { image_url: '/images/property/maple-avenue/06_dining_room_angle2.png' },
      { image_url: '/images/property/maple-avenue/07_kitchen.png' },
      { image_url: '/images/property/maple-avenue/08_kitchen_angle2.png' },
      { image_url: '/images/property/maple-avenue/09_bedroom.jpg' },
      { image_url: '/images/property/maple-avenue/10_bedroom.png' },
      { image_url: '/images/property/maple-avenue/11_bedroom_angle2.png' },
      { image_url: '/images/property/maple-avenue/12_bathroom.png' },
      { image_url: '/images/property/maple-avenue/13_bathroom_angle2.png' },
      { image_url: '/images/property/maple-avenue/14_attic.png' },
      { image_url: '/images/property/maple-avenue/15_attic_angle2.png' },
      { image_url: '/images/property/maple-avenue/16_gym.jpg' },
      { image_url: '/images/property/maple-avenue/17_gym_angle2.jpg' },
    ],
  },
];

export function getListingById(id: string): Listing | undefined {
  return LISTINGS.find((listing) => listing.id === id);
}

export function getListingHeroImage(listing: Listing): string {
  const hero = listing.media.find((item) => item.hero) ?? listing.media[0];
  return hero?.image_url ?? '';
}
