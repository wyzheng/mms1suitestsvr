(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{1492:function(t,e,n){"use strict";n(820)},1493:function(t,e,n){"use strict";n(821)},1494:function(t,e,n){"use strict";n(822)},2213:function(t,e,n){"use strict";n.r(e);var a=n(1),r=n.n(a),s=n(0),i=n(44),o=n(84),c={props:{data:{type:Object,default:function(){return{}}},stars:{type:Array,default:function(){return[]}}},data:function(){return{sWord:null,selected:!1,isShowSkip:!0,rank:0,height:"auto"}},watch:{sWord:function(){setTimeout(this.reCalHeight)}},mounted:function(){this.reCalHeight()},methods:{reCalHeight:function(){setTimeout((function(){})),this.height="".concat(this.$refs.inner.clientHeight,"px")},tapStar:function(t,e){var n=this;n.rank=e+1,e<3?(n.sWord="".concat(t.word,"，请选择原因"),n.isShowSkip=!1):(n.sWord=t.word,n.selected&&(n.isShowSkip=!1)),n.$emit("tapStar",{index:e}),n.selected=!0},tapSkip:function(){this.$emit("tapSkip")}}},u=(n(1492),n(32)),l=Object(u.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"stars",style:{height:t.height}},[n("div",{ref:"inner",staticClass:"star-inner"},[n("div",{staticClass:"star-wrap",class:{"star-wrap__selected":t.sWord&&t.rank<4}},t._l(t.stars,(function(e,a){return n("div",{key:e.word,staticClass:"star-item expand-hotspot expand-hotspot-star",attrs:{role:"button","aria-label":e.word},on:{click:function(n){return t.tapStar(e,a)}}},[n("svg-icon",{staticClass:"star",class:{star__fill:e.selected},attrs:{name:"star"}}),t._v(" "),t.sWord?t._e():n("p",{staticClass:"start-text",attrs:{"aria-hidden":"true"}},[t._v("\n          "+t._s(e.word)+"\n        ")])],1)})),0),t._v(" "),t.sWord?n("div",{staticClass:"tip",class:{gold:t.rank>3},attrs:{role:"option","aria-live":"polite","aria-label":"已选择，"+t.sWord}},[t._v("\n      "+t._s(t.sWord)+"\n    ")]):t._e(),t._v(" "),t.isShowSkip?n("div",{staticClass:"skip"},[n("span",{staticClass:"expand-hotspot",attrs:{role:"button"},on:{click:t.tapSkip}},[t._v("跳过评价")])]):t._e()])])}),[],!1,null,"1a53fd73",null).exports;function p(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function f(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?p(Object(n),!0).forEach((function(e){r()(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var h={mixins:[s.l],props:{data:{type:Object,default:function(){return{}}},reasons:{type:Array,default:function(){return[]}},rank:{type:Number,default:Number}},methods:{tapReason:function(t){this.$emit("tapReason",{index:t})},tapMore:function(t){var e=this;e.$emit("tapMore");var n=e.reasons.filter((function(t){return t.selected||t.jumpUrl})).map((function(t){return t.wording})).join("|");e.M_jump(Object.assign(t,{jumpUrl:e.M_composeUrl(t.jumpUrl,f({selected_items:n,templateId:e.data.templateId,rank:e.rank},s.b.getBase()))}))}}},d=(n(1493),Object(u.a)(h,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"heavy-links reasons"},t._l(t.reasons,(function(e,a){return n("div",{key:e.title,staticClass:"heavy-link",attrs:{role:"button"},on:{click:function(e){return t.tapReason(a)}}},[e.jumpUrl?n("div",{staticClass:"heavy-link__inner reason__arrow with-arrow",on:{click:function(n){return t.tapMore(e)}}},[n("span",[t._v(t._s(e.wording))])]):n("div",{staticClass:"heavy-link__inner reason",class:{reason__selected:e.selected},attrs:{"aria-label":(e.selected?"已选定，":"")+e.wording}},[t._v("\n      "+t._s(e.wording)+"\n    ")])])})),0)}),[],!1,null,"4cda92de",null).exports),m=n(705),v=n(34),b=n(163);function g(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function w(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?g(Object(n),!0).forEach((function(e){r()(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var y,_={components:{stars:l,reasons:d,heightAnimate:m.a},mixins:[s.l],data:function(){return Object.assign({asyncData:null,stars_:[],rank:0,reasons_:[],duration:0,firstClickStar:!0,isShowReason:!0,isShowReasonAndButton:!1,confirmed:!1,isPopShowing:!1},{startTime:+new Date})},computed:w(w({},Object(o.c)({requestId:function(t){return t.result.requestId||t.result.previousRid},resultObj:function(t){return t.result.self.resultObj},popupTestObj:function(t){return t.result.insert.insertPopTestData}})),{},{templateContent:function(){return this.asyncData&&this.asyncData.templateContent||{}},pop:function(){return this.templateContent.pop||{}},header:function(){return{close:!0,title:this.pop.title}},stars:{get:function(){return this.stars_.length?this.stars_:this.pop.rank?this.pop.rank.map((function(t){return{word:t,selected:0}})):[]},set:function(t){this.stars_=t}},reasons:{get:function(){return this.reasons_.length?this.reasons_:this.pop.richReasons?this.pop.richReasons.map((function(t){return Object.assign({selected:0},t)})):[]},set:function(t){this.reasons_=t}}}),created:function(){var t=this;s.a.$on(s.i.newSearchArrived,(function(){setTimeout((function(){t.handleResultReady()}),0)})),i.b.onClientShadowClick((function(){t.isPopShowing&&t.hidePop().then((function(){t.asyncData=null}))}))},methods:{reset:function(){Object.assign(this.$data,{asyncData:null,stars_:[],rank:0,reasons_:[],duration:0,firstClickStar:!0,isShowReason:!0,isShowReasonAndButton:!1,confirmed:!1,isPopShowing:!1})},listenNavCtrl:(y=!1,function(){var t=this;y||b.a.on((function(e){t.handleClientNavAction(e)})),y=!0}),handleResultReady:function(){var t=this,e=t.resultObj.asyncFeedback;if(!t.isPopShowing){if(t.reset(),t.popupTestObj)return t.asyncData=t.popupTestObj,void t.listenNavCtrl();t.asyncData||e&&s.g.getCommonCgiData({cgiName:"GetSessionSurvey",data:w(w({},s.b.getBase()),{},{clientH5Version:s.b.version})}).then((function(e){var n=e.data;s.f.isObjectEmpty(n)||(n&&n.templateContent&&(t.asyncData=n),t.listenNavCtrl())}))}},handleClientNavAction:function(t){var e=this;if(!e.isPopShowing)if(e.asyncData){e.duration=new Date-e.startTime;var n=e.pop.duration||3e3;e.duration<n?t():e.showPop()}else t()},showPop:function(){this.isPopShowing=!0,this.$refs._halfScreen.show(),s.b.os.ios?s.g.openView({actionType:1,opType:2,userName:"",nickName:""}):s.b.os.android&&s.g.setInputBar({query:s.b.query,isInputChange:!1}),s.g.showNavBarShadow({color:"#000000",alpha:.5,animateDuration:.3}),this.report({reportType:"expose",reasons:this.reasons.map((function(t){return t.wording}))})},hidePop:function(){var t=this;return new Promise((function(e){s.g.hideNavBarShadow({animateDuration:.3}),t.$refs._halfScreen.hide(),setTimeout((function(){e(),t.isPopShowing=!1}),300)}))},terminate:function(){var t=this;t.hidePop().then((function(){b.a.next(),t.asyncData=null}))},tapStar:function(t){var e=this,n=t.index;e.rank=n+1,e.stars=e.stars.map((function(t,e){return e<=n?Object.assign(t,{selected:1}):Object.assign(t,{selected:0})})),n<3?e.firstClickStar?e.isShowReasonAndButton=!0:e.isShowReason=!0:e.firstClickStar?setTimeout((function(){e.confirm()}),500):e.isShowReason=!1,e.firstClickStar=!1},tapReason:function(t){var e=t.index;this.reasons=this.reasons.map((function(t,n){return n==e?Object.assign(t,{selected:!t.selected}):t}))},tapMore:function(){var t=this;t.hidePop().then((function(){t.asyncData=null}))},confirm:function(){var t=this;t.confirmed=!0,t.report({duration:+new Date-t.startTime}),setTimeout((function(){t.terminate()}),300)},report:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=this;s.g.getCommonCgiData({cgiName:v.a.reportInserData,data:Object.assign({reportType:"click",templateType:e.templateContent.type,reportLogId:18811,scene:s.b.scene,query:s.b.query,searchId:s.b.searchId,sessionId:s.b.sessionId,requestId:e.requestId,homepage:s.b.isHomePage,timestamp:+new Date,templateId:e.asyncData.templateId,rank:e.rank,reasons:e.rank>3?[]:e.reasons.filter((function(t){return t.selected})).map((function(t){return t.wording})),duration:0},t)})}}},O=(n(1494),Object(u.a)(_,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.asyncData&&t.asyncData.templateContent?n("div",[n("ui-half-screen",{ref:"_halfScreen",attrs:{"can-scroll":!0,header:t.header,"class-name":"cstest-pop-content"},on:{"tap:close":t.terminate,"tap:mask":t.terminate}},[n("div",{staticClass:"pop",class:{pop__confirm:t.confirmed}},[n("stars",{attrs:{data:t.asyncData,stars:t.stars},on:{tapStar:t.tapStar,tapSkip:t.terminate}}),t._v(" "),n("heightAnimate",{directives:[{name:"show",rawName:"v-show",value:t.isShowReasonAndButton,expression:"isShowReasonAndButton"}],staticClass:"wrap",attrs:{duration:300,name:"popWrap"}},[t.isShowReason?n("heightAnimate",{attrs:{duration:300,name:"popReason"}},[n("reasons",{staticClass:"reasons",attrs:{data:t.asyncData,reasons:t.reasons,rank:t.rank},on:{tapReason:t.tapReason,tapMore:t.tapMore}})],1):t._e(),t._v(" "),n("div",{staticClass:"btn-wrap"},[n("div",{staticClass:"weui-btn weui-btn_primary btn",attrs:{role:"button"},on:{click:t.confirm}},[t._v("\n            提交\n          ")])])],1)],1),t._v(" "),t.confirmed?n("div",{staticClass:"feedback",attrs:{role:"option","aria-live":"polite"}},[n("svg-icon",{staticClass:"cs-feedback__tick",attrs:{name:"tick"}}),t._v(" "),n("div",{staticClass:"cs-feedback__text"},[t._v("\n        已提交\n      ")])],1):t._e()])],1):t._e()}),[],!1,null,"a836a998",null));e.default=O.exports},705:function(t,e,n){"use strict";var a=n(159),r=n(0),s=n(7),i=r.f.getSupportProperty("transform"),o={props:{withoutEnter:{type:Boolean,default:!1},withoutLeave:{type:Boolean,default:!1},entered:{type:Function,default:function(){}},leaved:{type:Function,default:function(){}},duration:{type:Number,default:300},transfrom:{type:Boolean,default:!0}},data:function(){return{show:!1}},mounted:function(){this.show=!0},methods:{beforeEnter:function(){this.style={height:"0px"},r.a.$emit(s.b.heightAnimateStart)},enter:function(t,e){var n=this,r=n.$refs.inner,s=r.offsetHeight;n.withoutEnter?(t.height="".concat(s,"px"),e()):a.a.generateAnimate({duration:n.duration,ease:"easeInOutSine",update:function(e){return t.style.height="".concat(r.offsetHeight*e,"px"),n.transfrom&&(r.style[i]="translate(0,".concat(100*e-100,"%)")),!0},finish:function(){e()}})},afterEnter:function(t){t.style.height="auto",this.entered(),r.a.$emit(s.b.heightAnimateEnd)},beforeLeave:function(){r.a.$emit(s.b.heightAnimateStart)},leave:function(t,e){var n=this,r=t.offsetHeight,s=n.$refs.inner;n.withoutLeave?(t.height="0px",e()):a.a.generateAnimate({duration:n.duration,update:function(e){return t.style.height="".concat(r-r*e,"px"),n.transfrom&&(s.style[i]="translate(0,".concat(-100*e,"%)")),!0},finish:function(){e()}})},afterLeave:function(){this.leaved(),r.a.$emit(s.b.heightAnimateEnd)}}},c=(n(776),n(32)),u=Object(c.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("transition",{attrs:{name:"h-animate"},on:{"before-enter":t.beforeEnter,enter:t.enter,"after-enter":t.afterEnter,"before-leave":t.beforeLeave,leave:t.leave,"after-leave":t.afterLeave}},[t.show?n("div",{staticClass:"h-animate"},[n("div",{ref:"inner",staticClass:"h-animate__inner"},[t._t("default")],2)]):t._e()])}),[],!1,null,null,null);e.a=u.exports},742:function(t,e,n){},776:function(t,e,n){"use strict";n(742)},820:function(t,e,n){},821:function(t,e,n){},822:function(t,e,n){}}]);