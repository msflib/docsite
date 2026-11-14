import{b as w,_ as f}from"./DemoBlock.vue_vue_type_script_setup_true_lang-BFVlTiYH.js";import{c as S}from"./ListSkeleton.vue_vue_type_style_index_0_scoped_705ed619_lang-M7GEPxnB.js";import{d as c,g as r,e as z,o as m,a,u as s,w as i,L as b,t as u,F as v,c as T}from"./index-C1Uhczpo.js";import{P as _}from"./PaginationTab-QVLia3G6.js";import{_ as P}from"./DocReadout.vue_vue_type_script_setup_true_lang-B1k85uaU.js";import{_ as C}from"./EventLog.vue_vue_type_script_setup_true_lang-0uTBfItC.js";import"./useModalReopenToken-ET-SuM6q.js";import"./index-D9dJq-BP.js";import"./index-BFMud_vq.js";import"./index-DIgwrTVE.js";import"./index-CWZY94Qy.js";import"./typescript-H-WRB-L7.js";import"./aria-CJUiGiAi.js";import"./index-DiGpmS30.js";import"./_arrayPush-DBVLJtfx.js";import"./index-DR5ZABqJ.js";import"./strings-CTcAZlqZ.js";import"./isEqual-BmZ7yTvc.js";import"./scroll-DF_91Pya.js";import"./vnode-yGHa-fSF.js";const $=c({__name:"Basic",setup(d){const e=r(1),t=r(10);return(p,n)=>(m(),z(v,null,[a(s(_),{"current-page":e.value,"onUpdate:currentPage":n[0]||(n[0]=o=>e.value=o),"page-size":t.value,"onUpdate:pageSize":n[1]||(n[1]=o=>t.value=o),total:132},null,8,["current-page","page-size"]),a(P,{label:"models"},{default:i(()=>[b(" current-page: "+u(e.value)+" · page-size: "+u(t.value),1)]),_:1})],64))}}),x=`<template>
  <PaginationTab
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="132"
  />
  <DocReadout label="models">
    current-page: {{ currentPage }} · page-size: {{ pageSize }}
  </DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PaginationTab } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';

const currentPage = ref(1);
const pageSize = ref(10);
<\/script>
`,D=c({__name:"PageSizes",setup(d){const e=r(1),t=r(6);return(p,n)=>(m(),z(v,null,[a(s(_),{"current-page":e.value,"onUpdate:currentPage":n[0]||(n[0]=o=>e.value=o),"page-size":t.value,"onUpdate:pageSize":n[1]||(n[1]=o=>t.value=o),total:48,"page-sizes":[6,12,24],"page-size-suffix":"products"},null,8,["current-page","page-size"]),a(P,{label:"slice"},{default:i(()=>[b(" rows "+u((e.value-1)*t.value+1)+"–"+u(Math.min(e.value*t.value,48))+" of 48 ",1)]),_:1})],64))}}),R=`<template>
  <PaginationTab
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="48"
    :page-sizes="[6, 12, 24]"
    page-size-suffix="products"
  />
  <DocReadout label="slice">
    rows {{ (currentPage - 1) * pageSize + 1 }}–{{
      Math.min(currentPage * pageSize, 48)
    }}
    of 48
  </DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PaginationTab } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';

const currentPage = ref(1);
const pageSize = ref(6);
<\/script>
`,B=c({__name:"Events",setup(d){const e=r(1),t=r(10),p=r([]),n=g=>p.value.push(`pageChange: ${g}`),o=g=>p.value.push(`sizeChange: ${g}`);return(g,l)=>(m(),z(v,null,[a(s(_),{"current-page":e.value,"onUpdate:currentPage":l[0]||(l[0]=h=>e.value=h),"page-size":t.value,"onUpdate:pageSize":l[1]||(l[1]=h=>t.value=h),total:90,onPageChange:n,onSizeChange:o},null,8,["current-page","page-size"]),a(C,{entries:p.value},null,8,["entries"])],64))}}),k=`<template>
  <PaginationTab
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="90"
    @page-change="onPageChange"
    @size-change="onSizeChange"
  />
  <EventLog :entries="log" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PaginationTab } from '@msflib/vue';
import EventLog from '../../components/EventLog.vue';

const currentPage = ref(1);
const pageSize = ref(10);
const log = ref<string[]>([]);

const onPageChange = (page: number) => log.value.push(\`pageChange: \${page}\`);
const onSizeChange = (size: number) => log.value.push(\`sizeChange: \${size}\`);
<\/script>
`,Y=c({__name:"PaginationTabView",setup(d){return(e,t)=>(m(),T(w,{title:"PaginationTab",eyebrow:"Navigation",imports:"PaginationTab",lead:"The pager TableWidget uses, available on its own for lists that are not tables: a page-size select on one side and the page buttons on the other, both as models.",tags:["two models","used by TableWidget"],api:s(S).PaginationTab},{default:i(()=>[a(f,{title:"Basic usage",code:s(x),description:"total is the number of rows being paged through; the component works out the page count from it and the page size. Both the page and the size are models, so the parent holds the state and can restore it.",tips:["The pager owns no data - it only reports which slice to fetch or show.","The size select and the pager are separate controls: changing the size keeps the page number, clamped to the new page count."]},{default:i(()=>[a($)]),_:1},8,["code"]),a(f,{title:"Page sizes and wording",code:s(R),description:"page-sizes replaces the options in the select, and page-size-suffix names what is being counted so the select reads '6 products / page' instead of '6 / page'.",tips:["The readout works out the visible slice from the two models, which is what a list would do with them."]},{default:i(()=>[a(D)]),_:1},8,["code"]),a(f,{title:"Events",code:s(k),description:"pageChange and sizeChange fire alongside the model updates, for callers that want to trigger a fetch rather than watch the models.",tips:["Both fire after the model has been written, so reading the model inside the handler is safe."]},{default:i(()=>[a(B)]),_:1},8,["code"])]),_:1},8,["api"]))}});export{Y as default};
