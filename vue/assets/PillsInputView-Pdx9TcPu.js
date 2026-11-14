import{b as w,_ as y}from"./DemoBlock.vue_vue_type_script_setup_true_lang-BFVlTiYH.js";import{_ as C,c as V}from"./ListSkeleton.vue_vue_type_style_index_0_scoped_705ed619_lang-M7GEPxnB.js";import{d as v,g as c,e as h,o as m,a as e,u as n,w as p,L as b,t as g,F as x,b as d,r as k,c as z}from"./index-C1Uhczpo.js";import{P as u}from"./PillsInput-Cyt2w58u.js";import{_ as P}from"./DocReadout.vue_vue_type_script_setup_true_lang-B1k85uaU.js";import{_ as I}from"./EventLog.vue_vue_type_script_setup_true_lang-0uTBfItC.js";import"./ColorPicker-vtAyMQ93.js";import"./useModalReopenToken-ET-SuM6q.js";import"./index-D-232jY6.js";import"./index-CWZY94Qy.js";import"./index-DIgwrTVE.js";import"./index-BFMud_vq.js";import"./typescript-H-WRB-L7.js";import"./aria-CJUiGiAi.js";import"./index-DiGpmS30.js";import"./_arrayPush-DBVLJtfx.js";import"./position-Bod2imkm.js";import"./index-DR5ZABqJ.js";const $=v({__name:"Basic",setup(_){const o=c([{text:"juice",color:""}]);return(s,i)=>(m(),h(x,null,[e(n(u),{modelValue:o.value,"onUpdate:modelValue":i[0]||(i[0]=r=>o.value=r)},null,8,["modelValue"]),e(P,{label:"v-model"},{default:p(()=>[b(g(o.value),1)]),_:1})],64))}}),S=`<template>
  <PillsInput v-model="pills" />
  <DocReadout label="v-model">{{ pills }}</DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PillsInput } from '@msflib/vue';
import type { Pill } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';

const pills = ref<Pill[]>([{ text: 'juice', color: '' }]);
<\/script>
`,R=v({__name:"WithColor",setup(_){const o=["#e05252","#e0a052","#52e06c","#52bae0","#a052e0"],s=c([{text:"juice",color:"#e05252"},{text:"water",color:"#52bae0"},{text:"dairy",color:""}]),i=c([]),r=a=>{i.value.push(`item-selected: index ${a} (${s.value[a]?.text})`)};return(a,t)=>(m(),h(x,null,[e(n(u),{modelValue:s.value,"onUpdate:modelValue":t[0]||(t[0]=l=>s.value=l),"with-color":"","color-palette":o,onItemSelected:r},null,8,["modelValue"]),e(I,{entries:i.value,label:"item-selected"},null,8,["entries"]),e(P,{label:"v-model"},{default:p(()=>[b(g(s.value),1)]),_:1})],64))}}),D=`<template>
  <PillsInput
    v-model="pills"
    with-color
    :color-palette="palette"
    @item-selected="onSelected"
  />
  <EventLog :entries="log" label="item-selected" />
  <DocReadout label="v-model">{{ pills }}</DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PillsInput } from '@msflib/vue';
import type { Pill } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';
import EventLog from '../../components/EventLog.vue';

const palette = ['#e05252', '#e0a052', '#52e06c', '#52bae0', '#a052e0'];

const pills = ref<Pill[]>([
  { text: 'juice', color: '#e05252' },
  { text: 'water', color: '#52bae0' },
  { text: 'dairy', color: '' },
]);

const log = ref<string[]>([]);

const onSelected = (index: number) => {
  log.value.push(\`item-selected: index \${index} (\${pills.value[index]?.text})\`);
};
<\/script>
`,j={class:"styles"},T=v({__name:"ColorStyles",setup(_){const o=[{text:"juice",color:"#e05252"},{text:"water",color:"#52bae0"},{text:"dairy",color:"#f8e16c"}],s=c(o.map(t=>({...t}))),i=c(o.map(t=>({...t}))),r=c(o.map(t=>({...t}))),a=(t,l)=>({fill:"transparent",text:t.color,border:l?"#0f172a":t.color});return(t,l)=>(m(),h("div",j,[d("div",null,[l[3]||(l[3]=d("p",{class:"styles__title"},"solidPillColors (default)",-1)),e(n(u),{modelValue:s.value,"onUpdate:modelValue":l[0]||(l[0]=f=>s.value=f),hint:""},null,8,["modelValue"])]),d("div",null,[l[4]||(l[4]=d("p",{class:"styles__title"},"use-related-fore-color",-1)),e(n(u),{modelValue:i.value,"onUpdate:modelValue":l[1]||(l[1]=f=>i.value=f),"use-related-fore-color":"",hint:""},null,8,["modelValue"])]),d("div",null,[l[5]||(l[5]=d("p",{class:"styles__title"},"custom resolver",-1)),e(n(u),{modelValue:r.value,"onUpdate:modelValue":l[2]||(l[2]=f=>r.value=f),"pill-colors":a,hint:""},null,8,["modelValue"])])]))}}),A=C(T,[["__scopeId","data-v-9552edda"]]),B=`<template>
  <div class="styles">
    <div>
      <p class="styles__title">solidPillColors (default)</p>
      <PillsInput v-model="solid" hint="" />
    </div>
    <div>
      <p class="styles__title">use-related-fore-color</p>
      <PillsInput v-model="related" use-related-fore-color hint="" />
    </div>
    <div>
      <p class="styles__title">custom resolver</p>
      <PillsInput v-model="custom" :pill-colors="outlineOnly" hint="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PillsInput } from '@msflib/vue';
import type { Pill, PillColorResolver } from '@msflib/vue';

const seed: Pill[] = [
  { text: 'juice', color: '#e05252' },
  { text: 'water', color: '#52bae0' },
  { text: 'dairy', color: '#f8e16c' },
];

const solid = ref<Pill[]>(seed.map((pill) => ({ ...pill })));
const related = ref<Pill[]>(seed.map((pill) => ({ ...pill })));
const custom = ref<Pill[]>(seed.map((pill) => ({ ...pill })));

const outlineOnly: PillColorResolver = (pill, selected) => ({
  fill: 'transparent',
  text: pill.color,
  border: selected ? '#0f172a' : pill.color,
});
<\/script>

<style scoped>
.styles {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.styles__title {
  margin: 0 0 0.35rem;
  color: var(--doc-text-faint);
  font-size: 0.75rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
</style>
`,U={class:"doc-stack"},E=v({__name:"Sizes",setup(_){const o=["small","default","large"],s=c([{text:"juice",color:"#52bae0"},{text:"water",color:"#52e06c"}]);return(i,r)=>(m(),h("div",U,[(m(),h(x,null,k(o,a=>e(n(u),{key:a,modelValue:s.value,"onUpdate:modelValue":r[0]||(r[0]=t=>s.value=t),size:a,hint:`size: ${a}`,placeholder:"Add values separated by commas"},null,8,["modelValue","size","hint"])),64))]))}}),L=`<template>
  <div class="doc-stack">
    <PillsInput
      v-for="size in sizes"
      :key="size"
      v-model="pills"
      :size="size"
      :hint="\`size: \${size}\`"
      placeholder="Add values separated by commas"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ComponentSize } from 'element-plus';
import { PillsInput } from '@msflib/vue';
import type { Pill } from '@msflib/vue';

const sizes: ComponentSize[] = ['small', 'default', 'large'];
const pills = ref<Pill[]>([
  { text: 'juice', color: '#52bae0' },
  { text: 'water', color: '#52e06c' },
]);
<\/script>
`,se=v({__name:"PillsInputView",setup(_){return(o,s)=>(m(),z(w,{title:"PillsInput",eyebrow:"Form",imports:"PillsInput",lead:"A text field whose comma-separated value is mirrored as a list of removable tags. The text and the pills are two views of one model, so editing either updates the other.",tags:["comma-separated","per-pill colour","colour resolvers"],api:n(V).PillsInput},{default:p(()=>[e(y,{title:"Basic usage",code:n(S),description:"Type values separated by commas and each one becomes a pill. The input is a computed view of the model, so deleting text removes pills and closing a pill rewrites the text.",tips:["The model is an array of { text, color } - the colour can stay empty, and the stylesheet then decides the appearance.","Pills carry no id, so a repeated value is tracked by position."]},{default:p(()=>[e($)]),_:1},8,["code"]),e(y,{title:"Colouring pills",code:n(D),description:"with-color mounts a ColorPicker under the list. Click a pill to select it, then pick a colour and it is written onto that pill. item-selected fires on every selection, with the pill's index.",tips:["The picker shows the selected pill’s current colour, and nothing happens until a pill is selected.","Closing a pill does not select it - the close button is excluded from the click handler.","Retyping the list keeps the selection on the same text, choosing the nearest occurrence to where it was."]},{default:p(()=>[e(R)]),_:1},8,["code"]),e(y,{title:"Colour styles",code:n(B),description:"The same three pills under all three colouring strategies. By default the pill is filled with its own colour and the text flips between black and white to stay readable. use-related-fore-color fills with a wash instead and darkens the colour for the text. A pill-colors resolver replaces both and can return only the keys it cares about.",tips:["The resolver is also told whether the pill is selected, which is how the third row outlines the selected pill.","solidPillColors and relatedPillColors are exported, so a resolver can delegate to them."]},{default:p(()=>[e(A)]),_:1},8,["code"]),e(y,{title:"Sizes and hint",code:n(L),description:"size is the Element Plus tag size, and hint is the help line under the field. All three fields here share one model, so a change in any of them shows up in the others.",tips:["Attributes that are not declared props, such as placeholder, fall through to the inner el-input."]},{default:p(()=>[e(E)]),_:1},8,["code"])]),_:1},8,["api"]))}});export{se as default};
