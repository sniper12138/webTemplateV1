import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);

Vue.config.productionTip = false

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import { Swiper as SwiperClass, EffectFade, Autoplay, Mousewheel, Pagination} from 'swiper/core'
Vue.use(VueAwesomeSwiper, /* { default options with global component } */)
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
SwiperClass.use([EffectFade, Autoplay, Mousewheel, Pagination])
Vue.use(getAwesomeSwiper(SwiperClass))

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
