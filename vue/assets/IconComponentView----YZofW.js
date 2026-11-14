import{b as u,_ as p}from"./DemoBlock.vue_vue_type_script_setup_true_lang-BFVlTiYH.js";import{_ as f,c as _}from"./ListSkeleton.vue_vue_type_style_index_0_scoped_705ed619_lang-M7GEPxnB.js";import{d as a,e as h,o as r,a as n,u as e,b as g,L as v,c as C,w as c}from"./index-C1Uhczpo.js";import{_ as s}from"./IconComponent.vue_vue_type_script_setup_true_lang-DHNJVPrs.js";import{i as o,a as z}from"./assets-CIpSZvI_.js";const w={class:"doc-row"},b=a({__name:"Sizes",setup(l){return(t,i)=>(r(),h("div",w,[n(e(s),{"icon-path":e(o)("users.svg"),size:"16"},null,8,["icon-path"]),n(e(s),{"icon-path":e(o)("users.svg"),size:"24"},null,8,["icon-path"]),n(e(s),{"icon-path":e(o)("users.svg"),size:"40"},null,8,["icon-path"]),n(e(s),{"icon-path":e(o)("vite.svg"),size:"40"},null,8,["icon-path"])]))}}),I=`<template>
  <div class="doc-row">
    <IconComponent :icon-path="icon('users.svg')" size="16" />
    <IconComponent :icon-path="icon('users.svg')" size="24" />
    <IconComponent :icon-path="icon('users.svg')" size="40" />
    <IconComponent :icon-path="icon('vite.svg')" size="40" />
  </div>
</template>

<script setup lang="ts">
import { IconComponent } from '@msflib/vue';
import { icon } from '../../assets';
<\/script>
`,k={class:"doc-row"},y={class:"inherited"},x=a({__name:"Colors",setup(l){return(t,i)=>(r(),h("div",k,[n(e(s),{"icon-path":e(o)("users.svg"),size:"32"},null,8,["icon-path"]),n(e(s),{"icon-path":e(o)("users.svg"),size:"32",color:"#409eff"},null,8,["icon-path"]),n(e(s),{"icon-path":e(o)("users.svg"),size:"32",color:"#e5484d"},null,8,["icon-path"]),g("span",y,[n(e(s),{"icon-path":e(o)("users.svg"),size:"32"},null,8,["icon-path"]),i[0]||(i[0]=v(" inherits currentColor ",-1))])]))}}),S=f(x,[["__scopeId","data-v-d594820a"]]),$=`<template>
  <div class="doc-row">
    <IconComponent :icon-path="icon('users.svg')" size="32" />
    <IconComponent :icon-path="icon('users.svg')" size="32" color="#409eff" />
    <IconComponent :icon-path="icon('users.svg')" size="32" color="#e5484d" />
    <span class="inherited">
      <IconComponent :icon-path="icon('users.svg')" size="32" />
      inherits currentColor
    </span>
  </div>
</template>

<script setup lang="ts">
import { IconComponent } from '@msflib/vue';
import { icon } from '../../assets';
<\/script>

<style scoped>
.inherited {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #7e22ce;
  font-size: 0.85rem;
}
</style>
`,V={class:"doc-row"},B=a({__name:"Strokes",setup(l){return(t,i)=>(r(),h("div",V,[n(e(s),{"icon-path":e(o)("users.svg"),size:"40",color:"#0f172a","stroke-width":1},null,8,["icon-path"]),n(e(s),{"icon-path":e(o)("users.svg"),size:"40",color:"#0f172a","stroke-width":3},null,8,["icon-path"]),n(e(s),{"icon-path":e(o)("users.svg"),size:"40",color:"#b45309",fill:"#fde68a"},null,8,["icon-path"])]))}}),F=`<template>
  <div class="doc-row">
    <IconComponent
      :icon-path="icon('users.svg')"
      size="40"
      color="#0f172a"
      :stroke-width="1"
    />
    <IconComponent
      :icon-path="icon('users.svg')"
      size="40"
      color="#0f172a"
      :stroke-width="3"
    />
    <IconComponent
      :icon-path="icon('users.svg')"
      size="40"
      color="#b45309"
      fill="#fde68a"
    />
  </div>
</template>

<script setup lang="ts">
import { IconComponent } from '@msflib/vue';
import { icon } from '../../assets';
<\/script>
`,q=a({__name:"IconComponentView",setup(l){const t={name:"assets.ts",code:z},i=[{name:"Sizes.vue",code:I},t],d=[{name:"Colors.vue",code:$},t],m=[{name:"Strokes.vue",code:F},t];return(T,G)=>(r(),C(u,{title:"IconComponent",eyebrow:"Others",imports:"IconComponent",lead:"Fetches an SVG by URL and inlines it, so it can be sized, filled and stroked from props instead of being a fixed image.",tags:["inlines the SVG","styleable"],api:e(_).IconComponent},{default:c(()=>[n(p,{title:"Sizes",files:i,description:"size is a pixel number passed as a string and sets both dimensions. Because the SVG is inlined rather than loaded as an image, it scales without a second request per size.",tips:["icon-path is a URL, so the file has to be reachable - these come from the playground’s public folder."]},{default:c(()=>[n(b)]),_:1}),n(p,{title:"Colour",files:d,description:"color is written onto the svg, and every child that carries its own fill or stroke is repainted with currentColor, so one prop recolours the whole icon - including one that shipped with hard-coded colours. It defaults to currentColor, so an icon left alone takes the colour of the text around it, as in the last example.",tips:["This icon is drawn with strokes, so color changes its lines; on a filled icon it changes the fill.","A multi-colour icon is flattened to a single colour by that rewrite."]},{default:c(()=>[n(S)]),_:1}),n(p,{title:"Weight and fill",files:m,description:"stroke-width goes on the svg and every child that had one is set to inherit it, so a single number rethickens the icon. fill paints the shapes an outline icon leaves empty, and is inherited by any child that does not set its own.",tips:["The first two differ only in stroke-width: 1 against 3.","The third pairs fill with color, painting the shapes amber and keeping the lines brown."]},{default:c(()=>[n(B)]),_:1})]),_:1},8,["api"]))}});export{q as default};
