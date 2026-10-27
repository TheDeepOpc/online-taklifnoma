"use client";
/* eslint-disable @next/next/no-img-element -- separate generated image parts are textured and animated. */
import { useEffect, useRef, useState } from "react";
import styles from "./MechanicalOpeningScene.module.css";

const VERTEX = `
attribute vec2 a_uv;
uniform float u_side;
uniform float u_progress;
uniform float u_time;
varying vec2 v_uv;
varying float v_light;
void main(){
  float p=u_progress;
  float pull=smoothstep(0.12,0.94,p);
  float u=a_uv.x; float v=a_uv.y;
  float freq=15.0+pull*20.0;
  float ripple=sin(u*freq+v*5.0-u_time*7.0);
  float flutter=sin(v*8.0-u_time*5.4)*sin(3.14159*p);
  float width=0.505*(1.0-0.86*pull);
  float bow=sin(v*3.14159)*flutter*0.035*u;
  float fold=ripple*0.007*pull*sin(v*2.5+0.2);
  float across=u*width+bow+fold;
  float x=u_side<0.5?across:1.0-across;
  float sag=sin(u*3.14159)*v*v*0.025*pull;
  float y=0.065+v*0.88+sag+sin(u*8.0+v*6.0-u_time*6.0)*0.018*sin(3.14159*p)*v;
  float z=sin(u*freq+v*2.0-u_time*1.8)*0.035*pull;
  float perspective=1.0/(1.0-z*0.45);
  gl_Position=vec4((x*2.0-1.0)*perspective,(1.0-y*2.0)*perspective,0.0,1.0);
  v_uv=a_uv;
  v_light=1.0+cos(u*freq+v*2.0-u_time*1.8)*0.19*pull+z*0.7;
}`;
const FRAGMENT = `
precision mediump float;
uniform sampler2D u_image;
uniform vec4 u_crop;
varying vec2 v_uv;
varying float v_light;
void main(){
  vec2 uv=u_crop.xy+vec2(1.0-v_uv.x,v_uv.y)*u_crop.zw;
  vec4 pixel=texture2D(u_image,uv);
  gl_FragColor=vec4(pixel.rgb*v_light,pixel.a);
}`;

