const e=s=>`/docsite/vue/${s.replace(/^\//,"")}`,t=s=>e(`svgs/${s}`),a=e("vc-assets/images/info.png"),n=e("vc-assets/images/error.svg"),o=`// The playground is deployed under a sub-path on the MSFLib docs site, so
// anything the browser requests at runtime has to carry the build's base.
// Vite rewrites asset URLs it can see in templates and CSS, but not paths
// handed to a component as a prop.
// A leading slash is stripped: BASE_URL already ends in one, and \`//\` at the
// start of a URL is a protocol-relative host, not a path.
const asset = (path: string) =>
  \`\${import.meta.env.BASE_URL}\${path.replace(/^\\//, '')}\`;

export const icon = (name: string) => asset(\`svgs/\${name}\`);

export const emptyImage = asset('vc-assets/images/info.png');
export const errorImage = asset('vc-assets/images/error.svg');
`;export{o as a,a as b,n as e,t as i};
