<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" :class="{'animation':runFlapCardAnimation}">
      <div class="flap-card"
           v-for="(item,index) in flapCardList"
           :key="index"
           :style="{zIndex:item.zIndex}"
      >
        <div class="flap-card-circle">
          <div class="flap-card-semi-circle flap-card-semi-circle-left"
               :style="semiCircleStyle(item,'left')"
               ref="left"
          ></div>
          <div class="flap-card-semi-circle flap-card-semi-circle-right"
               :style="semiCircleStyle(item,'right')"
               ref="right"
          ></div>
        </div>
      </div>
      <div class="point-wrapper">
        <div class="point"
             v-for="item in pointList"
             :key="item"
             :class="{'animation':runPointAnimation}"
        ></div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <div class="icon-close"></div>
    </div>
  </div>
</template>

<script>
  import { storeHomeMixin } from '../../utils/mixin'
  import { flapCardList } from '../../utils/store'

  export default {
    name: 'FlapCard',
    mixins: [storeHomeMixin],
    data() {
      return {
        flapCardList,
        front: 0,
        back: 1,
        intervalTime: 25,
        runFlapCardAnimation: false,
        pointList: null,
        runPointAnimation: false
      }
    },
    watch: {
      flapCardVisible(v) {
        if (v) {
          this.runAnimation()
        } else {
          this.stopAnimation()
        }
      }
    },
    methods: {
      stopAnimation() {
        // 隐藏div.flap-card-bg
        this.runFlapCardAnimation = false
        // 清除定时器
        if (this.task) {
          clearInterval(this.task)
        }
        // 重置
        this.reset()
      },
      reset() {
        this.front = 0
        this.back = 1
        this.flapCardList.forEach((item, index) => {
          item.rotateDegree = 0
          item._g = item.g
          item.zIndex = 100 - index
          this.rotate(index, 'front')
          this.rotate(index, 'back')
        })
      },
      close() {
        this.setFlapCardVisible(false)
      },
      semiCircleStyle(item, dir) {
        return {
          backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
          backgroundSize: item.backgroundSize,
          backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
        }
      },
      rotate(index, type) {
        const item = this.flapCardList[index]
        let dom
        if (type === 'front') {
          dom = this.$refs.right[index]
        } else {
          dom = this.$refs.left[index]
        }
        dom.style.transform = `rotateY(${item.rotateDegree}deg)`
        dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`
      },
      flapCardRotate() {
        const frontFlapCard = this.flapCardList[this.front]
        const backFlapCard = this.flapCardList[this.back]
        frontFlapCard.rotateDegree += 10
        frontFlapCard._g -= 5
        backFlapCard.rotateDegree -= 10
        if (backFlapCard.rotateDegree <= 90) {
          backFlapCard._g += 5
        }
        if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
          backFlapCard.zIndex += 2
        }
        this.rotate(this.front, 'front')
        this.rotate(this.back, 'back')
        if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
          this.next()
        }
      },
      next() {
        // 重制前两张
        const frontFlapCard = this.flapCardList[this.front]
        const backFlapCard = this.flapCardList[this.back]
        frontFlapCard.rotateDegree = 0
        frontFlapCard._g = frontFlapCard.g
        backFlapCard.rotateDegree = 0
        backFlapCard._g = backFlapCard.g
        this.rotate(this.front, 'front')
        this.rotate(this.back, 'back')
        // 前后交替图片 front:0->1,back:1->2
        this.front++
        this.back++
        //  循环图片，防止溢出
        const len = this.flapCardList.length
        if (this.front >= len) {
          this.front = 0
        }
        if (this.back >= len) {
          this.back = 0
        }
        // 动态设置DOM的z-index
        // 100->96
        // 99->100
        // 98->99
        // 97->98
        // 96->97
        this.flapCardList.forEach((item, index) => {
          item.zIndex = 100 - ((index - this.front + len) % len)
        })
        // 准备下一张图片,180度翻转就位
        this.prepare()
      },
      prepare() {
        const backFlapCard = this.flapCardList[this.back]
        backFlapCard.rotateDegree = 180
        backFlapCard._g = backFlapCard.g - 5 * 9
        this.rotate(this.back, 'back')
      },
      startFlapCardAnimation() {
        this.prepare()
        this.task = setInterval(() => {
          this.flapCardRotate()
        }, this.intervalTime)
        // 2.5s后停止卡片动画
        setTimeout(() => {
          this.stopAnimation()
        }, 2500)
      },
      startPointAnimation() {
        this.runPointAnimation = true
        setTimeout(() => {
          this.runPointAnimation = false
        }, 750)
      },
      runAnimation() {
        this.runFlapCardAnimation = true
        setTimeout(() => {
          this.startFlapCardAnimation()
          this.startPointAnimation()
        }, 300)
      }
    },
    created () {
      this.pointList = []
      for (let i = 0; i < 18; i++) {
        this.pointList.push(`point${i}`)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  @import "../../assets/styles/flapCard";

  .flap-card-wrapper{
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: rgba(0,0,0,.6);
    @include center;
    @include absCenter;
    .flap-card-bg{
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 5px;
      background: #fff;
      transform: scale(0);
      opacity: 0;
      &.animation{
        animation: flap-card-move .3s ease-in both;
      }
      @keyframes flap-card-move {
        0%{
          transform: scale(0);
          opacity: 0;
        }
        50%{
          transform: scale(1.2);
          opacity: 1;
        }
        75%{
          transform: scale(.9);
          opacity: 1;
        }
        100%{
          transform: scale(1);
          opacity: 1;
        }
      }
      .flap-card{
        width: 48px;
        height: 48px;
        @include absCenter;
        .flap-card-circle{
          display: flex;
          width: 100%;
          height: 100%;
          .flap-card-semi-circle{
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-repeat: no-repeat;
            backface-visibility: hidden;
            &.flap-card-semi-circle-left{
              border-radius: 24px 0 0 24px;
              background-position: center right;
              transform-origin: right;
            }
            &.flap-card-semi-circle-right{
              border-radius: 0 24px 24px 0;
              background-position: center left;
              transform-origin: left;
            }
          }
        }
      }

      .point-wrapper{
        z-index: 1500;
        @include absCenter;
        .point{
          border-radius: 50%;
          @include absCenter;
          &.animation{
            @for $i from 1 through length($moves) {
              &:nth-child(#{$i}){
                @include move($i);
              }
            }
          }
        }
      }
    }
    .close-btn-wrapper{
      position: absolute;
      left: 0;
      bottom: 30px;
      width: 100%;
      z-index: 1100;
      @include center;
      .icon-close{
        width: 45px;
        height: 45px;
        font-size: 25px;
        border-radius: 50%;
        background: #333;
        color: #fff;
        @include center;
      }
    }
  }
</style>
