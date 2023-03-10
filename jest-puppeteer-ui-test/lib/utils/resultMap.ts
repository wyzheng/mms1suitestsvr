// see: https://git.woa.com/searchweb/search/weixin-search-main/blob/master/src/views/result/libs/map.js
// give an enum of basic block class
export const basicClasses = {
  basicClass: "search_block basic-block-",
  listClass: "search_list block-list-",
  components: {
    ["OFFICE_ACCOUNT"]: {
      tmpl: 'office-account',
      name: '公众号'
    },
    ["ARTICLE_INFO"]: {
      tmpl: 'article-info',
      name: '文章'
    },
    ["OFF_ACC_FOLLOWED"]: {
      tmpl: 'article-info',
      name: '\'已关注公众号的文章'
    },
    // [resultEnum."SERVICE"]:{
    //     tmpl:'service',
    //     name:'服务'
    // },
    ["MOMENT"]: {
      tmpl: 'moment',
      name: '朋友圈'
    },
    // [resultEnum."ITEM_16"]:{
    //     tmpl:'search-item-16',
    //     name:'search-item-16'
    // },
    // [resultEnum."CONTACT"]:{
    //     tmpl:'contact',
    //     name:'联系人'
    // },
    ["APP_ACC"]: {
      tmpl: 'app-acc',
      name: '小程序'
    },
    ["STICKERS_ALBUM"]: {
      tmpl: 'stickersAlbum',
      name: '表情专辑'
    },
    ["STICKERS_SINGLE"]: {
      tmpl: '',
      name: '表情单品'
    },
    ["STICKERS_ALL"]: {
      tmpl: '',
      name: '表情合集'
    },
    ["MUSIC"]: {
      tmpl: 'music',
      name: '音乐'
    },
    ["FICTION"]: {
      tmpl: 'fiction',
      name: '小说'
    },
    ["RELATED_SEARCH"]: {
      tmpl: 'related-search',
      name: '相关搜索'
    },
    ["NEWS"]: {
      tmpl: 'news',
      name: '新闻'
    },
    ["WIDGET_WEBVIEW"]: {
      tmpl: 'widget-webview',
      name: '小程序插件'
    },
    ["VIDEO"]: {
      tmpl: 'basic-video',
      name: '视频'
    },
    ["MINI_PRGM_AD"]: {
      tmpl: 'app-acc',
      name: '小程序广告'
    },
    ["MEDICAL_NEWS"]: {
      tmpl: 'medical-news',
      name: '医疗资讯'
    },
    ["MEDICAL_QA"]: {
      tmpl: 'medical-news',
      name: '医疗问答'
    },
    ["ARTICLE_ADV_SEARCH"]: {
      tmpl: '',
      name: '文章高级搜索条'
    },
    ["GAME"]: {
      tmpl: 'game',
      name: '游戏'
    },
    ["PEDIA"]: {
      tmpl: 'pedia',
      name: '百科'
    },
    ["QA"]: {
      tmpl: 'qa',
      name: '问答'
    },
    // ["OFFICE_SITE"]: {
    //     tmpl: 'office-site',
    //     name: '官方网站'
    // },
    // ["OFFICIAL"]: {
    //     tmpl: 'official-zone',
    //     name: '官方'
    // },
    ["ARCHIVED_VIDEO"]: {
      tmpl: 'archived-video',
      name: '长视频'
    },
    // [resultEnum."SNS_POI"]:{
    //     tmpl:'sns-poi',
    //     name:'位置信息'
    // },
    ["TOPIC"]: {
      tmpl: 'topic',
      name: '话题'
    },
    ["LITTLE_GAME"]: {
      tmpl: 'little-game',
      name: '小游戏'
    },
    ["COMMODITY"]: {
      tmpl: 'commodity',
      name: '京东商品'
    },
    ["OPERATING"]: {
      tmpl: 'operating-activity',
      name: '运营活动'
    },
    ["WORLD_CUP"]: {
      tmpl: 'world-cup',
      name: '世界杯'
    },
    ["AGGREGATION"]: {
      tmpl: 'aggregation',
      name: '搜索聚合'
    },
    ["SPECIFIC_QA"]: {
      tmpl: 'specific-qa',
      name: '精准问答'
    },
    // ["AGGREGATION_SINGLE"]: {
    //     tmpl: "aggregation-single",
    //     name: "单个聚合结果"
    // },
    ["GENERAL"]: {
      tmpl: 'general',
      name: '通用非富展现形式'
    },
    ["RICH"]: {
      tmpl: 'rich',
      name: '通用富展现'
    },
    ["WORTH_BUYING"]: {
      tmpl: 'worth-buying',
      name: '什么值得买'
    },
    // ["MEDICAL_PEDIA"]: {
    //     tmpl: "medical-pedia",
    //     name: "医疗百科"
    // },
    ["FESTIVAL"]: {
      tmpl: 'festival',
      name: '节日运营'
    },
    ["MEDICAL_ENCYCLOPEDIA"]: {
      tmpl: 'medical-encyclopedia',
      name: '医疗百科新样式'
    },
    ["HOSPITAL_AND_DOCTOR"]: {
      tmpl: 'hospital',
      name: '医院和医生大卡'
    },
    ["PC_GAME"]: {
      tmpl: 'pc-game',
      name: 'PC游戏和主机游戏'
    },
    ["WEBSITE"]: {
      tmpl: 'website',
      name: '网址功能条'
    },
    // ["NEW_OFFICIAL"]:{
    //     tmpl:"new-official",
    //     name:"新官方区"
    // },
    ["EXTERNAL_BAR"]: {
      tmpl: '',
      name: '跳转外链的bar'
    },
    ["KNOWLEGE_MAP"]: {
      tmpl: '',
      name: '知识图谱'
    },
    ["KNOWLEGE_MAP_WITHOUT_IMAGE"]: {
      tmpl: '',
      name: '知识图谱'
    },
    ["HOSPITAL_SERVICE"]: {
      tmpl: '',
      name: '医生服务外显'
    },
    ["HOSPITAL_REGISTER"]: {
      tmpl: '',
      name: '医生挂号、服务外显'
    },
    ["GOOD_THING"]: {
      tmpl: 'good-thing',
      name: '好物圈圈子'
    },
    ["WEIBO"]: {
      tmpl: 'weibo',
      name: '微博'
    },
    ["LITTLE_VIDEO"]: {
      tmpl: '',
      name: '小视频'
    },
    ["SEVICE_LIST"]: {
      tmpl: 'service-list',
      name: '服务搜索'
    },
    ["OFFICIAL_ZONE"]: {
      tmpl: 'official-zone',
      name: '官方区'
    },
    ["OFFICIAL_ZONE_PRO"]: {
      tmpl: 'official-zone',
      name: '官方区PRO'
    },
    ["SERVICE_WITH_LOGO"]: {
      tmpl: 'service-with-logo',
      name: '服务列表带LOGO'
    },
    ["QR_CODE"]: {
      tmpl: 'qrCode',
      name: '二维码'
    },
    ["WRITING"]: {
      tmpl: 'writing',
      name: '写作/作文'
    },
    ["MICRO_SHOP"]: {
      tmpl: 'micro-shop',
      name: '小微商家'
    },
    ["MORE_SERVICE"]: {
      tmpl: '',
      name: '更多相关服务'
    },
    ["FONT_WORD"]: {
      tmpl: 'font-word',
      name: '字词'
    },
    ["VIDEO_ACCOUNT"]: {
      tmpl: 'video-account',
      name: '视频号'
    },
    ["IMAGE_SEARCH_SIMILAR_PIC"]: {
      tmpl: 'image-search-similar-pic',
      name: '图片搜索 - 相似图片'
    },
    ["IMAGE_SEARCH_GOODS"]: {
      tmpl: 'image-search-goods',
      name: '图片搜索 - 商品'
    },
    ["MEDICIAL_HELP"]: {
      tmpl: 'medicial-help',
      name: '问诊交互优化'
    },
    ["MOVIE_LIST"]: {
      tmpl: 'movie-list',
      name: '微信指数电影榜'
    },
    ["LIGHTEN_2021"]: {
      tmpl: '',
      name: '点亮2021'
    },
    ["SLOT_MACHINE"]: {
      tmpl: 'slot-machine',
      name: '老虎机'
    },
    ["LIVE"]: {
      tmpl: '',
      name: '双列直播'
    },
    ["LIVE_SINGLE"]: {
      tmpl: '',
      name: '单个直播'
    },
    ["MEDICAL_PEDIA"]: {
      tmpl: 'medical-pedia',
      name: '医药、疾病百科'
    },
    ["CHANNEL_ACTIVITY_CROSS_LINE"]: {
      tmpl: 'channelActivityCrollLine',
      name: '视频号动态的整行'
    },
    ["UNIFIED_ACCOUNT"]: {
      tmpl: 'unified-account'
    },
    ["INDEPENDENT_OLYMPIC_SCHEDULE"]: {
      tmpl: 'independent-olympic-schedule',
      name: '奥运会赛事日程表'
    }
  }
};

