import{d as f,n as y,c,o as t,w as o,a as n,b as e,e as l,F as p,r as m,u as h,t as r,R as v}from"./index-C1Uhczpo.js";import{_ as u,a as _,b as w}from"./DemoBlock.vue_vue_type_script_setup_true_lang-BFVlTiYH.js";const k={class:"doc-demo"},x={class:"doc-cards__group-title"},C={class:"doc-cards"},E={class:"doc-card__name"},T={class:"doc-card__text"},G=`# .npmrc
@msflib:registry=https://npm.pkg.github.com/

pnpm add @msflib/vue element-plus @element-plus/icons-vue vue-router`,$="<\/script>",V=f({__name:"OverviewView",setup(B){const b=y.filter(d=>d.title!=="Getting started"),g=`<template>
  <TableWidget :table-data="products" :header-map="headers" />
</template>

<script setup lang="ts">
import { TableWidget } from '@msflib/vue';
import '@msflib/vue/style.css';
import 'element-plus/dist/index.css';

const products = [{ id: 1, name: 'German Juice', instock: 80 }];
const headers = [{ name: 'instock', value: 'Available' }];
${$}`;return(d,s)=>(t(),c(w,{title:"@msflib/vue",eyebrow:"Getting started",lead:"The shared Vue component library behind the MSF apps: a table, a form builder, uploads, modals and the loading and empty panels that go with them. Every component here is built on Element Plus and ships no CSS framework of its own."},{default:o(()=>[n(u,{title:"Installing",description:"The package is published to the GitHub npm registry, so an .npmrc has to point @msflib there. Element Plus, its icon set and vue-router are peer dependencies: the library expects the host app to own those versions.",tight:""},{default:o(()=>[n(_,{class:"doc-code--inline",language:"bash",code:G})]),_:1}),n(u,{title:"Using a component",description:"Components are named exports and are registered per use, so nothing is installed globally. The stylesheet carries both the component styles and the few --msf-* tokens the library defines; everything else themes through Element Plus's own --el-* variables.",tight:""},{default:o(()=>[n(_,{class:"doc-code--inline",language:"xml",code:g})]),_:1}),e("section",k,[s[0]||(s[0]=e("h2",{class:"doc-demo__heading"},"Components",-1)),s[1]||(s[1]=e("p",{class:"doc-demo__description"}," Every page below has runnable examples with their source, a note on what each example is demonstrating, and the component's full API at the bottom. The count next to each entry in the sidebar is how many examples that page has. ",-1)),(t(!0),l(p,null,m(h(b),i=>(t(),l("div",{key:i.title,class:"doc-cards__group"},[e("p",x,r(i.title),1),e("div",C,[(t(!0),l(p,null,m(i.pages,a=>(t(),c(h(v),{key:a.path,class:"doc-card",to:a.path},{default:o(()=>[e("span",E,r(a.label),1),e("p",T,r(a.summary),1)]),_:2},1032,["to"]))),128))])]))),128))])]),_:1}))}});export{V as default};
