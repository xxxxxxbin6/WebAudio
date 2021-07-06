<template>
  <div>
    <button type="primary" @click="play()">播放</button>
    <div class="pd waveBox" style="margin-left:15vw">
        <h1
          style="color:rgb(60, 136, 235);margin-left:-12vw;margin-top:4vw;font-size:1.4vw"
        >
          音频可视化波形
        </h1>
        <div
          style="border:1px solid #0604161f;display:inline-block;margin-top:-1vw"
        >
          <div style="height:15vw;width:65vw;" class="recwave"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Recorder from "recorder-core";
import PCMPlayer from "pcm-player"

//需要使用到的音频格式编码引擎的js文件统统加载进来
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";

//以上三个也可以合并使用压缩好的recorder.xxx.min.js
//比如 import Recorder from 'recorder-core/recorder.mp3.min' //已包含recorder-core和mp3格式支持

//可选的扩展支持项
import "recorder-core/src/extensions/wavesurfer.view";
export default {
  data() {
    return {
      ws: null,
      player:null
    };
  },
  methods: {
    play() {
      this.player = new PCMPlayer({
        encoding:"16bitInt",
        channels:1,
        sampleRate:32000,
        flushTime:2000
      })
      var wave;
      var set = {
        elem: ".recwave",

        scale: 2, //缩放系数，应为正整数，使用2(3? no!)倍宽高进行绘制，避免移动端绘制模糊

        fps: 50, //绘制帧率，不可过高，50-60fps运动性质动画明显会流畅舒适，实际显示帧率达不到这个值也并无太大影响

        duration: 2500, //当前视图窗口内最大绘制的波形的持续时间，此处决定了移动速率
        direction: 1, //波形前进方向，取值：1由左往右，-1由右往左
        position: 0, //绘制位置，取值-1到1，-1为最底下，0为中间，1为最顶上，小数为百分比

        centerHeight: 1, //中线基础粗细，如果为0不绘制中线，position=±1时应当设为0

        //波形颜色配置：[位置，css颜色，...] 位置: 取值0.0-1.0之间
        linear: [
          0,
          "rgba(0,187,17,1)",
          0.7,
          "rgba(255,215,0,1)",
          1,
          "rgba(255,102,0,1)"
        ],
        centerColor: "" //中线css颜色，留空取波形第一个渐变颜色
      };
      wave = Recorder.WaveSurferView(set);

      var url = "ws://10.10.10.93:8888"; //替换成自己的websocket地址
      this.ws = new WebSocket(url);
      this.ws.binaryType = "arraybuffer";
      var that = this;

      this.ws.addEventListener("open", function() {
        let jsonData = { state: "start", channel: "1" };
        that.ws.send(JSON.stringify(jsonData));
      });
      this.ws.addEventListener("message", function(event) {
        var dataAudio = new Uint8Array(event.data);
        that.player.feed(dataAudio)
        var data = new Uint16Array(event.data);
        wave.input(data, 20, 32000);
      });
    }
  }
};
</script>
