import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

export const lenis = new Lenis({ autoRaf: false });

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
