"use client"
import Image from "next/image";
import styles from "./page.module.css";
import Homeslider from "@/components/HomeSlider/Homeslider";
import MovieCarousel from "@/components/MovieCarousel/MovieCarousel";


export default function Home() {
  return (
    <main className={styles.main}>
      <Homeslider/>
      <div className={styles.movie_div}>
        <h1>Recommended Movies</h1>
        <MovieCarousel/>
      </div>
      
    </main>
  );
}