// 公众号box的相关class
export const bizClass = {
  "HEADER": {
    father : 'div.account-header',
    items:{
      //头像
      icon: 'div.account-header-icon',
      //昵称
      title: 'div.header-title-container span.header-title',
      // 功能介绍
      desc: 'div.header-desc',
      //header-text-aria ui-aria-hidden 这里，能读到名称/简介/来源 暂时先不用，不知道问不稳定。。。
      all: 'div.header-text-aria.ui-aria-hidden',
      // 来源
      source: 'span.header-source-text',
      //认证
      titleTag: 'div.header-title-container span.ui-tags',
      //ui-column unified-account-menus服务
      service: 'div.unified-account-menus',
      //tg
      sourceTag: 'div.header-source span.ui-tags',
      // 来源
      authTag: 'div.header-source div.header-auth-tag'
    }
  },
}

export const fontWordClass = {
  //q=赢
  "FONT":{
    //有且正确
    gif: "div.font-thumb",
    //有且正确
    pinyin: "div.font-detail span.font-pinyin",
    //有且正确
    voice: 'div.font-detail span.voice-icon audio',
    // 短介绍 四个 默认？
    detail: 'ul.detail-short-box li',
    //两行
    desc: '.desc-box .body',
    // 两行  每个词最多十个字  点击以该词内容重新发起搜索
    words: 'div.btns-box div.body div.btns',
    // 某个button
    button: 'div.btns-box div.button-wrapper',
    source: 'div.ui-source',
    // 有且正确
    image: 'div.ui-source-image',
    // 打点
    sourceText: 'div.ui-front-text-ellipsis span.ui-primary'
  },
  // q= 风花雪月成语
  "WORD": {
    // 高亮
    word:'div.font-detail div.font-title',
    pinyin: "div.font-detail span.font-pinyin",
    voice: 'div.font-detail span.voice-icon audio',
    desc: 'div.desc-box',
    // 可能有多个，然后可以根据编号进行定位
    words: 'div.btns-box.btn-box_primary',
    button: 'div.btns div.ui-button div.ui-button-content',
    source: 'div.ui-source',
    image: 'div.ui-source-image',
    sourceText: 'div.ui-front-text-ellipsis span.ui-primary'
  },

  // 成语  q= 数字成语
  "IDIOM": {
    title:'div.font-detail div.font-title',
    button: 'div.btns-box div.btns div.ui-button div.ui-button-content',
    more: 'p.more-box',
    source: 'div.ui-source',
    image: 'div.ui-source-image',
    sourceText: 'div.ui-front-text-ellipsis span.ui-primary'
  },
  // 诗词，q=白日依山尽
  "POEM": {
    boxTitle: 'div.search-block__hd div.search-block__title span',
    title: "div.poem-box div:nth-of-type(1)",
    author: 'div.poem-box p.desc',
    content: 'div.poem-box div.ctn',
    buttons: 'div.poem-box div.btns',
    button: 'div.poem-box div.btns div.ui-button div.ui-button-content'
  }
}

