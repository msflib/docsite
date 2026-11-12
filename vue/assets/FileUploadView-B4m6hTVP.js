import{b as L,_ as c}from"./DemoBlock.vue_vue_type_script_setup_true_lang-39hEDRnl.js";import{_ as k,c as V}from"./ListSkeleton.vue_vue_type_style_index_0_scoped_705ed619_lang-Cs8_YQpO.js";import{d,g as f,e as s,o as n,a as i,b as F,y as g,u as r,F as m,r as P,t as h,B as $,L as w,w as p,c as B}from"./index-DVs0cwap.js";import{F as v,E as x}from"./FileUpload-hTfYllIr.js";import{E as b}from"./index-CGe98h1F.js";import"./typescript-BUhRLt6_.js";import"./index-DkVUR0Zr.js";import"./index-Dlr5RO3J.js";import"./aria-CJUiGiAi.js";import"./isEqual-DSHXihmN.js";import"./_arrayPush-DEr91YK_.js";import"./_initCloneObject-C1tWd4RX.js";import"./index-Da_LR9xi.js";import"./vnode-bMwTcSuf.js";import"./index-CTuphtO2.js";import"./refs-9EkVP661.js";import"./scroll-C-gHeSWq.js";const z={class:"picked"},C={key:0,class:"doc-note"},E=d({__name:"Basic",setup(u){const e=f([]);return(a,o)=>(n(),s(m,null,[i(r(v),{modelValue:e.value,"onUpdate:modelValue":o[0]||(o[0]=l=>e.value=l),"prompt-text":"Drop a product photo here"},null,8,["modelValue"]),F("ul",z,[(n(!0),s(m,null,P(e.value,l=>(n(),s("li",{key:l.uid??l.name},h(l.name)+" — "+h(l.status??"ready"),1))),128))]),e.value.length?g("",!0):(n(),s("p",C," Nothing picked yet. The component renders no file list of its own. "))],64))}}),T=k(E,[["__scopeId","data-v-7d028262"]]),K=`<template>
  <FileUpload v-model="files" prompt-text="Drop a product photo here" />
  <ul class="picked">
    <li v-for="file in files" :key="file.uid ?? file.name">
      {{ file.name }} — {{ file.status ?? 'ready' }}
    </li>
  </ul>
  <p v-if="!files.length" class="doc-note">
    Nothing picked yet. The component renders no file list of its own.
  </p>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FileUpload } from '@msflib/vue';
import type { UploadUserFile } from 'element-plus';

const files = ref<UploadUserFile[]>([]);
<\/script>

<style scoped>
.picked {
  margin: 1rem 0 0;
  padding-left: 1.1rem;
  font-size: 0.85rem;
}
</style>
`,N={key:0,class:"file-list"},R=["src"],j={class:"file-list__body"},M={class:"file-list__name"},D={key:0,class:"file-list__error"},I=["onClick"],S={key:1,class:"doc-note"},A=d({__name:"FilePreviewList",props:{files:{},removable:{type:Boolean,default:!1}},emits:["remove"],setup(u,{emit:e}){const a=e;return(o,l)=>o.files.length?(n(),s("ul",N,[(n(!0),s(m,null,P(o.files,t=>(n(),s("li",{key:t.uid??t.name,class:"file-list__item"},[t.url?(n(),s("img",{key:0,class:"file-list__thumb",src:t.url,alt:""},null,8,R)):g("",!0),F("div",j,[F("p",M,h(t.name),1),F("p",{class:$(["file-list__meta",{"file-list__meta--fail":t.status==="fail"}])},[w(h(t.status??"ready")+" ",1),t.size?(n(),s(m,{key:0},[w(" · "+h(Math.round(t.size/1024))+" KB",1)],64)):g("",!0)],2),t.status==="fail"?(n(),s("p",D,h(t.response),1)):g("",!0)]),o.removable?(n(),s("button",{key:1,class:"file-list__remove",onClick:_=>a("remove",t)}," Remove ",8,I)):g("",!0)]))),128))])):(n(),s("p",S,"No files picked yet."))}}),y=k(A,[["__scopeId","data-v-d82be8ee"]]),G=d({__name:"ButtonTrigger",setup(u){const e=f([]);return(a,o)=>(n(),s(m,null,[i(r(v),{modelValue:e.value,"onUpdate:modelValue":o[0]||(o[0]=l=>e.value=l),"trigger-element-type":"btn"},null,8,["modelValue"]),i(y,{files:e.value},null,8,["files"])],64))}}),W=`<template>
  <FileUpload v-model="files" trigger-element-type="btn" />
  <FilePreviewList :files="files" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FileUpload } from '@msflib/vue';
import type { UploadUserFile } from 'element-plus';
import FilePreviewList from '../../components/FilePreviewList.vue';

const files = ref<UploadUserFile[]>([]);
<\/script>
`,q=d({__name:"MultipleAndAccept",setup(u){const e=f([]),a=l=>l.type.startsWith("image/")?!0:(x.error(`${l.name} is not an image.`),!1),o=l=>{e.value=e.value.filter(t=>t.uid!==l.uid)};return(l,t)=>(n(),s(m,null,[i(r(v),{modelValue:e.value,"onUpdate:modelValue":t[0]||(t[0]=_=>e.value=_),multiple:"",drag:"",accept:"image/png, image/jpeg",validator:a,"prompt-text":"Drop one or more images here","file-types":"PNG, JPEG"},null,8,["modelValue"]),i(y,{files:e.value,removable:"",onRemove:o},null,8,["files"])],64))}}),J=`<template>
  <FileUpload
    v-model="files"
    multiple
    drag
    accept="image/png, image/jpeg"
    :validator="onlyImages"
    prompt-text="Drop one or more images here"
    file-types="PNG, JPEG"
  />
  <FilePreviewList :files="files" removable @remove="remove" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadRawFile, UploadUserFile } from 'element-plus';
import { FileUpload } from '@msflib/vue';
import FilePreviewList from '../../components/FilePreviewList.vue';

const files = ref<UploadUserFile[]>([]);

const onlyImages = (rawFile: UploadRawFile) => {
  if (rawFile.type.startsWith('image/')) return true;
  ElMessage.error(\`\${rawFile.name} is not an image.\`);
  return false;
};

const remove = (file: UploadUserFile) => {
  files.value = files.value.filter((picked) => picked.uid !== file.uid);
};
<\/script>
`,U=200,H=d({__name:"SizeLimit",setup(u){const e=f([]),a=o=>o.size/1024<=U?!0:(x.error(`${o.name} is over ${U}KB.`),!1);return(o,l)=>(n(),s(m,null,[i(r(v),{modelValue:e.value,"onUpdate:modelValue":l[0]||(l[0]=t=>e.value=t),"max-file-size":200,validator:a,"file-types":"any type","prompt-text":"Try a file larger than 200KB"},null,8,["modelValue"]),i(y,{files:e.value},null,8,["files"])],64))}}),O=`<template>
  <FileUpload
    v-model="files"
    :max-file-size="200"
    :validator="underSizeLimit"
    file-types="any type"
    prompt-text="Try a file larger than 200KB"
  />
  <FilePreviewList :files="files" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadRawFile, UploadUserFile } from 'element-plus';
import { FileUpload } from '@msflib/vue';
import FilePreviewList from '../../components/FilePreviewList.vue';

const limitKb = 200;
const files = ref<UploadUserFile[]>([]);

const underSizeLimit = (rawFile: UploadRawFile) => {
  if (rawFile.size / 1024 <= limitKb) return true;
  ElMessage.error(\`\${rawFile.name} is over \${limitKb}KB.\`);
  return false;
};
<\/script>
`,Q=d({__name:"FailingUpload",setup(u){const e=f([]);return(a,o)=>(n(),s(m,null,[i(r(v),{modelValue:e.value,"onUpdate:modelValue":o[0]||(o[0]=l=>e.value=l),action:"https://msflib-playground-demo.invalid/upload","prompt-text":"Pick anything - the upload cannot succeed"},null,8,["modelValue"]),i(y,{files:e.value},null,8,["files"])],64))}}),X=`<template>
  <FileUpload
    v-model="files"
    action="https://msflib-playground-demo.invalid/upload"
    prompt-text="Pick anything - the upload cannot succeed"
  />
  <FilePreviewList :files="files" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FileUpload } from '@msflib/vue';
import type { UploadUserFile } from 'element-plus';
import FilePreviewList from '../../components/FilePreviewList.vue';

const files = ref<UploadUserFile[]>([]);
<\/script>
`,Y={class:"doc-row",style:{"margin-top":"1rem"}},Z=d({__name:"ClearFiles",setup(u){const e=f([]),a=f(),o=()=>{e.value[0]&&a.value?.removeUploadedFile(e.value[0])};return(l,t)=>(n(),s(m,null,[i(r(v),{ref_key:"upload",ref:a,modelValue:e.value,"onUpdate:modelValue":t[0]||(t[0]=_=>e.value=_),multiple:"","prompt-text":"Pick a few files"},null,8,["modelValue"]),F("div",Y,[i(r(b),{disabled:!e.value.length,onClick:t[1]||(t[1]=_=>a.value?.clearFiles())},{default:p(()=>t[2]||(t[2]=[w(" clearFiles() ",-1)])),_:1,__:[2]},8,["disabled"]),i(r(b),{disabled:!e.value.length,onClick:o},{default:p(()=>t[3]||(t[3]=[w(" removeUploadedFile(first) ",-1)])),_:1,__:[3]},8,["disabled"])]),i(y,{files:e.value},null,8,["files"])],64))}}),ee=`<template>
  <FileUpload
    ref="upload"
    v-model="files"
    multiple
    prompt-text="Pick a few files"
  />
  <div class="doc-row" style="margin-top: 1rem">
    <el-button :disabled="!files.length" @click="upload?.clearFiles()">
      clearFiles()
    </el-button>
    <el-button :disabled="!files.length" @click="dropFirst">
      removeUploadedFile(first)
    </el-button>
  </div>
  <FilePreviewList :files="files" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElButton } from 'element-plus';
import type { UploadUserFile } from 'element-plus';
import { FileUpload } from '@msflib/vue';
import FilePreviewList from '../../components/FilePreviewList.vue';

const files = ref<UploadUserFile[]>([]);
const upload = ref<InstanceType<typeof FileUpload>>();

const dropFirst = () => {
  if (files.value[0]) upload.value?.removeUploadedFile(files.value[0]);
};
<\/script>
`,ge=d({__name:"FileUploadView",setup(u){return(e,a)=>(n(),B(L,{title:"FileUpload",eyebrow:"Form",imports:"FileUpload",lead:"An el-upload wrapper that can either post files to an endpoint or stay passive and hand them to you through its model. It mints object URLs for thumbnails, revokes them when a file leaves the list, and keeps failed uploads on the list instead of dropping them.",tags:["wraps el-upload","no built-in file list","validator hook"],api:r(V).FileUpload},{default:p(()=>[i(c,{title:"Basic usage",code:r(K),description:"With no action nothing reaches the network: auto-upload still runs, but against a no-op request, so the validator still fires and the picked files are yours to submit. The built-in file list is hidden too, so rendering the picked files is the caller's job - this demo prints their names.",tips:["Pick a file and nothing goes over the network.","Each picked file gets a url minted for it, which is what the other demos use for thumbnails."]},{default:p(()=>[i(T)]),_:1},8,["code"]),i(c,{title:"Button trigger",code:r(W),description:"trigger-element-type='btn' swaps the whole drop figure - image, prompt text and hint - for a single button, for forms where a large drop zone would be out of place.",tips:["prompt-text, file-types and max-file-size belong to the drop figure, so they are not rendered in this mode."]},{default:p(()=>[i(G)]),_:1},8,["code"]),i(c,{title:"Multiple files, filtered by type",code:r(J),description:"accept narrows the browse dialog, but a drag-and-drop ignores it, so the same restriction is repeated in validator - that is the check that actually rejects a file. Each row below is rendered from the model, with the thumbnail coming from the url the component minted.",tips:["Drag a PDF in and the validator rejects it with a message; the browse dialog never offers it in the first place.","Removing a row splices the parent array, and the component revokes that file’s object URL."]},{default:p(()=>[i(q)]),_:1},8,["code"]),i(c,{title:"Size limits",code:r(O),description:"max-file-size only writes the number into the hint under the button. Nothing enforces it, so the same limit is applied in validator; the two are deliberately separate so the hint can describe a server-side rule.",tips:["Pick a file over 200KB: the hint said the limit, but the rejection comes from the validator."]},{default:p(()=>[i(H)]),_:1},8,["code"]),i(c,{title:"A failing upload",code:r(X),description:"action points at a domain that can never resolve, so every pick fails for real rather than through a mock. The failed file stays on the list with status 'fail' and the network error in response, and keeps its thumbnail.",tips:["The card survives the failure - el-upload would have dropped it from the list.","The error text under the name is the response field, straight from the failed request."]},{default:p(()=>[i(Q)]),_:1},8,["code"]),i(c,{title:"Clearing files from the outside",code:r(ee),description:"The component exposes clearFiles() and removeUploadedFile(file) for parents that own a reset button or their own file list. clearFiles() also revokes every preview URL the component minted, which is the part a plain model reset would leak.",tips:["Pick several files, then compare the two buttons: one empties the list, the other drops a single file."]},{default:p(()=>[i(Z)]),_:1},8,["code"])]),_:1},8,["api"]))}});export{ge as default};
