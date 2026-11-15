import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const mm = gsap.matchMedia();
export { gsap, ScrollTrigger };