export const wxAdClass = {
  //广告头部
  head: 'div.ui-zone-ad__hd',
  feedback: 'div.ad-zone-header__complaint-entry',
  complaint: "div.complaint-content",
  feedback_mask: 'div.mask.ad-complaint-popover',
  extent: 'div.ad-zone-header__link-extent',
  extent_content: 'div.ad-zone-header__link-extent div.ad-zone-header__link__text',
  //广告信息
  headTitle: 'div.service-search-block-body  div:nth-child(1)',
  title: 'div.ad-sub-header__slot div.hd-title-content em',
  tagContent: 'div.ad-sub-header__slot div.hd-title-content div.ui-tag-title',
  headSpan: 'div.ad-sub-header__slot div.hd-title-content h2.hd-title span',
  loc: 'div.hd-option-wrapper div.hd-option.active__link',
  phone: 'div.hd-option-wrapper div.hd-option.active__link:nth-of-type(2)',
  helper: 'div.hd-option-wrapper div.hd-option.active__link:nth-of-type(3)',
  //电话相关
  half_dialog: "div.ui-half-screen-dialog",
  alert_dialog: "div.dialog__box.alert",
  number: "div.ui-half-screen-dialog div.ui-half-screen-sheet-item p.ui-text-source span",
  call_button: "div.ui-half-screen-dialog div.ui-half-screen-sheet-item",
  alert_number: "div.dialog__box.alert div.dialog__bd",
  // 账号（可能有多个，可能在不同位置）
  account: `div.ad-account-info__list div.account-info`,
  account_tag: `div.ad-account-info__list div.account-info div.ui-tag-title`,
  account_link: `div.ad-account-info__list div.account-info a`,
  account_title: `div.ad-account-info__list div.account-info div.account-info__title`,
  account_desc: `div.ad-account-info__list div.account-info div.account-info__desc`,
  // 系列产品
  tab_space: "div.product-series div.product-series__tabs > div",
  active_tab: "div.product-series div.product-series__tabs div.product-series__tab__content--active",
  product: "div.product-series div.ui-scroll__wrapper div.ui-scroll__item",
  product_image: "div.product-series div.ui-scroll__wrapper div.ui-scroll__item div.product-info__image",
  product_title: "div.product-series div.ui-scroll__wrapper div.ui-scroll__item div.product-info__title",
  product_desc: 'div.product-series div.ui-scroll__wrapper div.ui-scroll__item div.product-info__desc',
  // 更多账号
  more_account: "div.ad-account-info__more-info.active__item",
  //热门活动
  activity: "div.activity-card-slide div.ui-scroll__item:nth-of-type(3)",
  activity_body: "div.activity-card-slide div.ui-scroll__item div.video-player__bd",
  activity_menus: "div.activity-card-slide div.ui-scroll__item:nth-of-type(3) div.menu-item:nth-of-type(1)",
  activity_button: "div.activity-card-slide div.ui-scroll__item a",

  select_tab: "#search_result > div.unit__outer > div > div > div.unit__item:nth-of-type(2)",
  select_all: "#search_result > div.unit__outer > div > div > div.unit__item:nth-of-type(1)",
}

