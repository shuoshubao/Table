var e=Object.defineProperty,t=Object.prototype.hasOwnProperty,a=Object.getOwnPropertySymbols,s=Object.prototype.propertyIsEnumerable,r=(t,a,s)=>a in t?e(t,a,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[a]=s,n=(e,n)=>{for(var o in n||(n={}))t.call(n,o)&&r(e,o,n[o]);if(a)for(var o of a(n))s.call(n,o)&&r(e,o,n[o]);return e},o=(e,t,a)=>(r(e,"symbol"!=typeof t?t+"":t,a),a);import{r as l,p as i,l as c,i as m,a as u,b as d,F as h,C as p,R as f,B as g,s as y,c as v,T as b,d as E,e as C,z as w}from"./vendor.a0588d6f.js";!function(e=".",t="__import__"){try{self[t]=new Function("u","return import(u)")}catch(a){const s=new URL(e,location),r=e=>{URL.revokeObjectURL(e.src),e.remove()};self[t]=e=>new Promise(((a,n)=>{const o=new URL(e,s);if(self[t].moduleMap[o])return a(self[t].moduleMap[o]);const l=new Blob([`import * as m from '${o}';`,`${t}.moduleMap['${o}']=m;`],{type:"text/javascript"}),i=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(l),onerror(){n(new Error(`Failed to import: ${e}`)),r(i)},onload(){a(self[t].moduleMap[o]),r(i)}});document.head.appendChild(i)})),self[t].moduleMap={}}}("https:/shuoshubao.github.io/Table/assets/");class S extends l.Component{constructor(e){super(e),this.state={total:0,current:1,pageSize:10,dataSource:[],columns:[],filterValue:{}},this.customEvents=this.getCustomEvents(),this.domEvents=this.getDomEvents(),this.renderResult=this.getRenderResult(),this.search=c.debounce(this.customEvents.search,100),this.cacheSearchParams={}}componentDidMount(){const e=c.cloneDeep(this.props.columns).map(((e,t)=>{const{dataIndex:a,filters:s,filterMultiple:r=!0}=e;return s&&(e.filterIcon=()=>{const e=this.state.filterValue[a],t=m(d(e),u(e));return l.createElement(h,{style:{color:t?"#1890ff":void 0}})},e.filterDropdown=e=>{const t=this.state.filterValue[a],{confirm:n}=e;let o;const i=s.map(((e,t)=>({label:e.label,value:e.value})));let m;return o=r?l.createElement(p.Group,{value:t,options:i,onChange:e=>{this.domEvents.onFilterChange(a,e)}}):l.createElement(f.Group,{value:t,options:i,onChange:e=>{this.domEvents.onFilterChange(a,e.target.value)}}),m=r?c.isUndefined(t)||c.isEqual(t,[]):c.isUndefined(t)||c.isEqual(t,""),l.createElement("div",{className:"dyna-table-filter-dropdown"},l.createElement("div",{className:"dyna-table-filter-dropdown-options"},o),l.createElement("div",{className:"dyna-table-filter-dropdown-footer"},l.createElement(g,{size:"small",type:"text",disabled:m,onClick:()=>{this.domEvents.onFilterReset(a,r),n({closeDropdown:!0})}},"重置"),l.createElement(g,{size:"small",type:"primary",onClick:()=>{this.domEvents.onFilterConfirm(),n({closeDropdown:!0})}},"确定")))},e.onFilterDropdownVisibleChange=e=>{}),e}));this.setState({columns:e})}getCustomEvents(){return{isLocalData:()=>{const{fetch:e}=this.props.remoteConfig;return!e},getFilterParams:()=>this.state.filterValue,search:async(e={},t=!0)=>{t&&await y(this,{current:1,filterValue:{}});const{props:a,state:s}=this,{fetch:r,dataSourceKey:o="list",totalKey:l="total",pageSizeKey:i="pageSize",currentPageKey:m="currentPage"}=a.remoteConfig,{current:u,pageSize:d}=s,h={[i]:d,[m]:u},p=this.customEvents.getFilterParams(),f=n(n(n(n({},h),p),this.cacheSearchParams),e),g=await r(f),v=c.get(g,o,[]),b=c.get(g,l,0);this.setState({dataSource:v,total:b}),t&&(this.cacheSearchParams=n({},e))}}}getDomEvents(){return{onFilterChange:async(e,t)=>{await y(this,(a=>({filterValue:n(n({},a.filterValue),{[e]:t})})))},onFilterConfirm:async()=>{await y(this,{current:1}),this.customEvents.search({},!1)},onFilterReset:async(e,t)=>{await y(this,(a=>({filterValue:n(n({},a.filterValue),{[e]:t?[]:""})}))),this.customEvents.search({},!1)},onChange:async(e,t)=>{await y(this,{current:e}),this.customEvents.search({},!1)},onShowSizeChange:(e,t)=>{setTimeout((async()=>{await y(this,{pageSize:t,current:1})}),0)}}}getRenderResult(){return{}}render(){const{props:e,state:t,domEvents:a,customEvents:s}=this,{prependHeader:r,appendHeader:o}=e,{columns:i,dataSource:m,total:u,current:d,pageSize:h}=t,{onChange:p,onShowSizeChange:f}=a,g=c.omit(e,["class","className","style","columns","dataSource","remoteConfig"]),y=!r&&!o;return l.createElement("div",{className:v("dyna-table",e.class,e.className)},!y&&l.createElement("div",{className:"dyna-table-header"},l.createElement("div",{className:"dyna-table-header-left"},r),l.createElement("div",{className:"dyna-table-header-right"},o)),l.createElement(b,n(n({},g),{columns:i,dataSource:m,pagination:{style:{padding:"16px 10px",margin:0},onChange:p,onShowSizeChange:f,total:u,current:d,pageSize:h,showTotal:e=>["总计",e,"条数据"].join(" ")}})))}}o(S,"displayName","DynaTable"),o(S,"defaultProps",{}),o(S,"propTypes",{columns:i.array.isRequired,dataSource:i.array,remoteConfig:i.object});const R=[{title:"姓名",dataIndex:"name",filters:[{label:"胡彦祖1",value:"aa"},{label:"胡彦祖2",value:"bb"}]},{title:"年龄",dataIndex:"age",filterMultiple:!1,filters:[{label:"32",value:32},{label:"42",value:42}]},{title:"住址",dataIndex:"address"}],z=[{name:"胡彦祖",age:32,address:"西湖区湖底公园1号"},{name:"胡彦祖",age:42,address:"西湖区湖底公园1号"}],F={fetch:async e=>(console.log("🍉 params"),console.log(e),{list:c.range(0,92).map((e=>n(n({},z[0]),{name:z[0].name+e}))),total:92})};class P extends l.Component{constructor(e){super(e),this.state={},this.tableRef=l.createRef(),this.onClick=this.onClick.bind(this)}onClick(){this.tableRef.current.search()}render(){return l.createElement("div",{className:"App"},l.createElement(g,{type:"primary",onClick:this.onClick},"查询"),l.createElement(S,{ref:this.tableRef,columns:R,remoteConfig:F,rowKey:"name"}))}}E.render(l.createElement(l.StrictMode,null,l.createElement(C,{locale:w},l.createElement(P,null))),document.getElementById("root"));
