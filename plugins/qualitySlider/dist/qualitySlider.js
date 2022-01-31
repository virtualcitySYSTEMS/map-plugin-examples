var t={1698:(t,e,r)=>{r.d(e,{Z:()=>g});var n=function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"quality-slider-container vcm-border-dye02",attrs:{title:"Anzeigequalität"}},[e("QualitySliderComponent")],1)};n._withStripped=!0;var o=function(){var t=this,e=t.$createElement;return(t._self._c||e)("Slider",{style:{margin:"1rem 1rem 0"},attrs:{min:0,max:2,"process-class":"vcm-base-splash","slider-class":"vcm-btn-base-dye02 vcm-slider-btn","bg-class":"vcm-base-dye01 vcm-slider-base",piecewise:!0,"piecewise-label":!0,tooltip:!1,data:t.viewModelData,formatter:t.labelFormatter},model:{value:t.viewModel,callback:function(e){t.viewModel=e},expression:"viewModel"}})};o._withStripped=!0;r(9792),r(380),r(1012),r(5194);function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function a(t){return function(t){if(Array.isArray(t))return i(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return i(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?i(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}const s=JSON.parse('{"default":2,"viewModels":[{"label":"tief","model":{"sse":32,"fxaa":false,"fog":{"enabled":true,"density":0.002,"screenSpaceErrorFactor":24},"resolutionScale":0.5,"layerSSEFactor":2}},{"label":"niedrig","model":{"sse":4,"fxaa":false,"fog":{"enabled":true,"density":0.0009,"screenSpaceErrorFactor":6},"resolutionScale":0.9,"layerSSEFactor":2}},{"label":"mittel","model":{"sse":2.333,"fxaa":false,"fog":{"enabled":true,"density":0.0005,"screenSpaceErrorFactor":4},"resolutionScale":1,"layerSSEFactor":1.1}},{"label":"hoch","model":{"sse":1.333,"fxaa":true,"fog":{"enabled":false,"density":0,"screenSpaceErrorFactor":0},"resolutionScale":1,"layerSSEFactor":0.5}},{"label":"ultra","model":{"sse":1.001,"fxaa":true,"fog":{"enabled":false,"density":0,"screenSpaceErrorFactor":0},"resolutionScale":1,"layerSSEFactor":0.5}}]}');const u=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.default=e.default,this.viewModels=e.viewModels}var e,r,n;return e=t,n=[{key:"getInstance",value:function(e){return new t(Object.assign(s,e))}}],(r=null)&&c(e.prototype,r),n&&c(e,n),t}(),l={name:"QualitySlider",created:function(){this.viewModels=u.getInstance().viewModels,this.localViewModel=this.$store.state.qualitySlider.currentViewModel,this.widget=this.getWidget("vcs.vcm.widgets.DisplayQuality")},data:function(){return{localViewModel:1,viewModels:[]}},computed:{viewModel:{get:function(){return this.localViewModel},set:function(t){var e=this;this.localViewModel=t,this.$store.commit("qualitySlider/setCurrentViewModel",t);var r=this.viewModels[t].model;Object.assign(this.widget.viewModel,r),this.widget.layers.forEach((function(t){t.sse=t.defaultSse*r.layerSSEFactor,e.widget.setLayerQuality(t.layerName)})),this.widget.setQuality(!1)}},viewModelData:function(){return a(this.viewModels.keys())}},methods:{labelFormatter:function(t){var e=this.viewModels[t];return e?e.label:null}}};r(1182);function f(t,e,r,n,o,i,a,c){var s,u="function"==typeof t?t.options:t;if(e&&(u.render=e,u.staticRenderFns=r,u._compiled=!0),n&&(u.functional=!0),i&&(u._scopeId="data-v-"+i),a?(s=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),o&&o.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},u._ssrRegister=s):o&&(s=c?function(){o.call(this,(u.functional?this.parent:this).$root.$options.shadowRoot)}:o),s)if(u.functional){u._injectStyles=s;var l=u.render;u.render=function(t,e){return s.call(e),l(t,e)}}else{var f=u.beforeCreate;u.beforeCreate=f?[].concat(f,s):[s]}return{exports:t,options:u}}var p=f(l,o,[],!1,null,"0cb9f294",null);p.options.__file="src/qualitySliderComponent.vue";const d={name:"MapComponent",components:{QualitySliderComponent:p.exports}};r(1434);var v=f(d,n,[],!1,null,"ecb1b24c",null);v.options.__file="src/mapComponent.vue";const y=v.exports;var h={state:{currentViewModel:1},mutations:{setCurrentViewModel:function(t,e){t.currentViewModel=e}}};const g={version:"2.0.0",postInitialize:function(t){h.state.currentViewModel=u.getInstance(t).default},registerUiPlugin:function(){return{name:"qualitySlider",mapComponent:y,store:h}}}},4948:t=>{t.exports=function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t}},4339:(t,e,r)=>{var n=r(842);t.exports=function(t){if(!n(t)&&null!==t)throw TypeError("Can't set "+String(t)+" as a prototype");return t}},4093:(t,e,r)=>{var n=r(2735),o=r(3952),i=r(3711),a=n("unscopables"),c=Array.prototype;null==c[a]&&i.f(c,a,{configurable:!0,value:o(null)}),t.exports=function(t){c[a][t]=!0}},5959:(t,e,r)=>{var n=r(842);t.exports=function(t){if(!n(t))throw TypeError(String(t)+" is not an object");return t}},8992:(t,e,r)=>{var n=r(57).forEach,o=r(6247),i=r(7807),a=o("forEach"),c=i("forEach");t.exports=a&&c?[].forEach:function(t){return n(this,t,arguments.length>1?arguments[1]:void 0)}},4543:(t,e,r)=>{var n=r(2088),o=r(8373),i=r(9180),a=function(t){return function(e,r,a){var c,s=n(e),u=o(s.length),l=i(a,u);if(t&&r!=r){for(;u>l;)if((c=s[l++])!=c)return!0}else for(;u>l;l++)if((t||l in s)&&s[l]===r)return t||l||0;return!t&&-1}};t.exports={includes:a(!0),indexOf:a(!1)}},57:(t,e,r)=>{var n=r(3390),o=r(3260),i=r(3780),a=r(8373),c=r(5783),s=[].push,u=function(t){var e=1==t,r=2==t,u=3==t,l=4==t,f=6==t,p=7==t,d=5==t||f;return function(v,y,h,g){for(var m,b,S=i(v),x=o(S),w=n(y,h,3),O=a(x.length),j=0,E=g||c,M=e?E(v,O):r||p?E(v,0):void 0;O>j;j++)if((d||j in x)&&(b=w(m=x[j],j,S),t))if(e)M[j]=b;else if(b)switch(t){case 3:return!0;case 5:return m;case 6:return j;case 2:s.call(M,m)}else switch(t){case 4:return!1;case 7:s.call(M,m)}return f?-1:u||l?l:M}};t.exports={forEach:u(0),map:u(1),filter:u(2),some:u(3),every:u(4),find:u(5),findIndex:u(6),filterOut:u(7)}},6247:(t,e,r)=>{var n=r(9958);t.exports=function(t,e){var r=[][t];return!!r&&n((function(){r.call(null,e||function(){throw 1},1)}))}},7807:(t,e,r)=>{var n=r(6442),o=r(9958),i=r(340),a=Object.defineProperty,c={},s=function(t){throw t};t.exports=function(t,e){if(i(c,t))return c[t];e||(e={});var r=[][t],u=!!i(e,"ACCESSORS")&&e.ACCESSORS,l=i(e,0)?e[0]:s,f=i(e,1)?e[1]:void 0;return c[t]=!!r&&!o((function(){if(u&&!n)return!0;var t={length:-1};u?a(t,1,{enumerable:!0,get:s}):t[1]=1,r.call(t,l,f)}))}},5783:(t,e,r)=>{var n=r(842),o=r(9155),i=r(2735)("species");t.exports=function(t,e){var r;return o(t)&&("function"!=typeof(r=t.constructor)||r!==Array&&!o(r.prototype)?n(r)&&null===(r=r[i])&&(r=void 0):r=void 0),new(void 0===r?Array:r)(0===e?0:e)}},2345:t=>{var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},5555:(t,e,r)=>{var n=r(3880),o=r(2345),i=r(2735)("toStringTag"),a="Arguments"==o(function(){return arguments}());t.exports=n?o:function(t){var e,r,n;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),i))?r:a?o(e):"Object"==(n=o(e))&&"function"==typeof e.callee?"Arguments":n}},1706:(t,e,r)=>{var n=r(340),o=r(659),i=r(1677),a=r(3711);t.exports=function(t,e){for(var r=o(e),c=a.f,s=i.f,u=0;u<r.length;u++){var l=r[u];n(t,l)||c(t,l,s(e,l))}}},1337:(t,e,r)=>{var n=r(9958);t.exports=!n((function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype}))},3648:(t,e,r)=>{var n=r(3138).IteratorPrototype,o=r(3952),i=r(541),a=r(5824),c=r(6283),s=function(){return this};t.exports=function(t,e,r){var u=e+" Iterator";return t.prototype=o(n,{next:i(1,r)}),a(t,u,!1,!0),c[u]=s,t}},4771:(t,e,r)=>{var n=r(6442),o=r(3711),i=r(541);t.exports=n?function(t,e,r){return o.f(t,e,i(1,r))}:function(t,e,r){return t[e]=r,t}},541:t=>{t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},6834:(t,e,r)=>{var n=r(8660),o=r(3648),i=r(7510),a=r(1562),c=r(5824),s=r(4771),u=r(2356),l=r(2735),f=r(1122),p=r(6283),d=r(3138),v=d.IteratorPrototype,y=d.BUGGY_SAFARI_ITERATORS,h=l("iterator"),g="keys",m="values",b="entries",S=function(){return this};t.exports=function(t,e,r,l,d,x,w){o(r,e,l);var O,j,E,M=function(t){if(t===d&&L)return L;if(!y&&t in C)return C[t];switch(t){case g:case m:case b:return function(){return new r(this,t)}}return function(){return new r(this)}},_=e+" Iterator",T=!1,C=t.prototype,A=C[h]||C["@@iterator"]||d&&C[d],L=!y&&A||M(d),P="Array"==e&&C.entries||A;if(P&&(O=i(P.call(new t)),v!==Object.prototype&&O.next&&(f||i(O)===v||(a?a(O,v):"function"!=typeof O[h]&&s(O,h,S)),c(O,_,!0,!0),f&&(p[_]=S))),d==m&&A&&A.name!==m&&(T=!0,L=function(){return A.call(this)}),f&&!w||C[h]===L||s(C,h,L),p[e]=L,d)if(j={values:M(m),keys:x?L:M(g),entries:M(b)},w)for(E in j)(y||T||!(E in C))&&u(C,E,j[E]);else n({target:e,proto:!0,forced:y||T},j);return j}},6442:(t,e,r)=>{var n=r(9958);t.exports=!n((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}))},554:(t,e,r)=>{var n=r(5826),o=r(842),i=n.document,a=o(i)&&o(i.createElement);t.exports=function(t){return a?i.createElement(t):{}}},4391:t=>{t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},7138:t=>{t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},8660:(t,e,r)=>{var n=r(5826),o=r(1677).f,i=r(4771),a=r(2356),c=r(2623),s=r(1706),u=r(9612);t.exports=function(t,e){var r,l,f,p,d,v=t.target,y=t.global,h=t.stat;if(r=y?n:h?n[v]||c(v,{}):(n[v]||{}).prototype)for(l in e){if(p=e[l],f=t.noTargetGet?(d=o(r,l))&&d.value:r[l],!u(y?l:v+(h?".":"#")+l,t.forced)&&void 0!==f){if(typeof p==typeof f)continue;s(p,f)}(t.sham||f&&f.sham)&&i(p,"sham",!0),a(r,l,p,t)}}},9958:t=>{t.exports=function(t){try{return!!t()}catch(t){return!0}}},3390:(t,e,r)=>{var n=r(4948);t.exports=function(t,e,r){if(n(t),void 0===e)return t;switch(r){case 0:return function(){return t.call(e)};case 1:return function(r){return t.call(e,r)};case 2:return function(r,n){return t.call(e,r,n)};case 3:return function(r,n,o){return t.call(e,r,n,o)}}return function(){return t.apply(e,arguments)}}},460:(t,e,r)=>{var n=r(8238),o=r(5826),i=function(t){return"function"==typeof t?t:void 0};t.exports=function(t,e){return arguments.length<2?i(n[t])||i(o[t]):n[t]&&n[t][e]||o[t]&&o[t][e]}},5826:(t,e,r)=>{var n=function(t){return t&&t.Math==Math&&t};t.exports=n("object"==typeof globalThis&&globalThis)||n("object"==typeof window&&window)||n("object"==typeof self&&self)||n("object"==typeof r.g&&r.g)||function(){return this}()||Function("return this")()},340:t=>{var e={}.hasOwnProperty;t.exports=function(t,r){return e.call(t,r)}},6091:t=>{t.exports={}},9883:(t,e,r)=>{var n=r(460);t.exports=n("document","documentElement")},6294:(t,e,r)=>{var n=r(6442),o=r(9958),i=r(554);t.exports=!n&&!o((function(){return 7!=Object.defineProperty(i("div"),"a",{get:function(){return 7}}).a}))},3260:(t,e,r)=>{var n=r(9958),o=r(2345),i="".split;t.exports=n((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==o(t)?i.call(t,""):Object(t)}:Object},4098:(t,e,r)=>{var n=r(499),o=Function.toString;"function"!=typeof n.inspectSource&&(n.inspectSource=function(t){return o.call(t)}),t.exports=n.inspectSource},224:(t,e,r)=>{var n,o,i,a=r(5169),c=r(5826),s=r(842),u=r(4771),l=r(340),f=r(499),p=r(5682),d=r(6091),v=c.WeakMap;if(a){var y=f.state||(f.state=new v),h=y.get,g=y.has,m=y.set;n=function(t,e){return e.facade=t,m.call(y,t,e),e},o=function(t){return h.call(y,t)||{}},i=function(t){return g.call(y,t)}}else{var b=p("state");d[b]=!0,n=function(t,e){return e.facade=t,u(t,b,e),e},o=function(t){return l(t,b)?t[b]:{}},i=function(t){return l(t,b)}}t.exports={set:n,get:o,has:i,enforce:function(t){return i(t)?o(t):n(t,{})},getterFor:function(t){return function(e){var r;if(!s(e)||(r=o(e)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return r}}}},9155:(t,e,r)=>{var n=r(2345);t.exports=Array.isArray||function(t){return"Array"==n(t)}},9612:(t,e,r)=>{var n=r(9958),o=/#|\.prototype\./,i=function(t,e){var r=c[a(t)];return r==u||r!=s&&("function"==typeof e?n(e):!!e)},a=i.normalize=function(t){return String(t).replace(o,".").toLowerCase()},c=i.data={},s=i.NATIVE="N",u=i.POLYFILL="P";t.exports=i},842:t=>{t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},1122:t=>{t.exports=!1},3138:(t,e,r)=>{var n,o,i,a=r(9958),c=r(7510),s=r(4771),u=r(340),l=r(2735),f=r(1122),p=l("iterator"),d=!1;[].keys&&("next"in(i=[].keys())?(o=c(c(i)))!==Object.prototype&&(n=o):d=!0);var v=null==n||a((function(){var t={};return n[p].call(t)!==t}));v&&(n={}),f&&!v||u(n,p)||s(n,p,(function(){return this})),t.exports={IteratorPrototype:n,BUGGY_SAFARI_ITERATORS:d}},6283:t=>{t.exports={}},3202:(t,e,r)=>{var n=r(9958);t.exports=!!Object.getOwnPropertySymbols&&!n((function(){return!String(Symbol())}))},5169:(t,e,r)=>{var n=r(5826),o=r(4098),i=n.WeakMap;t.exports="function"==typeof i&&/native code/.test(o(i))},3952:(t,e,r)=>{var n,o=r(5959),i=r(769),a=r(7138),c=r(6091),s=r(9883),u=r(554),l=r(5682),f=l("IE_PROTO"),p=function(){},d=function(t){return"<script>"+t+"</"+"script>"},v=function(){try{n=document.domain&&new ActiveXObject("htmlfile")}catch(t){}var t,e;v=n?function(t){t.write(d("")),t.close();var e=t.parentWindow.Object;return t=null,e}(n):((e=u("iframe")).style.display="none",s.appendChild(e),e.src=String("javascript:"),(t=e.contentWindow.document).open(),t.write(d("document.F=Object")),t.close(),t.F);for(var r=a.length;r--;)delete v.prototype[a[r]];return v()};c[f]=!0,t.exports=Object.create||function(t,e){var r;return null!==t?(p.prototype=o(t),r=new p,p.prototype=null,r[f]=t):r=v(),void 0===e?r:i(r,e)}},769:(t,e,r)=>{var n=r(6442),o=r(3711),i=r(5959),a=r(5334);t.exports=n?Object.defineProperties:function(t,e){i(t);for(var r,n=a(e),c=n.length,s=0;c>s;)o.f(t,r=n[s++],e[r]);return t}},3711:(t,e,r)=>{var n=r(6442),o=r(6294),i=r(5959),a=r(4341),c=Object.defineProperty;e.f=n?c:function(t,e,r){if(i(t),e=a(e,!0),i(r),o)try{return c(t,e,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported");return"value"in r&&(t[e]=r.value),t}},1677:(t,e,r)=>{var n=r(6442),o=r(4806),i=r(541),a=r(2088),c=r(4341),s=r(340),u=r(6294),l=Object.getOwnPropertyDescriptor;e.f=n?l:function(t,e){if(t=a(t),e=c(e,!0),u)try{return l(t,e)}catch(t){}if(s(t,e))return i(!o.f.call(t,e),t[e])}},7355:(t,e,r)=>{var n=r(2378),o=r(7138).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return n(t,o)}},6638:(t,e)=>{e.f=Object.getOwnPropertySymbols},7510:(t,e,r)=>{var n=r(340),o=r(3780),i=r(5682),a=r(1337),c=i("IE_PROTO"),s=Object.prototype;t.exports=a?Object.getPrototypeOf:function(t){return t=o(t),n(t,c)?t[c]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?s:null}},2378:(t,e,r)=>{var n=r(340),o=r(2088),i=r(4543).indexOf,a=r(6091);t.exports=function(t,e){var r,c=o(t),s=0,u=[];for(r in c)!n(a,r)&&n(c,r)&&u.push(r);for(;e.length>s;)n(c,r=e[s++])&&(~i(u,r)||u.push(r));return u}},5334:(t,e,r)=>{var n=r(2378),o=r(7138);t.exports=Object.keys||function(t){return n(t,o)}},4806:(t,e)=>{var r={}.propertyIsEnumerable,n=Object.getOwnPropertyDescriptor,o=n&&!r.call({1:2},1);e.f=o?function(t){var e=n(this,t);return!!e&&e.enumerable}:r},1562:(t,e,r)=>{var n=r(5959),o=r(4339);t.exports=Object.setPrototypeOf||("__proto__"in{}?function(){var t,e=!1,r={};try{(t=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(r,[]),e=r instanceof Array}catch(t){}return function(r,i){return n(r),o(i),e?t.call(r,i):r.__proto__=i,r}}():void 0)},7413:(t,e,r)=>{var n=r(3880),o=r(5555);t.exports=n?{}.toString:function(){return"[object "+o(this)+"]"}},659:(t,e,r)=>{var n=r(460),o=r(7355),i=r(6638),a=r(5959);t.exports=n("Reflect","ownKeys")||function(t){var e=o.f(a(t)),r=i.f;return r?e.concat(r(t)):e}},8238:(t,e,r)=>{var n=r(5826);t.exports=n},2356:(t,e,r)=>{var n=r(5826),o=r(4771),i=r(340),a=r(2623),c=r(4098),s=r(224),u=s.get,l=s.enforce,f=String(String).split("String");(t.exports=function(t,e,r,c){var s,u=!!c&&!!c.unsafe,p=!!c&&!!c.enumerable,d=!!c&&!!c.noTargetGet;"function"==typeof r&&("string"!=typeof e||i(r,"name")||o(r,"name",e),(s=l(r)).source||(s.source=f.join("string"==typeof e?e:""))),t!==n?(u?!d&&t[e]&&(p=!0):delete t[e],p?t[e]=r:o(t,e,r)):p?t[e]=r:a(e,r)})(Function.prototype,"toString",(function(){return"function"==typeof this&&u(this).source||c(this)}))},1041:t=>{t.exports=function(t){if(null==t)throw TypeError("Can't call method on "+t);return t}},2623:(t,e,r)=>{var n=r(5826),o=r(4771);t.exports=function(t,e){try{o(n,t,e)}catch(r){n[t]=e}return e}},5824:(t,e,r)=>{var n=r(3711).f,o=r(340),i=r(2735)("toStringTag");t.exports=function(t,e,r){t&&!o(t=r?t:t.prototype,i)&&n(t,i,{configurable:!0,value:e})}},5682:(t,e,r)=>{var n=r(8306),o=r(2145),i=n("keys");t.exports=function(t){return i[t]||(i[t]=o(t))}},499:(t,e,r)=>{var n=r(5826),o=r(2623),i="__core-js_shared__",a=n[i]||o(i,{});t.exports=a},8306:(t,e,r)=>{var n=r(1122),o=r(499);(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.8.3",mode:n?"pure":"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"})},9180:(t,e,r)=>{var n=r(3664),o=Math.max,i=Math.min;t.exports=function(t,e){var r=n(t);return r<0?o(r+e,0):i(r,e)}},2088:(t,e,r)=>{var n=r(3260),o=r(1041);t.exports=function(t){return n(o(t))}},3664:t=>{var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},8373:(t,e,r)=>{var n=r(3664),o=Math.min;t.exports=function(t){return t>0?o(n(t),9007199254740991):0}},3780:(t,e,r)=>{var n=r(1041);t.exports=function(t){return Object(n(t))}},4341:(t,e,r)=>{var n=r(842);t.exports=function(t,e){if(!n(t))return t;var r,o;if(e&&"function"==typeof(r=t.toString)&&!n(o=r.call(t)))return o;if("function"==typeof(r=t.valueOf)&&!n(o=r.call(t)))return o;if(!e&&"function"==typeof(r=t.toString)&&!n(o=r.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},3880:(t,e,r)=>{var n={};n[r(2735)("toStringTag")]="z",t.exports="[object z]"===String(n)},2145:t=>{var e=0,r=Math.random();t.exports=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++e+r).toString(36)}},8289:(t,e,r)=>{var n=r(3202);t.exports=n&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},2735:(t,e,r)=>{var n=r(5826),o=r(8306),i=r(340),a=r(2145),c=r(3202),s=r(8289),u=o("wks"),l=n.Symbol,f=s?l:l&&l.withoutSetter||a;t.exports=function(t){return i(u,t)||(c&&i(l,t)?u[t]=l[t]:u[t]=f("Symbol."+t)),u[t]}},9792:(t,e,r)=>{var n=r(8660),o=r(8992);n({target:"Array",proto:!0,forced:[].forEach!=o},{forEach:o})},1529:(t,e,r)=>{var n=r(2088),o=r(4093),i=r(6283),a=r(224),c=r(6834),s="Array Iterator",u=a.set,l=a.getterFor(s);t.exports=c(Array,"Array",(function(t,e){u(this,{type:s,target:n(t),index:0,kind:e})}),(function(){var t=l(this),e=t.target,r=t.kind,n=t.index++;return!e||n>=e.length?(t.target=void 0,{value:void 0,done:!0}):"keys"==r?{value:n,done:!1}:"values"==r?{value:e[n],done:!1}:{value:[n,e[n]],done:!1}}),"values"),i.Arguments=i.Array,o("keys"),o("values"),o("entries")},380:(t,e,r)=>{var n=r(3880),o=r(2356),i=r(7413);n||o(Object.prototype,"toString",i,{unsafe:!0})},1012:(t,e,r)=>{var n=r(5826),o=r(4391),i=r(8992),a=r(4771);for(var c in o){var s=n[c],u=s&&s.prototype;if(u&&u.forEach!==i)try{a(u,"forEach",i)}catch(t){u.forEach=i}}},5194:(t,e,r)=>{var n=r(5826),o=r(4391),i=r(1529),a=r(4771),c=r(2735),s=c("iterator"),u=c("toStringTag"),l=i.values;for(var f in o){var p=n[f],d=p&&p.prototype;if(d){if(d[s]!==l)try{a(d,s,l)}catch(t){d[s]=l}if(d[u]||a(d,u,f),o[f])for(var v in i)if(d[v]!==i[v])try{a(d,v,i[v])}catch(t){d[v]=i[v]}}}},1147:(t,e,r)=>{(e=r(811)(!1)).push([t.id,"\n.quality-slider-container[data-v-ecb1b24c] {\n  position: absolute;\n  bottom: 1.25rem;\n  width: 16rem;\n  right: .25rem;\n  z-index: 10;\n  height: 3.5rem;\n  background: rgba(238, 238, 238, 0.34);\n}\n",""]),t.exports=e},2666:(t,e,r)=>{(e=r(811)(!1)).push([t.id,"\n.slider[data-v-0cb9f294] {\n  margin: 1rem 1rem 0;\n}\n",""]),t.exports=e},811:t=>{t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var r=function(t,e){var r=t[1]||"",n=t[3];if(!n)return r;if(e&&"function"==typeof btoa){var o=(a=n,c=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),s="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(c),"/*# ".concat(s," */")),i=n.sources.map((function(t){return"/*# sourceURL=".concat(n.sourceRoot||"").concat(t," */")}));return[r].concat(i).concat([o]).join("\n")}var a,c,s;return[r].join("\n")}(e,t);return e[2]?"@media ".concat(e[2]," {").concat(r,"}"):r})).join("")},e.i=function(t,r,n){"string"==typeof t&&(t=[[null,t,""]]);var o={};if(n)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(o[a]=!0)}for(var c=0;c<t.length;c++){var s=[].concat(t[c]);n&&o[s[0]]||(r&&(s[2]?s[2]="".concat(r," and ").concat(s[2]):s[2]=r),e.push(s))}},e}},1434:(t,e,r)=>{var n=r(1147);"string"==typeof n&&(n=[[t.id,n,""]]),n.locals&&(t.exports=n.locals);(0,r(4831).Z)("b507b0ea",n,!1,{base:1020,shadowMode:!1})},1182:(t,e,r)=>{var n=r(2666);"string"==typeof n&&(n=[[t.id,n,""]]),n.locals&&(t.exports=n.locals);(0,r(4831).Z)("421b6350",n,!1,{base:1020,shadowMode:!1})},4831:(t,e,r)=>{function n(t,e){for(var r=[],n={},o=0;o<e.length;o++){var i=e[o],a=i[0],c={id:t+":"+o,css:i[1],media:i[2],sourceMap:i[3]};n[a]?n[a].parts.push(c):r.push(n[a]={id:a,parts:[c]})}return r}r.d(e,{Z:()=>v});var o="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!o)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var i={},a=o&&(document.head||document.getElementsByTagName("head")[0]),c=null,s=0,u=!1,l=function(){},f=null,p="data-vue-ssr-id",d="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function v(t,e,r,o){u=r,f=o||{};var a=n(t,e);return y(a),function(e){for(var r=[],o=0;o<a.length;o++){var c=a[o];(s=i[c.id]).refs--,r.push(s)}e?y(a=n(t,e)):a=[];for(o=0;o<r.length;o++){var s;if(0===(s=r[o]).refs){for(var u=0;u<s.parts.length;u++)s.parts[u]();delete i[s.id]}}}}function y(t){for(var e=0;e<t.length;e++){var r=t[e],n=i[r.id];if(n){n.refs++;for(var o=0;o<n.parts.length;o++)n.parts[o](r.parts[o]);for(;o<r.parts.length;o++)n.parts.push(g(r.parts[o]));n.parts.length>r.parts.length&&(n.parts.length=r.parts.length)}else{var a=[];for(o=0;o<r.parts.length;o++)a.push(g(r.parts[o]));i[r.id]={id:r.id,refs:1,parts:a}}}}function h(){var t=document.createElement("style");return t.type="text/css",a.appendChild(t),t}function g(t){var e,r,n=document.querySelector("style["+p+'~="'+t.id+'"]');if(n){if(u)return l;n.parentNode.removeChild(n)}if(d){var o=s++;n=c||(c=h()),e=S.bind(null,n,o,!1),r=S.bind(null,n,o,!0)}else n=h(),e=x.bind(null,n),r=function(){n.parentNode.removeChild(n)};return e(t),function(n){if(n){if(n.css===t.css&&n.media===t.media&&n.sourceMap===t.sourceMap)return;e(t=n)}else r()}}var m,b=(m=[],function(t,e){return m[t]=e,m.filter(Boolean).join("\n")});function S(t,e,r,n){var o=r?"":n.css;if(t.styleSheet)t.styleSheet.cssText=b(e,o);else{var i=document.createTextNode(o),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}function x(t,e){var r=e.css,n=e.media,o=e.sourceMap;if(n&&t.setAttribute("media",n),f.ssrId&&t.setAttribute(p,e.id),o&&(r+="\n/*# sourceURL="+o.sources[0]+" */",r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */"),t.styleSheet)t.styleSheet.cssText=r;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(r))}}}},e={};function r(n){var o=e[n];if(void 0!==o)return o.exports;var i=e[n]={id:n,exports:{}};return t[n](i,i.exports,r),i.exports}r.d=(t,e)=>{for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),r.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var n=r(1698).Z;export{n as default};