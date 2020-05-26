import client from "./client";
import {LandingPromo, ChannelPromo} from "~core/interfaces/promo";


export const getLandingPromos = (): Promise<LandingPromo[]> => client.get('/landing_promos/')

export const getChannelPromo = async (): Promise<ChannelPromo> => (await client.get('http://tv.sawadland.com/api/home_promo') as any).home_promo

