import client from './client';

export const getLandingPromos = () => client.get('/landing_promos/');

export const getChannelPromo = async () =>
  (await client.get('http://tv.sawadland.com/api/home_promo')).home_promo;
