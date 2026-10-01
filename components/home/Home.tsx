import { Articles } from "@/components/home/Articles";
import { Focus } from "@/components/home/Focus";
import { Hero } from "@/components/home/Hero";
import { Partners } from "@/components/home/Partners";
import { Portfolio } from "@/components/home/Portfolio";
import { Purpose } from "@/components/home/Purpose";
import Preloader from "@/components/Preloader";

/* The single route. Section order and what each one carries: README "Homepage". */
export function Home() {
  return <>
    <Preloader />
    <Hero />
    <Purpose />
    <Focus />
    <Portfolio />
    <Articles />
    <Partners />
  </>;
}
