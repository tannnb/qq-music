<template>
    <div class="bannerWrapper">
        <div class="successNav">
            <swiper v-if="bannerCount && bannerCount.length > 0" :options="swiperOptionNewSong">
                <swiper-slide class="bannerItem" v-for="item in focus" :key="item.id">
                    <img class="bannerImg" :src="item.pic_info.url" alt="" @click="handleBanner(item)"/>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
            <div class="banner-prev" slot="button-prev"><img class="prev" src="../../images/prev.png" alt=""></div>
            <div class="banner-next" slot="button-prev"><img class="next" src="../../images/next.png" alt=""></div>
        </div>
    </div>
</template>

<script>
    import {CreateBanner} from '@/utils/util'

    export default {
        name: 'slider',
        props: {
            focus: {
                type: Array,
                default: [],
            },
        },
        data() {
            return {
                bannerCount: [],
                swiperOptionNewSong: {
                    effect: 'coverflow',
                    grabCursor: true,
                    watchSlidesProgress: true,
                    centeredSlides: true,
                    slidesPerView: 3,
                    loop: true,
                    simulateTouch: true,
                    observer: true,
                    observeParents: true,
                    autoplay: {
                        delay: 4000,//自动播放速度
                        disableOnInteraction: false,//鼠标移上去时是否还继续播放
                    },
                    coverflowEffect: {
                        rotate: 30,
                        stretch: 20,
                        depth: 180,
                        modifier: 1,
                        slideShadows: true,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'bullets',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.banner-next',
                        prevEl: '.banner-prev'
                    },
                },
            }
        },
        created() {
            this.bannerCount = this._initNewSongList(this.focus)
        },
        methods: {
            _initNewSongList(songList) {
                const initSongList = songList.filter(current => current.jump_info.url.indexOf('.html') == -1)
                return initSongList.map(item => (new CreateBanner({mid: item.jump_info.url, url: item.pic_info.url})))
            },
            handleBanner(item) {
                let result = ''
                if(item && item.jump_info && item.jump_info.url) {
                    result = item.jump_info.url
                }
                if(!result) return
                let url = `https://y.qq.com/n/yqq/album/${result}.html`
                window.open(url,'_blank');
            }
        },
    }
</script>
<style lang="stylus">
    .bannerWrapper {
        .swiper-pagination-bullet {
            width 10px
            height: 10px
            outline: none
            bottom -15px
            opacity 0.4
        }

        .swiper-pagination-bullet-active {
            width: 30px;
            border-radius: 6px;
            opacity: 1;
        }
    }
</style>
<style lang="stylus" scoped>

    .successNav .swiper-slide.swiper-slide-active img {
        transform: scaleX(1.7);
        border-radius: 4px;
    }

    .successNav .swiper-slide.swiper-slide-duplicate-prev img,
    .successNav .swiper-slide.swiper-slide-next img,
    .successNav .swiper-container-3d .swiper-slide-shadow-right,
    .successNav .swiper-container-3d .swiper-slide-shadow-left,
    .successNav .swiper-slide.swiper-slide-prev img,
    .successNav .swiper-slide.swiper-slide-prev {
        border-radius: 5px !important;
    }

    .successNav {
        position relative

        .banner-prev,.banner-next {
            position absolute
            top 50%
            outline none
            cursor pointer
        }
        .banner-prev {
            left -50px
        }
        .banner-next {
            right  -50px
        }
    }


    .bannerWrapper {
        width 80%
        margin 0 auto

        .swiper-container {
            margin 0 auto
        }

        .swiper-slide {
            width: 100%;
        }

        .bannerImg {
            width 100%
            height 240px
        }
    }

</style>
