import{b as D,_ as g}from"./DemoBlock.vue_vue_type_script_setup_true_lang-BFVlTiYH.js";import{_ as A,c as E}from"./ListSkeleton.vue_vue_type_style_index_0_scoped_705ed619_lang-M7GEPxnB.js";import{d as f,k as v,e as n,o,b as p,y as B,H as b,a as t,u as r,w as u,F as m,r as k,t as C,g as O,L as T,c as L}from"./index-C1Uhczpo.js";import{E as w,X as P}from"./index-CWZY94Qy.js";import{E as V}from"./index-D-232jY6.js";import"./index-DIgwrTVE.js";const I={class:"msf-status-progress"},N={class:"msf-status-progress__track"},F={class:"msf-status-progress__labels"},z=f({__name:"StatusProgress",props:{statusList:{type:Array,default:()=>[]},currentStatus:{type:String,default:""},disabledStatusColor:{type:String,default:"gray"}},setup(i){const s=i,l=v(()=>a.value.find(e=>e.name===s.currentStatus)?.order??-1),a=v(()=>[...s.statusList].sort((e,_)=>e.order-_.order)),y=v(()=>a.value.slice(1).map((e,_)=>({from:a.value[_],to:e}))),c=e=>l.value>=e.order,h=e=>({backgroundColor:c(e)?e.color:s.disabledStatusColor}),$=e=>c(e.to)?{background:`linear-gradient(to right, ${e.from.color}, ${e.to.color})`}:{backgroundColor:s.disabledStatusColor},x=e=>({color:c(e)?e.color:"gray"});return(e,_)=>(o(),n("div",I,[p("div",N,[a.value.length>0?(o(),n("div",{key:0,class:"msf-status-progress__marker msf-status-progress__marker--start",style:b(h(a.value[0]))},[t(r(w),null,{default:u(()=>[t(r(P))]),_:1})],4)):B("",!0),(o(!0),n(m,null,k(y.value,d=>(o(),n("div",{key:d.to.name,class:"msf-status-progress__segment",style:b($(d))},[p("div",{class:"msf-status-progress__marker msf-status-progress__marker--end",style:b(h(d.to))},[t(r(w),null,{default:u(()=>[t(r(P))]),_:1})],4)],4))),128))]),p("div",F,[(o(!0),n(m,null,k(a.value,d=>(o(),n("p",{key:d.name,style:b(x(d))},C(d.label),5))),128))])]))}}),S=A(z,[["__scopeId","data-v-14472173"]]),q={class:"doc-row",style:{"margin-top":"1rem"}},H=f({__name:"Basic",setup(i){const s=[{name:"placed",order:1,color:"#409eff",label:"Placed"},{name:"packed",order:2,color:"#e6a23c",label:"Packed"},{name:"shipped",order:3,color:"#67c23a",label:"Shipped"},{name:"delivered",order:4,color:"#67c23a",label:"Delivered"}],l=O("packed");return(a,y)=>(o(),n(m,null,[t(r(S),{"status-list":s,"current-status":l.value},null,8,["current-status"]),p("div",q,[(o(),n(m,null,k(s,c=>t(r(V),{key:c.name,type:c.name===l.value?"primary":"default",onClick:h=>l.value=c.name},{default:u(()=>[T(C(c.label),1)]),_:2},1032,["type","onClick"])),64))])],64))}}),R=`<template>
  <StatusProgress :status-list="statusList" :current-status="currentStatus" />
  <div class="doc-row" style="margin-top: 1rem">
    <el-button
      v-for="status in statusList"
      :key="status.name"
      :type="status.name === currentStatus ? 'primary' : 'default'"
      @click="currentStatus = status.name"
    >
      {{ status.label }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElButton } from 'element-plus';
import { StatusProgress } from '@msflib/vue';

const statusList = [
  { name: 'placed', order: 1, color: '#409eff', label: 'Placed' },
  { name: 'packed', order: 2, color: '#e6a23c', label: 'Packed' },
  { name: 'shipped', order: 3, color: '#67c23a', label: 'Shipped' },
  { name: 'delivered', order: 4, color: '#67c23a', label: 'Delivered' },
];

const currentStatus = ref('packed');
<\/script>
`,X=f({__name:"DisabledColor",setup(i){const s=[{name:"draft",order:1,color:"#909399",label:"Draft"},{name:"submitted",order:2,color:"#409eff",label:"Submitted"},{name:"approved",order:3,color:"#67c23a",label:"Approved"},{name:"paid",order:4,color:"#67c23a",label:"Paid"}];return(l,a)=>(o(),L(r(S),{"status-list":s,"current-status":"submitted","disabled-status-color":"#e4e7ed"}))}}),j=`<template>
  <StatusProgress
    :status-list="statusList"
    current-status="submitted"
    disabled-status-color="#e4e7ed"
  />
</template>

<script setup lang="ts">
import { StatusProgress } from '@msflib/vue';

const statusList = [
  { name: 'draft', order: 1, color: '#909399', label: 'Draft' },
  { name: 'submitted', order: 2, color: '#409eff', label: 'Submitted' },
  { name: 'approved', order: 3, color: '#67c23a', label: 'Approved' },
  { name: 'paid', order: 4, color: '#67c23a', label: 'Paid' },
];
<\/script>
`,G=f({__name:"OutOfOrder",setup(i){const s=[{name:"paid",order:4,color:"#67c23a",label:"Paid"},{name:"draft",order:1,color:"#909399",label:"Draft"},{name:"approved",order:3,color:"#67c23a",label:"Approved"},{name:"submitted",order:2,color:"#409eff",label:"Submitted"}];return(l,a)=>(o(),n(m,null,[t(r(S),{"status-list":s,"current-status":"approved"}),a[0]||(a[0]=p("p",{class:"doc-note"}," The list is declared shuffled; order decides what is drawn where. ",-1))],64))}}),J=`<template>
  <StatusProgress :status-list="statusList" current-status="approved" />
  <p class="doc-note">
    The list is declared shuffled; order decides what is drawn where.
  </p>
</template>

<script setup lang="ts">
import { StatusProgress } from '@msflib/vue';

const statusList = [
  { name: 'paid', order: 4, color: '#67c23a', label: 'Paid' },
  { name: 'draft', order: 1, color: '#909399', label: 'Draft' },
  { name: 'approved', order: 3, color: '#67c23a', label: 'Approved' },
  { name: 'submitted', order: 2, color: '#409eff', label: 'Submitted' },
];
<\/script>
`,Z=f({__name:"StatusProgressView",setup(i){return(s,l)=>(o(),L(D,{title:"StatusProgress",eyebrow:"Feedback",imports:"StatusProgress",lead:"A horizontal track across an ordered list of statuses, filled up to the one a record has reached. Each status carries its own colour, so a cancelled step can read differently from a completed one.",tags:["ordered statuses","per-status colour"],api:r(E).StatusProgress},{default:u(()=>[t(g,{title:"Stepping through statuses",code:r(R),description:"status-list declares the steps and current-status names the one reached. The buttons below move current-status, which is the only thing that has to change for the track to advance.",tips:["Step back and forth: the track and the captions follow current-status with no internal state.","Each filled segment is a gradient between the two steps’ own colours, so the track is not one single hue."]},{default:u(()=>[t(H)]),_:1},8,["code"]),t(g,{title:"Colouring what is not reached yet",code:r(j),description:"disabled-status-color is used for every step after the current one. The default is a flat gray; a lighter tone keeps the untravelled part of the track quieter.",tips:["It applies to the track and the step marker, not to the caption."]},{default:u(()=>[t(X)]),_:1},8,["code"]),t(g,{title:"Declaration order does not matter",code:r(J),description:"Position comes from each status's order, not from where it sits in the array, so a list built from an API response does not have to be sorted first.",tips:["This list is declared shuffled and still renders draft, submitted, approved, paid."]},{default:u(()=>[t(G)]),_:1},8,["code"])]),_:1},8,["api"]))}});export{Z as default};
