import{b as x,_ as g}from"./DemoBlock.vue_vue_type_script_setup_true_lang-39hEDRnl.js";import{F,_ as B,c as R}from"./ListSkeleton.vue_vue_type_style_index_0_scoped_705ed619_lang-Cs8_YQpO.js";import{d as h,g as m,q as V,e as u,o as r,b as _,G as D,H as S,a as o,u as l,w as d,L as b,t as $,F as z,r as j,c as C}from"./index-DVs0cwap.js";import{_ as k}from"./DocReadout.vue_vue_type_script_setup_true_lang-C1DjKJlg.js";const E="/docsite/vue/vc-assets/images/avatar.png",I={class:"upload__container"},M=["src"],P={key:1,src:E,class:"profile-img",alt:"Default Avatar"},L=["accept"],N=h({__name:"AvatarUpload",props:{modelValue:{},size:{default:96},iconSize:{default:28},accept:{default:"image/*"},maxSize:{default:2}},emits:["update:modelValue","upload","success","error"],setup(f,{emit:n}){const a=f,i=n,t=m(null),e=m(null),c=()=>{e.value?.click()},v=s=>{const p=s.target.files?.[0];if(!p)return;const w=A(p);if(!w.status){i("error",{type:"validation",message:w.message});return}t.value=URL.createObjectURL(p),i("update:modelValue",p),i("upload",p),i("success",p)},A=s=>s.type.match("image.*")?s.size>a.maxSize*1024*1024?{message:`File is too large. Max size is ${a.maxSize}MB.`,status:!1}:{message:"Valid image",status:!0}:{message:"Image type not valid",status:!1};return V(()=>a.modelValue,s=>{s?t.value=URL.createObjectURL(s):t.value=null}),(s,U)=>(r(),u("div",I,[_("div",{class:"upload__frame",style:S({width:s.size+"px",height:s.size+"px"})},[t.value?(r(),u("img",{key:0,src:t.value,class:"profile-img",alt:"Profile Preview"},null,8,M)):(r(),u("img",P)),_("input",{ref_key:"fileInput",ref:e,type:"file",accept:s.accept,class:"file__input",onChange:v},null,40,L),_("div",{class:"icon__container",style:S({width:s.iconSize+"px",height:s.iconSize+"px"}),onClick:D(c,["stop"])},[o(l(F),{icon:["fas","camera"]})],4)],4)]))}}),y=B(N,[["__scopeId","data-v-f7ab890c"]]),T=h({__name:"Basic",setup(f){const n=m(null),a=m("No file chosen yet."),i=e=>{a.value=`Picked ${e.name} (${Math.round(e.size/1024)} KB)`},t=e=>{a.value=`Rejected: ${e.message}`};return(e,c)=>(r(),u(z,null,[o(l(y),{"model-value":n.value,"onUpdate:modelValue":c[0]||(c[0]=v=>n.value=v),onSuccess:i,onError:t},null,8,["model-value"]),o(k,{label:"status"},{default:d(()=>[b($(a.value),1)]),_:1})],64))}}),K=`<template>
  <AvatarUpload
    :model-value="avatar"
    @update:model-value="(file: File) => (avatar = file)"
    @success="onSuccess"
    @error="onError"
  />
  <DocReadout label="status">{{ status }}</DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AvatarUpload } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';

const avatar = ref<File | null>(null);
const status = ref('No file chosen yet.');

const onSuccess = (file: File) => {
  status.value = \`Picked \${file.name} (\${Math.round(file.size / 1024)} KB)\`;
};

const onError = (payload: { type: string; message: string }) => {
  status.value = \`Rejected: \${payload.message}\`;
};
<\/script>
`,O={class:"doc-row"},q=h({__name:"Sizing",setup(f){const n=[{size:64,iconSize:20},{size:96,iconSize:28},{size:140,iconSize:36}];return(a,i)=>(r(),u("div",O,[(r(),u(z,null,j(n,t=>o(l(y),{key:t.size,"model-value":null,size:t.size,"icon-size":t.iconSize},null,8,["size","icon-size"])),64))]))}}),G=`<template>
  <div class="doc-row">
    <AvatarUpload
      v-for="option in options"
      :key="option.size"
      :model-value="null"
      :size="option.size"
      :icon-size="option.iconSize"
    />
  </div>
</template>

<script setup lang="ts">
import { AvatarUpload } from '@msflib/vue';

const options = [
  { size: 64, iconSize: 20 },
  { size: 96, iconSize: 28 },
  { size: 140, iconSize: 36 },
];
<\/script>
`,H=h({__name:"Validation",setup(f){const n=m(null),a=m("Pick an image over 50KB to see the rejection."),i=e=>{a.value=`success: ${e.name}`},t=e=>{a.value=`error (${e.type}): ${e.message}`};return(e,c)=>(r(),u(z,null,[o(l(y),{"model-value":n.value,size:96,"icon-size":28,accept:"image/png, image/jpeg","max-size":.05,"onUpdate:modelValue":c[0]||(c[0]=v=>n.value=v),onError:t,onSuccess:i},null,8,["model-value"]),o(k,{label:"last event"},{default:d(()=>[b($(a.value),1)]),_:1})],64))}}),J=`<template>
  <AvatarUpload
    :model-value="avatar"
    :size="96"
    :icon-size="28"
    accept="image/png, image/jpeg"
    :max-size="0.05"
    @update:model-value="(file: File) => (avatar = file)"
    @error="onError"
    @success="onSuccess"
  />
  <DocReadout label="last event">{{ status }}</DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AvatarUpload } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';

const avatar = ref<File | null>(null);
const status = ref('Pick an image over 50KB to see the rejection.');

const onSuccess = (file: File) => {
  status.value = \`success: \${file.name}\`;
};

const onError = (payload: { type: string; message: string }) => {
  status.value = \`error (\${payload.type}): \${payload.message}\`;
};
<\/script>
`,Z=h({__name:"AvatarUploadView",setup(f){return(n,a)=>(r(),C(x,{title:"AvatarUpload",eyebrow:"Form",imports:"AvatarUpload",lead:"A round frame with a camera button that opens a file dialog, validates the picked image, and shows it in place. It holds one file, not a list, and it never uploads anything itself.",tags:["single file","type and size checks","preview in place"],api:l(R).AvatarUpload},{default:d(()=>[o(g,{title:"Basic usage",code:l(K),description:"model-value is a File or null, and the preview follows it: the component watches the prop, so a parent that clears the model also clears the picture. success fires with the same file as update:modelValue, for callers that want a separate hook.",tips:["Pick an image and the frame fills; the readout is driven by the success event.","The default avatar is served from /vc-assets/images/avatar.png, so an app has to ship that asset.","The camera glyph is a Font Awesome icon, so the host app has to add faCamera to its icon library - the playground does it in main.ts."]},{default:d(()=>[o(T)]),_:1},8,["code"]),o(g,{title:"Sizes",code:l(G),description:"size and icon-size are pixel numbers applied to the frame and to the camera button, so the component can sit in a profile header or in a dense form row.",tips:["Both default to 96 and 28, so the frame has a size without them; this demo overrides both."]},{default:d(()=>[o(q)]),_:1},8,["code"]),o(g,{title:"Type and size validation",code:l(J),description:"accept filters the dialog, while max-size is a limit in MB enforced before anything is emitted. A file that fails either check emits error with a message and is not kept - the previous picture stays.",tips:["The limit here is 0.05MB, so most photos are rejected and the error message shows the limit.","A non-image file reports a different message than an oversized one."]},{default:d(()=>[o(H)]),_:1},8,["code"])]),_:1},8,["api"]))}});export{Z as default};