export function adAccountClass(index){
  // 账号（可能有多个，可能在不同位置）
  return{
    account: `div.ad-account-info__list div.ad-account-info__item:nth-of-type(${index}) div.account-info`,
    account_tag: `div.ad-account-info__list div.ad-account-info__item:nth-of-type(${index}) div.account-info div.ui-tag-title`,
    account_link: `div.ad-account-info__list div.ad-account-info__item:nth-of-type(${index}) div.account-info a`,
    account_title: `div.ad-account-info__list div.ad-account-info__item:nth-of-type(${index}) div.account-info div.account-info__title`,
    account_desc: `div.ad-account-info__list div.ad-account-info__item:nth-of-type(${index}) div.account-info div.account-info__desc`,
  }
}

export function adActivityClass(aId,mId){
  // 活动（可能有多个，可能在不同位置）
  return{
    activity: `div.activity-card-slide div.ui-scroll__item:nth-of-type(${aId})`,
    activity_body: `div.activity-card-slide div.ui-scroll__item:nth-of-type(${aId}) div.video-player__bd`,
    activity_menus: `div.activity-card-slide div.ui-scroll__item:nth-of-type(${aId}) div.menu-item:nth-of-type(${mId})`,
    activity_button: `div.activity-card-slide div.ui-scroll__item:nth-of-type(${aId}) a`,
  }
}

