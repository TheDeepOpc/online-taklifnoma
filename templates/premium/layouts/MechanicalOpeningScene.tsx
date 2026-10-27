"use client";
/* eslint-disable @next/next/no-img-element -- separate generated image parts are textured and animated. */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { GateScene } from "@/lib/templateDesigns";
import { GATE_ART_PLATES } from "@/lib/templateDesigns";
import { FabricCurtain } from "./FabricCurtain";
import styles from "./MechanicalOpeningScene.module.css";

export function MechanicalOpeningScene({ scene, opening, onComplete }: { scene: GateScene; opening: boolean; onComplete: () => void }) {
  const plate=GATE_ART_PLATES[scene];
  const [partsReady,setPartsReady]=useState(false);
  const part=(id:string)=>`/invitation-art/gates/atelier/parts/${id}.webp`;
  useEffect(()=>{
    let cancelled=false;
    const ids:Record<GateScene,string[]>={mirror:[],suzani:["palace-doors"],sky:["crystal-doors"],garden:["garden-doors"],royal:["royal-envelope-base","royal-envelope-flap"],autumn:["heirloom-cover"],eternity:["treasury-lid"]};
    const images:HTMLImageElement[]=[];
    Promise.all(ids[scene].map(id=>new Promise<void>((resolve,reject)=>{const image=new Image();image.fetchPriority="high";images.push(image);image.onload=()=>resolve();image.onerror=()=>reject();image.src=`/invitation-art/gates/atelier/parts/${id}.webp`;if(image.complete&&image.naturalWidth)resolve();}))).then(()=>{if(!cancelled)setPartsReady(true);}).catch(()=>{});
    return()=>{cancelled=true;images.forEach(image=>{image.onload=null;image.onerror=null;});};
  },[scene]);
  const door=(id:string,mode:'swing'|'slide'|'crystal')=><div className={`${styles.doorFrame} ${styles[mode]}`}>
    {[0,1].map(side=><motion.img key={side} src={part(id)} alt="" draggable={false} className={`${styles.part} ${side?styles.right:styles.left}`} style={{transformOrigin:side?'100% 50%':'0% 50%'}} initial={false} animate={opening?(mode==='slide'?{x:side?'55%':'-55%'}:{rotateY:side?102:-102,filter:mode==='crystal'?'brightness(1.3)':'brightness(.85)'}):{}} transition={{duration:2.8,ease:[.45,0,.18,1]}} data-moving-part={side?'right-door':'left-door'}/>) }
  </div>;
  return <motion.div className={`${styles.scene} ${styles[scene] ?? ""}`} aria-hidden="true" data-parts-ready={partsReady} initial={false} animate={{opacity:opening?0:1}} transition={{duration:.4,delay:opening?2.85:0}} onAnimationComplete={opening&&scene!=='mirror'?onComplete:undefined}>
    <motion.img src={`/invitation-art/atelier-scenes/${plate}.webp`} className={styles.backdrop} alt="" fetchPriority="high" initial={false} animate={{opacity:opening?0:1}} transition={{duration:1.3,delay:opening?.3:0}} />
    {!partsReady&&scene!=='mirror'&&<img src={`/invitation-art/gates/atelier/${plate}.webp`} className={styles.preloadCover} alt=""/>}
    {scene==='mirror'&&<FabricCurtain opening={opening} onComplete={onComplete}/>}
    {scene==='suzani'&&door('palace-doors','swing')}
    {scene==='sky'&&door('crystal-doors','crystal')}
    {scene==='garden'&&door('garden-doors','slide')}
    {scene==='royal'&&<div className={styles.correspondence}>
      <motion.div className={styles.letterSheet} initial={false} animate={opening?{y:'-53%',rotate:-3}: {}} transition={{duration:1.4,delay:opening?1.1:0,ease:[.42,0,.18,1]}} data-moving-part="letter"><span/><i/></motion.div>
      <motion.img src={part('royal-envelope-base')} alt="" className={styles.envelopeBase} initial={false} animate={opening?{y:'53%',opacity:0}:{}} transition={{duration:1.1,delay:opening?1.85:0,ease:[.45,0,.2,1]}} data-moving-part="envelope-pocket"/>
      <motion.img src={part('royal-envelope-flap')} alt="" className={styles.envelopeFlap} style={{transformOrigin:'50% 0%'}} initial={false} animate={opening?{rotateX:178}:{}} transition={{duration:1.45,delay:opening ? .08 : 0,ease:[.45,0,.15,1]}} data-moving-part="envelope-flap"/>
    </div>}
    {scene==='autumn'&&<motion.div className={styles.bookCover} style={{transformOrigin:'0% 50%'}} initial={false} animate={opening?{rotateY:-164}:{}} transition={{duration:2.9,ease:[.48,0,.17,1]}} data-moving-part="book-cover"><img src={part('heirloom-cover')} alt="" className={styles.front}/><div className={styles.bookInside}/></motion.div>}
    {scene==='eternity'&&<motion.div className={styles.casketLid} style={{transformOrigin:'50% 0%'}} initial={false} animate={opening?{rotateX:114,y:'-8%'}:{}} transition={{duration:2.8,ease:[.48,0,.17,1]}} data-moving-part="casket-lid"><img src={part('treasury-lid')} alt="" className={styles.front}/><div className={styles.casketInside}/></motion.div>}
  </motion.div>;
}
