import{c as a,a as j,j as e}from"./index-BZXuON0p.js";import{C as y,a as g,b as f,d as k}from"./card-Dfv2TBxZ.js";import{B as i}from"./badge-DhJUU7eb.js";import{U as v}from"./input-B_jc76zS.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=a("BookOpen",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=a("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=a("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=a("Star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);function S({id:c,name:d,code:h,category:t,rating:r,difficulty:s,teacher:l,language:o,backgroundColor:x="bg-[#428177]",basePath:m="/student/courses"}){const p=j(),u=n=>{if(!n)return"bg-gray-500";switch(n){case"مبتدئ":return"bg-green-500";case"متوسط":return"bg-yellow-500";case"متقدم":return"bg-red-500";default:return"bg-gray-500"}};return e.jsxs(y,{className:"cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group",onClick:()=>p(`${m}/${c}`),children:[e.jsxs("div",{className:`h-32 ${x} flex items-center justify-center relative`,children:[e.jsx("div",{className:"text-center text-white",children:e.jsx("h3",{className:"text-2xl font-bold",children:h})}),t&&e.jsx(i,{className:"absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white border-white/30",children:t}),s&&e.jsx(i,{className:`absolute top-2 left-2 ${u(s)} text-white border-none`,children:s})]}),e.jsx(g,{children:e.jsx(f,{className:"text-right group-hover:text-primary transition-colors",children:d})}),e.jsxs(k,{className:"space-y-3",children:[r!==void 0&&e.jsxs("div",{className:"flex items-center justify-end gap-1 text-sm",children:[e.jsx("span",{className:"font-medium",children:r.toFixed(1)}),e.jsx(N,{className:"h-4 w-4 fill-yellow-400 text-yellow-400"})]}),l&&e.jsxs("div",{className:"flex items-center justify-end gap-2 text-sm text-muted-foreground",children:[e.jsx("span",{children:l}),e.jsx(v,{className:"h-4 w-4"})]}),o&&e.jsxs("div",{className:"flex items-center justify-end gap-2 text-sm text-muted-foreground",children:[e.jsx("span",{children:o}),e.jsx(b,{className:"h-4 w-4"})]})]})]})}export{z as B,S as C,B as S};
