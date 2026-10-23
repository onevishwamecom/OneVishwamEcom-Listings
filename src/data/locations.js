export const cities = {
  bengaluru: {
    label: 'Bengaluru',
    areas: [
      'Whitefield', 'Koramangala', 'Indiranagar', 'JP Nagar',
      'Vijayanagar', 'Jayanagar', 'HSR Layout', 'Sarjapur Road',
      'MG Road', 'Yelahanka', 'Electronic City', 'Marathahalli',
      'BTM Layout', 'Banashankari', 'Malleshwaram', 'Rajajinagar',
      'Basavanagudi', 'Hebbal',
    ],
  },
  mysuru: {
    label: 'Mysuru',
    areas: ['Gokulam', 'Vijayanagar', 'Jayalakshmipuram', 'Kuvempunagar', 'Saraswathipuram'],
  },
  mangaluru: {
    label: 'Mangaluru',
    areas: ['Kadri', 'Bejai', 'Kodialbail', 'Urwa', 'Lalbagh'],
  },
  hubballi: {
    label: 'Hubballi',
    areas: ['Vidyanagar', 'Keshwapur', 'Gokul Road', 'Navanagar'],
  },
  belagavi: {
    label: 'Belagavi',
    areas: ['Tilakwadi', 'Camp', 'Udyambag', 'Khasbag'],
  },
};

export const defaultCity = 'bengaluru';
export const defaultArea = 'Koramangala';

export function getCityLabel(cityId) {
  return cities[cityId]?.label || cityId;
}

export function getAreaLabel(cityId, area) {
  return area || getCityLabel(cityId);
}