function alphaBounds(image: HTMLImageElement) {
  const probe=document.createElement('canvas');const scale=Math.min(1,400/image.width);probe.width=Math.round(image.width*scale);probe.height=Math.round(image.height*scale);
  const ctx=probe.getContext('2d')!;ctx.drawImage(image,0,0,probe.width,probe.height);const data=ctx.getImageData(0,0,probe.width,probe.height).data;
  let x0=probe.width,y0=probe.height,x1=0,y1=0;
  for(let y=0;y<probe.height;y++)for(let x=0;x<probe.width;x++)if(data[(y*probe.width+x)*4+3]>10){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  return [x0/probe.width,y0/probe.height,(x1-x0+1)/probe.width,(y1-y0+1)/probe.height];
}

/** A tessellated textured cloth: folds, lag, sag and gathering are evaluated per vertex. */
export function FabricCurtain({ opening, onComplete }: { opening: boolean; onComplete: () => void }) {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const completeRef=useRef(onComplete);
  const [ready,setReady]=useState(false);
  useEffect(()=>{completeRef.current=onComplete;},[onComplete]);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    let disposed=false,frame=0,started=0;
    const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
    const image=new Image();image.fetchPriority="high";
    const resources: { program?:WebGLProgram; vertex?:WebGLShader; fragment?:WebGLShader; vertices?:WebGLBuffer; indices?:WebGLBuffer; texture?:WebGLTexture }={};
    let render:(p:number,t:number)=>void=()=>{};
    const resize=()=>{const r=canvas.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));if(gl)gl.viewport(0,0,canvas.width,canvas.height);if(!opening)render(0,0);};
    const observer=new ResizeObserver(resize);observer.observe(canvas);
    image.onload=()=>{
      if(disposed)return;
      const crop=alphaBounds(image);
      if(gl){
        const compile=(type:number,source:string)=>{const shader=gl.createShader(type)!;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error('Cloth shader compile failed');return shader;};
        try{
          const vertex=compile(gl.VERTEX_SHADER,VERTEX),fragment=compile(gl.FRAGMENT_SHADER,FRAGMENT),program=gl.createProgram()!;
          resources.vertex=vertex;resources.fragment=fragment;resources.program=program;gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);gl.useProgram(program);
          const cols=72,rows=96,points:number[]=[],indices:number[]=[];
          for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++)points.push(x/cols,y/rows);
          for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const a=y*(cols+1)+x,b=a+cols+1;indices.push(a,b,a+1,a+1,b,b+1);}
          resources.vertices=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,resources.vertices);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.STATIC_DRAW);
          const uv=gl.getAttribLocation(program,'a_uv');gl.enableVertexAttribArray(uv);gl.vertexAttribPointer(uv,2,gl.FLOAT,false,0,0);
          resources.indices=gl.createBuffer()!;gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,resources.indices);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
          resources.texture=gl.createTexture()!;gl.bindTexture(gl.TEXTURE_2D,resources.texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
          gl.uniform4fv(gl.getUniformLocation(program,'u_crop'),crop);gl.uniform1i(gl.getUniformLocation(program,'u_image'),0);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
          canvas.dataset.clothRenderer="webgl";
          render=(p,t)=>{gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(gl.getUniformLocation(program,'u_progress'),p);gl.uniform1f(gl.getUniformLocation(program,'u_time'),t);for(let side=0;side<2;side++){gl.uniform1f(gl.getUniformLocation(program,'u_side'),side);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);}};
        }catch{canvas.dataset.clothRenderer="error";render=()=>{};}
      }else{
        canvas.dataset.clothRenderer="canvas";
        const ctx=canvas.getContext('2d');
        if(ctx)render=(p,t)=>{ctx.clearRect(0,0,canvas.width,canvas.height);const pull=p*p*(3-2*p),w=canvas.width*.505*(1-.86*pull),h=canvas.height*.88;for(let side=0;side<2;side++){ctx.save();if(side){ctx.translate(canvas.width,0);ctx.scale(-1,1);}for(let i=0;i<72;i++){const u=i/72,x=u*w+Math.sin(t*6+u*20)*p*(1-p)*5;ctx.drawImage(image,(crop[0]+(1-u-1/72)*crop[2])*image.width,crop[1]*image.height,crop[2]*image.width/72,crop[3]*image.height,x,canvas.height*.065,w/72+1,h);}ctx.restore();}};
      }
      resize();render(0,0);setReady(true);started=performance.now();
      if(opening){const tick=(now:number)=>{if(disposed)return;const elapsed=(now-started)/1000,p=Math.min(elapsed/3.25,1);render(p,elapsed);canvas.dataset.clothProgress=p.toFixed(2);if(p<1)frame=requestAnimationFrame(tick);else completeRef.current();};frame=requestAnimationFrame(tick);}
    };
    image.src='/invitation-art/gates/atelier/parts/opera-cloth.webp';
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();if(gl){if(resources.texture)gl.deleteTexture(resources.texture);if(resources.vertices)gl.deleteBuffer(resources.vertices);if(resources.indices)gl.deleteBuffer(resources.indices);if(resources.program)gl.deleteProgram(resources.program);if(resources.vertex)gl.deleteShader(resources.vertex);if(resources.fragment)gl.deleteShader(resources.fragment);}};
  },[opening]);
  return <div className={styles.clothLayer} data-moving-part="cloth">{!ready&&<img src="/invitation-art/gates/atelier/opera-rubis.webp" className={styles.loadingCover} alt=""/>}<canvas ref={canvasRef} className={styles.clothCanvas} aria-hidden="true" data-fabric-curtain data-cloth-opening={opening} data-cloth-ready={ready}/></div>;
}