//竞价广告
export const wxCpAdClass = {
  //小图 q= 羽绒服
  title : `div.h-animate div.article-title p`,
  feedback: `div.h-animate div.article-title span div`,
  pic: `div.h-animate div.article-main div.article-thumb`,
  desc: `div.h-animate div.article-main div.article-desc-box div.article-desc`,
  source: `div.h-animate div.article-main div.article-desc-box div.source__title`,
  source_rec: `div.h-animate div.article-main div.article-desc-box div.source__rec`,

  //大图 q=打车
  pic_title : `div.h-animate div.pic-title p`,
  pic_feedback: `div.h-animate div.pic-title span div`,
  pic_pic: `div.h-animate div.pic-thumb`,
  pic_source: `div.h-animate div.source-plain div.source__title`,
  pic_source_rec: `div.h-animate div.source-plain div.source__rec`,
}
//小游戏
export const wxMiniGameAdClass = {
  //小图 q= 小游戏
  pic: `div.h-animate div.game__common div.l-game__icon-l`,
  title : `div.h-animate div.l-game__common div.l-game__block div.l-game__title`,
  feedback: `div.h-animate div.l-game__common div.l-game__block div.l-game__title span div`,
  desc: `div.h-animate div.l-game__common div.l-game__block p`,
  source: `div.h-animate div.l-game__common div.l-game__block div.ui-source span`,
  action: `div.h-animate div.l-game__common div.l-game__block div.ui-column`,
}

export function feedbackDialogClass(id){
  return{
    //弹窗
    dialog: `div.pop-over`,
    title_word: `div.pop-over div.header-wrap div.title-word`,
    action: `div.exposure-block div.pop-over div.actions-wrap div.actions div:nth-child(${id})`,
    jump: `div.pop-over div.jump-wrap div.jump-in`,
    reason_word: `div.pop-over div.reasons-wrap p.title-word`,
    reason_desc: `div.pop-over div.reasons-wrap p.desc-word`,
    reason: `div.pop-over div.reasons-wrap div.reasons div.reason:nth-of-type(${id})`,
    reason_checked: `div.pop-over div.reasons-wrap div.reasons div.reason__checked:nth-of-type(${id})`,
    button: `div.pop-over div.header-wrap div.button-part div`,
  }
}


//商品品专
export const wxGoodAd = {
  header: `div.ui-zone-ad__hd div.ad-goods-header__bg`,
  feedback: `div.ui-zone-ad__hd div.ad-goods-header__complaint-entry`,
  complaint: "div.complaint-content",
  feedback_mask: 'div.mask.ad-complaint-popover',
  title: "#search_result > div:nth-child(4) > div > div.exposure-block.search_result_block.box-without-card-style > div > div.ui-zone-ad__bd > div.ui-zone-ad__bd-slot > div > div.service-search-block-body > div:nth-child(1) > div.service-search-item-content-wrapper > div > div.ad-sub-header__slot.ad-sub-header__slot--without-title.ad-sub-header__slot--without-padding > div > div.hd-title-wrapper > div > h2 > span.ellipsis_1",
  tag: `#search_result > div:nth-child(4) > div > div.exposure-block.search_result_block.box-without-card-style > div > div.ui-zone-ad__bd > div.ui-zone-ad__bd-slot > div > div.service-search-block-body > div:nth-child(1) > div.service-search-item-content-wrapper > div > div.ad-sub-header__slot.ad-sub-header__slot--without-title.ad-sub-header__slot--without-padding > div > div.hd-title-wrapper > div > h2 > span.ui-tags.hd-ui-tags.ui-tags-vertical-align`,
  headSpan: 'div.ad-sub-header__slot div.hd-title-content h2.hd-title span',

  firstGood: 'div.ui-zone-ad__bd div.ad-sub-header div.ad-goods-info',
  firstGoodImg: `div.ui-zone-ad__bd div.ad-sub-header div.ad-goods-info div.ui-image-image`,
  firstGoodTile: `div.ui-zone-ad__bd div.ad-sub-header div.ad-goods-info div.ad-goods-info-goods div.ad-goods-info-goods__title`,
  firstGoodTag: `div.ui-zone-ad__bd div.ad-sub-header div.ad-goods-info div.ad-goods-info-goods div.ad-goods-info-goods__taglist div.ui-tag`,
  firstGoodPrice: `div.ui-zone-ad__bd div.ad-sub-header div.ad-goods-info div.ad-goods-info-goods div.ad-goods-info-goods__content div`,
  firstGoodAction: `div.ui-zone-ad__bd div.ad-sub-header div.ad-goods-info div.ad-goods-info-goods div.ad-goods-info-goods__content div a div.ui-button-content`,
  relatedGoodTitle: `div.ad-sub-header div.ad-sub-header-info div.ad-sub-header__title span`,
  goodMall: `div.ad-sub-header div.ad-sub-header__title__after div`,
  relatedGood: `div.ad-sub-header div.recommended-goods div.recommended-goods-item`,
}

