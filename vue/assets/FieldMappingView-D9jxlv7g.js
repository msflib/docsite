import{b as H,_ as F}from"./DemoBlock.vue_vue_type_script_setup_true_lang-39hEDRnl.js";import{_ as D,c as N}from"./ListSkeleton.vue_vue_type_style_index_0_scoped_705ed619_lang-Cs8_YQpO.js";import{d as f,g as b,k as B,e as u,o as i,b as a,H as K,F as h,r as x,U as Q,t as v,a8 as R,a as n,u as c,w as g,L as I,c as U}from"./index-DVs0cwap.js";import{_ as k}from"./DocReadout.vue_vue_type_script_setup_true_lang-C1DjKJlg.js";const T={class:""},A={class:"",style:{"grid-column":"span 3"}},$=["onUpdate:modelValue"],j=["value","disabled"],q=f({__name:"FieldMapping",props:{inputFields:{type:Array,default:()=>[],required:!0},targetFields:{type:[Array,Object],required:!0},headerBgColor:{type:String,default:"#d3d3d3"}},emits:["update:modelValue"],setup(l,{emit:r}){const d=r,s=l,o=b([]),p=B(()=>!Array.isArray(s.targetFields)),y=()=>{d("update:modelValue",s.inputFields.map((m,e)=>({inputField:m,targetField:o.value[e]})))},C=m=>{const e=m.target;e.style.outline="1px solid gray"},S=m=>{const e=m.target;e.style.outline="none"};return(m,e)=>(i(),u("div",null,[e[4]||(e[4]=a("div",{class:"fm-title"},[a("p",{style:{"font-size":"x-large","font-weight":"900"}},"Field Mapping"),a("p",{style:{"margin-top":"10px"}}," Select fields that correspond to the columns in the csv file ")],-1)),a("div",T,[a("div",{class:"fm-grid",style:K([{padding:"1rem 0.5rem"},{backgroundColor:l.headerBgColor}])},e[2]||(e[2]=[a("h1",{style:{"grid-column":"span 3","text-align":"left"}},"Spreadsheet",-1),a("h1",{style:{"text-align":"center"}},"Fields",-1)]),4),(i(!0),u(h,null,x(l.inputFields,(V,_)=>(i(),u("div",{key:_,class:"fm-grid",style:{padding:"0.5rem","border-bottom":"1px solid #e5e7eb"}},[a("p",A,v(V),1),Q(a("select",{id:"","onUpdate:modelValue":t=>o.value[_]=t,name:"",style:{height:"30px",border:"1px solid #d3d3d3","border-radius":"4px",color:"gray",padding:"5px"},onChange:y,onFocus:e[0]||(e[0]=t=>C(t)),onBlur:e[1]||(e[1]=t=>S(t))},[e[3]||(e[3]=a("option",{value:void 0},"No selection",-1)),(i(!0),u(h,null,x(l.targetFields,(t,M)=>(i(),u("option",{key:t,value:p.value?M:t,disabled:o.value.includes(p.value?M:t)},v(t),9,j))),128))],40,$),[[R,o.value[_]]])]))),128))])]))}}),w=D(q,[["__scopeId","data-v-060beca2"]]),L=f({__name:"ListTargets",setup(l){const r=["Item code","Item name","Qty","Price"],d=["SKU","Name","Quantity","Unit price"],s=b("nothing mapped yet"),o=p=>{s.value=p};return(p,y)=>(i(),u(h,null,[n(c(w),{"input-fields":r,"target-fields":d,"onUpdate:modelValue":o}),n(k,{label:"update:modelValue"},{default:g(()=>[I(v(s.value),1)]),_:1})],64))}}),P=`<template>
  <FieldMapping
    :input-fields="csvHeaders"
    :target-fields="targetFields"
    @update:model-value="onMapping"
  />
  <DocReadout label="update:modelValue">{{ mapping }}</DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FieldMapping } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';

const csvHeaders = ['Item code', 'Item name', 'Qty', 'Price'];
const targetFields = ['SKU', 'Name', 'Quantity', 'Unit price'];

const mapping = ref<unknown>('nothing mapped yet');

const onMapping = (value: unknown) => {
  mapping.value = value;
};
<\/script>
`,z=f({__name:"MapTargets",setup(l){const r=["Item code","Item name","Qty"],d={sku:"SKU",name:"Name",quantity:"Quantity"},s=b("nothing mapped yet"),o=p=>{s.value=p};return(p,y)=>(i(),u(h,null,[n(c(w),{"input-fields":r,"target-fields":d,"onUpdate:modelValue":o}),n(k,{label:"update:modelValue"},{default:g(()=>[I(v(s.value),1)]),_:1})],64))}}),E=`<template>
  <FieldMapping
    :input-fields="csvHeaders"
    :target-fields="targetFields"
    @update:model-value="onMapping"
  />
  <DocReadout label="update:modelValue">{{ mapping }}</DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FieldMapping } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';

const csvHeaders = ['Item code', 'Item name', 'Qty'];
const targetFields = {
  sku: 'SKU',
  name: 'Name',
  quantity: 'Quantity',
};

const mapping = ref<unknown>('nothing mapped yet');

const onMapping = (value: unknown) => {
  mapping.value = value;
};
<\/script>
`,W=f({__name:"HeaderColor",setup(l){const r=["Item code","Item name"],d=["SKU","Name"];return(s,o)=>(i(),U(c(w),{"input-fields":r,"target-fields":d,"header-bg-color":"#eef2ff"}))}}),O=`<template>
  <FieldMapping
    :input-fields="csvHeaders"
    :target-fields="targetFields"
    header-bg-color="#eef2ff"
  />
</template>

<script setup lang="ts">
import { FieldMapping } from '@msflib/vue';

const csvHeaders = ['Item code', 'Item name'];
const targetFields = ['SKU', 'Name'];
<\/script>
`,Z=f({__name:"FieldMappingView",setup(l){return(r,d)=>(i(),U(H,{title:"FieldMapping",eyebrow:"Data",imports:"FieldMapping",lead:"Two columns: the headers found in an uploaded file on one side, the fields they have to land in on the other. Every change emits the whole mapping, so the caller never has to assemble it.",tags:["import step","array or object targets"],api:c(N).FieldMapping},{default:g(()=>[n(F,{title:"Target fields as a list",code:c(P),description:"With an array of target fields, each input header is matched against a label and the emitted mapping carries that same label as targetField - which is what you want when the labels are already the API's field names.",tips:["Change a selection and watch the readout: the whole mapping is re-emitted, not just the row that changed.","Input headers that are left unmapped still appear in the payload."]},{default:g(()=>[n(L)]),_:1},8,["code"]),n(F,{title:"Target fields as a map",code:c(E),description:"With an object, the values are shown to the user and the keys are what gets emitted, so the UI can read 'Unit price' while the payload says unit_price.",tips:["Compare the readout with the previous demo: here targetField is sku, not SKU."]},{default:g(()=>[n(z)]),_:1},8,["code"]),n(F,{title:"Header colour",code:c(O),description:"header-bg-color tints the two column headers, for fitting the component into a page that is not grey.",tips:["It is a plain CSS colour - any notation works."]},{default:g(()=>[n(W)]),_:1},8,["code"])]),_:1},8,["api"]))}});export{Z as default};
