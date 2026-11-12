import{b as v,_ as d}from"./DemoBlock.vue_vue_type_script_setup_true_lang-39hEDRnl.js";import{_ as w,c as k}from"./ListSkeleton.vue_vue_type_style_index_0_scoped_705ed619_lang-Cs8_YQpO.js";import{d as i,g as u,e as m,o as c,a as e,u as n,w as l,L as f,t as h,F as g,b as x,c as C}from"./index-DVs0cwap.js";import{C as _}from"./ColorPicker-BUq5ZBwn.js";import{_ as b}from"./DocReadout.vue_vue_type_script_setup_true_lang-C1DjKJlg.js";import"./useModalReopenToken-BOV0Xe1E.js";import"./index-CGe98h1F.js";import"./index-DkVUR0Zr.js";import"./index-Dlr5RO3J.js";import"./index-DL7g3Wfc.js";import"./typescript-BUhRLt6_.js";import"./aria-CJUiGiAi.js";import"./index-CTuphtO2.js";import"./_arrayPush-DEr91YK_.js";import"./position-KUV8cbRr.js";const R=i({__name:"Basic",setup(p){const o=u("");return(t,r)=>(c(),m(g,null,[e(n(_),{modelValue:o.value,"onUpdate:modelValue":r[0]||(r[0]=a=>o.value=a)},null,8,["modelValue"]),e(b,{label:"v-model"},{default:l(()=>[f(h(o.value||"nothing picked"),1)]),_:1})],64))}}),P=`<template>
  <ColorPicker v-model="colour" />
  <DocReadout label="v-model">{{ colour || 'nothing picked' }}</DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ColorPicker } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';

const colour = ref('');
<\/script>
`,D=i({__name:"CustomPalette",setup(p){const o=["#0f172a","#1d4ed8","#0e9488","#15803c","#b45309","#be123b","#7e22ce"],t=u("#0e9488");return(r,a)=>(c(),m(g,null,[e(n(_),{modelValue:t.value,"onUpdate:modelValue":a[0]||(a[0]=s=>t.value=s),"color-palette":o},null,8,["modelValue"]),e(b,{label:"v-model"},{default:l(()=>[f(h(t.value),1)]),_:1})],64))}}),V=`<template>
  <ColorPicker v-model="colour" :color-palette="brandPalette" />
  <DocReadout label="v-model">{{ colour }}</DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ColorPicker } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';

const brandPalette = [
  '#0f172a',
  '#1d4ed8',
  '#0e9488',
  '#15803c',
  '#b45309',
  '#be123b',
  '#7e22ce',
];

const colour = ref('#0e9488');
<\/script>
`,y=i({__name:"Sizing",setup(p){const o=["#e05252","#e0a052","#52e06c","#52bae0","#a052e0"],t=u("");return(r,a)=>(c(),m(g,null,[e(n(_),{modelValue:t.value,"onUpdate:modelValue":a[0]||(a[0]=s=>t.value=s),"color-palette":o,"palette-width":"48px","palette-height":"28px","palette-gap":"10px"},null,8,["modelValue"]),e(b,{label:"v-model"},{default:l(()=>[f(h(t.value||"nothing picked"),1)]),_:1})],64))}}),B=`<template>
  <ColorPicker
    v-model="colour"
    :color-palette="palette"
    palette-width="48px"
    palette-height="28px"
    palette-gap="10px"
  />
  <DocReadout label="v-model">{{ colour || 'nothing picked' }}</DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ColorPicker } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';

const palette = ['#e05252', '#e0a052', '#52e06c', '#52bae0', '#a052e0'];
const colour = ref('');
<\/script>
`,S={class:"dark-panel"},$=i({__name:"SelectionRing",setup(p){const o=["#f8fafc","#e2e8f0","#94a3b8","#475569","#1e293b"],t=u("#94a3b8");return(r,a)=>(c(),m(g,null,[x("div",S,[e(n(_),{modelValue:t.value,"onUpdate:modelValue":a[0]||(a[0]=s=>t.value=s),"color-palette":o,"ring-inner-color":"#0f172a","ring-outer-color":"#fbbf24","palette-width":"36px","palette-height":"36px"},null,8,["modelValue"])]),e(b,{label:"v-model"},{default:l(()=>[f(h(t.value||"nothing picked"),1)]),_:1})],64))}}),T=w($,[["__scopeId","data-v-9f031cb0"]]),A=`<template>
  <div class="dark-panel">
    <ColorPicker
      v-model="colour"
      :color-palette="palette"
      ring-inner-color="#0f172a"
      ring-outer-color="#fbbf24"
      palette-width="36px"
      palette-height="36px"
    />
  </div>
  <DocReadout label="v-model">{{ colour || 'nothing picked' }}</DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ColorPicker } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';

const palette = ['#f8fafc', '#e2e8f0', '#94a3b8', '#475569', '#1e293b'];
const colour = ref('#94a3b8');
<\/script>

<style scoped>
.dark-panel {
  padding: 1rem;
  border-radius: 10px;
  background: #0f172a;
}
</style>
`,O=i({__name:"ColorPickerView",setup(p){return(o,t)=>(c(),C(v,{title:"ColorPicker",eyebrow:"Form",imports:"ColorPicker",lead:"A grid of preset swatches with an el-color-picker at the end for anything the palette does not cover. Both write the same model, so a caller never has to care which was used.",tags:["preset swatches","free-form fallback","alpha supported"],api:n(k).ColorPicker},{default:l(()=>[e(d,{title:"Basic usage",code:n(P),description:"Without a palette the built-in one is used: 66 swatches laid out as a grid that fills the width of its container. The trailing swatch is the el-color-picker trigger, which supports alpha.",tips:["The selected swatch is marked with a ring rather than a tick, so the colour stays unobscured.","A colour chosen through the trigger is written to the same model, even if no swatch matches it."]},{default:l(()=>[e(R)]),_:1},8,["code"]),e(d,{title:"A custom palette",code:n(V),description:"color-palette replaces the built-in list, and a model value that matches one of the swatches starts selected.",tips:["Both sides are normalised to hex before matching, so a palette written in rgb() still matches a hex model value."]},{default:l(()=>[e(D)]),_:1},8,["code"]),e(d,{title:"Swatch size and spacing",code:n(B),description:"palette-width, palette-height and palette-gap are plain CSS lengths, so swatches can be anything from small squares to wide bars.",tips:["The wrapper is always full width, so swatches wrap to as many rows as they need."]},{default:l(()=>[e(y)]),_:1},8,["code"]),e(d,{title:"Selection ring on a dark surface",code:n(A),description:"The ring is two colours: an inner border and an outer halo. Both default to a light-on-dark pair, so on a dark panel they need swapping to stay visible.",tips:["ring-inner-color is drawn over the swatch edge; ring-outer-color sits outside it."]},{default:l(()=>[e(T)]),_:1},8,["code"])]),_:1},8,["api"]))}});export{O as default};