export function relatedGoods(id) {
  return {
    relatedGoods: `div.ad-sub-header div.ad-sub-header__slot div.recommended-goods`,
    relatedGoodsImg: `div.ad-sub-header div.ad-sub-header__slot div.recommended-goods div.recommended-goods-item:nth-of-type(${id}) div.ui-image-image`,
    relatedGoodsTitle: `div.ad-sub-header div.ad-sub-header__slot div.recommended-goods div.recommended-goods-item:nth-of-type(${id}) div.recommended-goods-item__title`
  }
}



export const bizWeAppClass = {
  title: `#search_result > div:nth-child(3) > div > div:nth-child(2) > div.search-block__hd > div > div.search-block__title span`,
  more: `#search_result > div:nth-child(3) > div > div:nth-child(2) > div.search-block__hd > div > div:nth-child(2) > div.more__item.active__mask`,
}

// id：box位次，从1开始，tid：账号tag位次，sid： 账号服务id
export function bizWeAppsList(id, tid, sid) {
  let parentClass = `div.basic-block-unified-account div.block-list-unified-account div.unified-account:nth-of-type(${id}) `
  return{
    account: parentClass,
    accountIcon: parentClass + `div.account-header div.account-header-icon`,
    accountTitle: parentClass + `div.account-header div.header-text div.header-title-container span.header-title`,
    accountTag: parentClass + `div.account-header div.header-text div.header-title-container span.ui-tags div.ui-tag:nth-of-type(${id})`,
    accountTagTitle: parentClass + `div.account-header div.header-text div.header-title-container span.ui-tags div.ui-tag:nth-of-type(${id}) div.ui-tag-title`,
    accountDesc : parentClass + `div.account-header div.header-text div.header-desc`,
    accountSourceIcon: parentClass + `div.account-header div.header-text div.header-source div.ui-tag`,
    accountSourceText: parentClass + `div.account-header div.header-text div.header-source span.header-source-text`,
    accountSourceTag: parentClass + `div.account-header div.header-text div.header-source span.ui-tags div.ui-tag-text-wrapper div.ui-tag-title`,
    bizService: parentClass + `div.account-header div.header-text div.unified-account-menus div.ui-column-slot`,
    bizServiceLink: parentClass + `div.account-header div.header-text div.unified-account-menus div.ui-column-slot:nth-of-type(${sid}) div.ui-link`,
    bizServiceText: parentClass + `div.account-header div.header-text div.unified-account-menus div.ui-column-slot:nth-of-type(${sid}) div.ui-link div.ui-link-text`,
    weappService: parentClass + `div.account-header div.header-text div.sevice-search.service-list div div.heavy-links div.heavy-link`,
    weappServiceLink:  parentClass + `div.account-header div.header-text div.sevice-search.service-list div div.heavy-links div.heavy-link:nth-of-type(${sid})`,
    weappServiceText:  parentClass + `div.account-header div.header-text div.sevice-search.service-list div div.heavy-links div.heavy-link:nth-of-type(${sid}) div div`,
  }
}
