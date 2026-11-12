import{b as z,_ as k}from"./DemoBlock.vue_vue_type_script_setup_true_lang-39hEDRnl.js";import{_ as M,c as D}from"./ListSkeleton.vue_vue_type_style_index_0_scoped_705ed619_lang-Cs8_YQpO.js";import{d as g,k as R,e as f,o as c,b as u,y as b,f as C,c as w,u as o,B as _,E as L,t as p,l as A,z as P,w as i,a as n,L as m,s as U,g as v,F as S}from"./index-DVs0cwap.js";import{p as F}from"./useModalReopenToken-BOV0Xe1E.js";import{E as G}from"./index-Da_LR9xi.js";import{E as y}from"./index-CGe98h1F.js";import{_ as E}from"./EventLog.vue_vue_type_script_setup_true_lang-Bn-FpQG_.js";import{_ as I}from"./DocReadout.vue_vue_type_script_setup_true_lang-C1DjKJlg.js";import{b as J,ak as T,al as K,V as X,am as N,_ as j,u as H,w as Q,E as W}from"./index-DkVUR0Zr.js";import"./vnode-bMwTcSuf.js";import"./index-CTuphtO2.js";import"./aria-CJUiGiAi.js";import"./index-Dlr5RO3J.js";import"./refs-9EkVP661.js";import"./scroll-C-gHeSWq.js";const h={primary:"icon-primary",success:"icon-success",warning:"icon-warning",error:"icon-error",info:"icon-info"},V={[h.primary]:T,[h.success]:N,[h.warning]:X,[h.error]:K,[h.info]:T},Y=J({title:{type:String,default:""},subTitle:{type:String,default:""},icon:{type:String,values:["primary","success","warning","info","error"],default:"info"}}),Z=g({name:"ElResult"}),ee=g({...Z,props:Y,setup(l){const a=l,s=H("result"),d=R(()=>{const t=a.icon,e=t&&h[t]?h[t]:"icon-info",r=V[e]||V["icon-info"];return{class:e,component:r}});return(t,e)=>(c(),f("div",{class:_(o(s).b())},[u("div",{class:_(o(s).e("icon"))},[C(t.$slots,"icon",{},()=>[o(d).component?(c(),w(L(o(d).component),{key:0,class:_(o(d).class)},null,8,["class"])):b("v-if",!0)])],2),t.title||t.$slots.title?(c(),f("div",{key:0,class:_(o(s).e("title"))},[C(t.$slots,"title",{},()=>[u("p",null,p(t.title),1)])],2)):b("v-if",!0),t.subTitle||t.$slots["sub-title"]?(c(),f("div",{key:1,class:_(o(s).e("subtitle"))},[C(t.$slots,"sub-title",{},()=>[u("p",null,p(t.subTitle),1)])],2)):b("v-if",!0),t.$slots.extra?(c(),f("div",{key:2,class:_(o(s).e("extra"))},[C(t.$slots,"extra")],2)):b("v-if",!0)],2))}});var te=j(ee,[["__file","result.vue"]]);const oe=Q(te),ne={class:"dialog-footer"},B=g({__name:"ModalDialog",props:{modelValue:{type:Boolean,default:!1},size:{type:String,default:""},title:{type:String,default:""},footer:{type:Boolean,default:!1}},emits:["update:modelValue","modalClosed"],setup(l,{emit:a}){const s=l,d=a;F(A(s,"modelValue"));const t=$=>{d("update:modelValue",$)},e=()=>{d("update:modelValue",!1),d("modalClosed")},r=()=>{d("update:modelValue",!1)};return($,x)=>(c(),w(o(G),{"model-value":s.modelValue,title:l.title,width:l.size,"align-center":"",class:"rounded-edges","onUpdate:modelValue":t,onClose:e},P({default:i(()=>[C($.$slots,"default")]),_:2},[l.footer?{name:"footer",fn:i(()=>[u("span",ne,[n(o(y),{onClick:e},{default:i(()=>x[0]||(x[0]=[m("Cancel",-1)])),_:1,__:[0]}),n(o(y),{type:"primary",onClick:r},{default:i(()=>x[1]||(x[1]=[m("Confirm",-1)])),_:1,__:[1]})])]),key:"0"}:void 0]),1032,["model-value","title","width"]))}}),se={class:"msf-options-modal"},le={class:"msf-options-modal__title"},ae={class:"msf-options-modal__question"},ie={class:"msf-options-modal__actions"},de=g({__name:"OptionsModal",props:{question:{type:String,default:""},questionTitle:{type:String,default:""},primaryBtnText:{type:String,default:""},primaryBtnId:{type:String,default:""},secondaryBtnText:{type:String,default:""},secondaryBtnId:{type:String,default:""}},emits:["priBtnClicked","secBtnClicked"],setup(l){return(a,s)=>(c(),f("div",se,[u("p",le,p(l.questionTitle),1),u("p",ae,p(l.question),1),u("div",ie,[n(o(y),{id:l.secondaryBtnId,size:"large",onClick:s[0]||(s[0]=d=>a.$emit("secBtnClicked"))},{default:i(()=>[m(p(l.secondaryBtnText),1)]),_:1},8,["id"]),n(o(y),{id:l.primaryBtnId,type:"primary",size:"large",onClick:s[1]||(s[1]=d=>a.$emit("priBtnClicked"))},{default:i(()=>[m(p(l.primaryBtnText),1)]),_:1},8,["id"])])]))}}),q=M(de,[["__scopeId","data-v-60a58399"]]),re={class:"msf-success-note"},ce=g({__name:"SuccessNote",props:{successTitle:{type:String,required:!0,default:"Excellent!!"},successText:{type:String,required:!0},primaryBtnText:{type:String,required:!0},primaryBtnId:{type:String,default:""},secondaryBtnText:{type:String,default:""},secondaryBtnId:{type:String,default:""},link:{type:String,default:void 0},linkText:{type:String,default:void 0}},emits:["primaryBtnClicked","secondaryBtnClicked"],setup(l){return(a,s)=>{const d=U("nuxt-link");return c(),f("div",re,[n(o(oe),{class:"msf-success-note__result"},{icon:i(()=>[n(o(W),{class:"msf-success-note__icon"},{default:i(()=>[n(o(N))]),_:1})]),title:i(()=>[u("h3",null,p(l.successTitle),1)]),"sub-title":i(()=>[u("p",null,p(l.successText),1)]),extra:i(()=>[n(o(y),{id:l.primaryBtnId,type:"primary",size:"large",class:"msf-success-note__action",onClick:s[0]||(s[0]=t=>a.$emit("primaryBtnClicked"))},{default:i(()=>[m(p(l.primaryBtnText),1)]),_:1},8,["id"]),l.secondaryBtnText?(c(),w(o(y),{key:0,id:l.secondaryBtnId,link:"",type:"primary",class:"msf-success-note__secondary",onClick:s[1]||(s[1]=t=>a.$emit("secondaryBtnClicked"))},{default:i(()=>[m(p(l.secondaryBtnText),1)]),_:1},8,["id"])):b("",!0),l.link?(c(),w(d,{key:1,to:l.link,class:"msf-success-note__link"},{default:i(()=>[m(p(l.linkText),1)]),_:1},8,["to"])):b("",!0)]),_:1})])}}}),O=M(ce,[["__scopeId","data-v-932c34cd"]]),ue=g({__name:"Dialog",setup(l){const a=v(!1),s=v([]),d=()=>s.value.push("modalClosed");return(t,e)=>(c(),f(S,null,[n(o(y),{onClick:e[0]||(e[0]=r=>a.value=!0)},{default:i(()=>e[2]||(e[2]=[m("Open dialog",-1)])),_:1,__:[2]}),n(o(B),{modelValue:a.value,"onUpdate:modelValue":e[1]||(e[1]=r=>a.value=r),title:"Product details",onModalClosed:d},{default:i(()=>e[3]||(e[3]=[u("p",null,"Anything in the default slot becomes the dialog body.",-1),u("p",{class:"doc-note"},"Close it with the X, the overlay or Escape.",-1)])),_:1,__:[3]},8,["modelValue"]),n(E,{entries:s.value},null,8,["entries"])],64))}}),pe=`<template>
  <el-button @click="open = true">Open dialog</el-button>
  <ModalDialog v-model="open" title="Product details" @modal-closed="onClosed">
    <p>Anything in the default slot becomes the dialog body.</p>
    <p class="doc-note">Close it with the X, the overlay or Escape.</p>
  </ModalDialog>
  <EventLog :entries="log" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElButton } from 'element-plus';
import { ModalDialog } from '@msflib/vue';
import EventLog from '../../components/EventLog.vue';

const open = ref(false);
const log = ref<string[]>([]);

const onClosed = () => log.value.push('modalClosed');
<\/script>
`,me=g({__name:"DialogFooter",setup(l){const a=v(!1),s=v([]);return(d,t)=>(c(),f(S,null,[n(o(y),{onClick:t[0]||(t[0]=e=>a.value=!0)},{default:i(()=>t[3]||(t[3]=[m("Open with footer",-1)])),_:1,__:[3]}),n(o(B),{modelValue:a.value,"onUpdate:modelValue":t[1]||(t[1]=e=>a.value=e),title:"Discard changes?",size:"460px",footer:"",onModalClosed:t[2]||(t[2]=e=>s.value.push("modalClosed"))},{default:i(()=>t[4]||(t[4]=[u("p",null,"The built-in footer has a Cancel and a Confirm button.",-1)])),_:1,__:[4]},8,["modelValue"]),n(E,{entries:s.value},null,8,["entries"])],64))}}),fe=`<template>
  <el-button @click="open = true">Open with footer</el-button>
  <ModalDialog
    v-model="open"
    title="Discard changes?"
    size="460px"
    footer
    @modal-closed="log.push('modalClosed')"
  >
    <p>The built-in footer has a Cancel and a Confirm button.</p>
  </ModalDialog>
  <EventLog :entries="log" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElButton } from 'element-plus';
import { ModalDialog } from '@msflib/vue';
import EventLog from '../../components/EventLog.vue';

const open = ref(false);
const log = ref<string[]>([]);
<\/script>
`,ge=g({__name:"OptionsInDialog",setup(l){const a=v(!1),s=v("nothing decided yet"),d=t=>{s.value=t,a.value=!1};return(t,e)=>(c(),f(S,null,[n(o(y),{type:"danger",plain:"",onClick:e[0]||(e[0]=r=>a.value=!0)},{default:i(()=>e[4]||(e[4]=[m("Delete product",-1)])),_:1,__:[4]}),n(o(B),{modelValue:a.value,"onUpdate:modelValue":e[3]||(e[3]=r=>a.value=r),size:"420px"},{default:i(()=>[n(o(q),{"question-title":"Delete German Juice?",question:"This cannot be undone, and its stock history goes with it.","primary-btn-text":"Delete","secondary-btn-text":"Keep it",onPriBtnClicked:e[1]||(e[1]=r=>d("deleted")),onSecBtnClicked:e[2]||(e[2]=r=>d("kept"))})]),_:1},8,["modelValue"]),n(I,{label:"decision"},{default:i(()=>[m(p(s.value),1)]),_:1})],64))}}),ye=`<template>
  <el-button type="danger" plain @click="open = true">Delete product</el-button>
  <ModalDialog v-model="open" size="420px">
    <OptionsModal
      question-title="Delete German Juice?"
      question="This cannot be undone, and its stock history goes with it."
      primary-btn-text="Delete"
      secondary-btn-text="Keep it"
      @pri-btn-clicked="decide('deleted')"
      @sec-btn-clicked="decide('kept')"
    />
  </ModalDialog>
  <DocReadout label="decision">{{ decision }}</DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElButton } from 'element-plus';
import { ModalDialog, OptionsModal } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';

const open = ref(false);
const decision = ref('nothing decided yet');

const decide = (outcome: string) => {
  decision.value = outcome;
  open.value = false;
};
<\/script>
`,ve=g({__name:"SuccessInDialog",setup(l){const a=v(!1),s=v("nothing chosen yet"),d=t=>{s.value=t,a.value=!1};return(t,e)=>(c(),f(S,null,[n(o(y),{type:"primary",onClick:e[0]||(e[0]=r=>a.value=!0)},{default:i(()=>e[4]||(e[4]=[m("Save product",-1)])),_:1,__:[4]}),n(o(B),{modelValue:a.value,"onUpdate:modelValue":e[3]||(e[3]=r=>a.value=r),size:"420px"},{default:i(()=>[n(o(O),{"success-title":"Saved","success-text":"German Juice was added to the catalogue.","primary-btn-text":"Add another","secondary-btn-text":"Back to the list",onPrimaryBtnClicked:e[1]||(e[1]=r=>d("add another")),onSecondaryBtnClicked:e[2]||(e[2]=r=>d("back to list"))})]),_:1},8,["modelValue"]),n(I,{label:"chosen"},{default:i(()=>[m(p(s.value),1)]),_:1})],64))}}),he=`<template>
  <el-button type="primary" @click="open = true">Save product</el-button>
  <ModalDialog v-model="open" size="420px">
    <SuccessNote
      success-title="Saved"
      success-text="German Juice was added to the catalogue."
      primary-btn-text="Add another"
      secondary-btn-text="Back to the list"
      @primary-btn-clicked="choose('add another')"
      @secondary-btn-clicked="choose('back to list')"
    />
  </ModalDialog>
  <DocReadout label="chosen">{{ chosen }}</DocReadout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElButton } from 'element-plus';
import { ModalDialog, SuccessNote } from '@msflib/vue';
import DocReadout from '../../components/DocReadout.vue';

const open = ref(false);
const chosen = ref('nothing chosen yet');

const choose = (what: string) => {
  chosen.value = what;
  open.value = false;
};
<\/script>
`,_e={class:"panels"},be={class:"doc-panel"},ke={class:"doc-panel"},Ce=g({__name:"Standalone",setup(l){return(a,s)=>(c(),f("div",_e,[u("div",be,[n(o(q),{"question-title":"Leave this page?",question:"Unsaved changes will be lost.","primary-btn-text":"Leave","secondary-btn-text":"Stay"})]),u("div",ke,[n(o(O),{"success-title":"All done","success-text":"The import finished with no errors.","primary-btn-text":"View products"})])]))}}),we=M(Ce,[["__scopeId","data-v-d78948c4"]]),xe=`<template>
  <div class="panels">
    <div class="doc-panel">
      <OptionsModal
        question-title="Leave this page?"
        question="Unsaved changes will be lost."
        primary-btn-text="Leave"
        secondary-btn-text="Stay"
      />
    </div>
    <div class="doc-panel">
      <SuccessNote
        success-title="All done"
        success-text="The import finished with no errors."
        primary-btn-text="View products"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { OptionsModal, SuccessNote } from '@msflib/vue';
<\/script>

<style scoped>
.panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.doc-panel {
  border: 1px solid var(--doc-border);
}
</style>
`,Ae=g({__name:"ModalsView",setup(l){const a=[{title:"ModalDialog",anchor:"modal-dialog",api:D.ModalDialog},{title:"OptionsModal",anchor:"options-modal",api:D.OptionsModal},{title:"SuccessNote",anchor:"success-note",api:D.SuccessNote}];return(s,d)=>(c(),w(z,{title:"Modals",eyebrow:"Feedback",imports:"ModalDialog, OptionsModal, SuccessNote",lead:"ModalDialog is the shell - a thin el-dialog wrapper with an optional footer. OptionsModal and SuccessNote are the two panels that usually go inside it: a question with two answers, and a result with a way onward.",tags:["dialog shell","two ready-made panels"],"api-sections":a},{default:i(()=>[n(k,{title:"A dialog",code:o(pe),description:"v-model owns whether the dialog is open and the default slot is its body. modalClosed fires on every dismissal - close button, overlay, Escape - which is the hook for discarding a draft.",tips:["Dismiss it three different ways and watch the log: all three report the same event.","The dialog is centred and takes the panel radius from the library tokens."]},{default:i(()=>[n(ue)]),_:1},8,["code"]),n(k,{title:"The built-in footer",code:o(fe),description:"footer adds a Cancel / Confirm pair. Cancel dismisses, which means modalClosed; Confirm only closes the dialog, so a confirm handler belongs on the model rather than on an event.",tips:["Compare the two buttons in the log: only Cancel reports modalClosed.","size is the el-dialog width, so a short confirmation does not need a full-width dialog."]},{default:i(()=>[n(me)]),_:1},8,["code"]),n(k,{title:"A question inside a dialog",code:o(ye),description:"OptionsModal is only the question and its two buttons, so it has no opinion about being in a dialog. Putting it in one gives the usual destructive-action flow: the handlers decide and close.",tips:["The primary button sits on the right and carries the emphasis, so the safer choice reads first.","Both buttons take an id, which is what a test or an analytics hook attaches to."]},{default:i(()=>[n(ge)]),_:1},8,["code"]),n(k,{title:"A result inside a dialog",code:o(he),description:"SuccessNote is the other half of that flow: an el-result with a filled primary action and an optional link-style secondary one, for 'saved - what next?'.",tips:["Leaving secondary-btn-text out renders a single action.","The link / link-text props render a nuxt-link, so they only resolve inside a Nuxt app - outside one, rendering SuccessNote at all logs an unresolved-component warning."]},{default:i(()=>[n(ve)]),_:1},8,["code"]),n(k,{title:"Both panels without a dialog",code:o(xe),description:"Neither panel is tied to a dialog: dropped straight onto a page they work as an inline confirmation or an empty-ish result panel.",tips:["Nothing here is positioned or overlaid - the surrounding container decides the width."]},{default:i(()=>[n(we)]),_:1},8,["code"])]),_:1}))}});export{Ae as default};
