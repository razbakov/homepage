import{d as l,t as u,L as c,E as m,G as i,o as p,b as f,i as d,B as t}from"../modules/vue-B3Rs_2zr.js";import{c as _}from"./SlideWrapper-D-OLGWF9.js";import{u as v}from"./context-s2TMISB2.js";import"../index-CK4adVe3.js";import"../modules/shiki-DezAGQ2Q.js";const k=l({__name:"DrawingLayer",setup(g){const{drauu:e,drawingEnabled:o,loadCanvas:s}=_(),r=v().$scale,n=u();return c(()=>{e.mount(n.value,n.value.parentElement),m(r,a=>e.options.coordinateScale=1/a,{immediate:!0}),s()}),i(()=>{e.unmount()}),(a,w)=>(p(),f("svg",{ref_key:"svg",ref:n,class:d(["w-full h-full absolute top-0",{"pointer-events-none":!t(o),"touch-none":t(o)}])},null,2))}});export{k as default};