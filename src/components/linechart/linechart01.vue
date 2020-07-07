<template>
  <div class="content">
    <div
      class="demandEcharts"
      id="demandEcharts"
      @mouseover="echartMouseOver"
      @mouseleave="echartMouseLeave"
    ></div>
  </div>
</template>
<script>
import echarts from "echarts";
import {setInterval,cleatInterval} from "timers"
export default {
  data() {
    return {
      demandList: [
        {
          name: "油料",
          data: [310, 290, 300, 290, 300, 310, 290],
          type: 0,
          unit: "万吨"
        },
        {
          name: "弹药",
          data: [300, 310, 290, 280, 290, 300, 290],
          type: 0,
          unit: "万吨"
        },
        {
          name: "给养",
          data: [280, 270, 275, 270, 280, 275, 270],
          type: 0,
          unit: "万吨"
        },
        {
          name: "卫勤物资",
          data: [160, 155, 160, 150, 155, 160, 155],
          type: 1,
          unit: "万件套"
        },
        {
          name: "被装",
          data: [155, 160, 150, 148, 155, 160, 140],
          type: 1,
          unit: "万件套"
        },
        {
          name: "工程野营",
          data: [150, 155, 155, 160, 140, 145, 135],
          type: 1,
          unit: "万件套"
        },
        {
          name: "维修器材",
          data: [75, 90, 85, 80, 75, 70, 70],
          type: 1,
          unit: "万件套"
        }
      ],
      dataChart: null,
      mTime: null
    };
  },
  mounted() {
    this.getDemandChart("demandEcharts", "");
    this.echartMouseLeave();
  },
  methods: {
    echartMouseOver() {
      if(this.dataChart!=null){
        clearInterval(this.mTime);
        this.dataChart.dispatchAction({
          type:"downplay"
        })
      }
    },
    echartMouseLeave() {
      if(this.dataChart != null){
        let dataChart = this.datChart;
        var length = this.demandList[0].data.length;
        var dataIndex = 0;
        var seriesIndex = 0;
        this.mTime = setInterval(function(){
          dataChart.dispatchAction({
            type:"showTip",
            seriesIndex:seriesIndex,
            dataIndex:dataIndex
          });
          dataIndex++;
          if(dataIndex>length) dataIndex =0;
          if(dataIndex >length/2) seriesIndex =1;
          else seriesIndex =0;
        },2000);
      }
    },
    //整理需求趋势图所需数据
    getDemandSeries() {
      var demandSeries=[];
      this.demandList.forEach(item =>{
        var demandItem = {};
        demandItem.name = item.name;
        demandItem.type = "line";
        demandItem.smooth = true;
        demandItem.data =[];
        for(var i = 0;i<item.data.length;i++){
          if(i<item.data.length/2){
            demandItem.data.push(item.data[i]);
          }else{
            demandItem.data.push("-");
          }
        }
        demandItem.yAxisIndex = item.type;
        demandSeries.push(demandItem);

        var demandItemDashed ={};
        demandItemDashed.name=item.name;
        demandItemDashed.type = "line";
        demandItemDashed.smooth=true;
        demandItemDashed.yAxisIndex = item.type;
        demandItemDashed.data =[];
        for(var i =0;i<item.data.length;i++){
          if(i<item.data.length/2-1){
            demandItemDashed.data.push("-");
          }else{
            demandItemDashed.data.push(item.data[i]);
          }
        }
        demandItemDashed.lineStyle = {
          type:"dashed"
        };
        demandSeries.push(demandItemDashed);
      });
      console.log(demandSeries);
      return demandSeries
    },

    //需求趋势图
    getDemandChart(echartsId, valueArray) {
      let dataChartBefore = document.getElementById(echartsId);
      this.dataChart = echarts.init(dataChartBefore);
      var currentdemandList = this.demandList;
      this.dataChart.setOption({
        color: ["#ffffff", "#00ff99", "#ff66ff", "#ff9900", "#33ffff", "#ff0000", "#008000"],
        tooltip: {
          trigger: "axis",
          enterable: true,
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          },
          position: function(point, params, dom, rect, size) {
            return [point[0] - 60, -5];
          },
          formatter: function(params, ticket, callback) {
            var htmlStr = "";
            var varMap = {};
            var index = 0;
            for (var i = 0; i < params.length; i++) {
              var param = params[i];
              var xName = param.name;
              var seriesName = param.seriesName;
              var value = param.value;
              var color = param.color;

              if (value == "-") {
                continue;
              }
              if (varMap[seriesName] == value) {
                continue;
              }
              if (i == 0 || i == 1) {
                htmlStr += xName + "<br/>";
              }
              htmlStr +=
                '<span style ="line-height:14px;font-size:14px;color:' +
                color +
                ';">' +
                ++index +
                "、" +
                seriesName +
                ":" +
                value +
                "(" +
                currentdemandList[index - 1].unit +
                ")" +
                "</span>" +
                "<br/>";
              varMap[seriesName] = value;
            }
            return htmlStr;
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
          height:'80%',
          width:'85%'
        },
        xAxis: [
        {
          type: "category",
          boundaryGap: true,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          axisPointer:{
            value:'4月',
            snap:true,
            lineStyle:{
              color:"#004E52",
              width:2
            },
            handle:{
              show:true,
              color:"#004E52"
            }
          },
          axisLine:{
            lineStyle:{
              color:"#ccc"
            }
          },
          splitLine:{
            lineStyle:{
              color:"#0b336b"
            }
          }
        }
        ],
        yAxis: [
          {
            name:'(万吨)',
            type:'value',
            axisLine:{
              lineStyle:{
                color:'#ccc'
              }
            },
            splitLine:{
              lineStyle:{
                color:"#0b336b"
              }
            }
          },
           {
            name:'(万件套)',
            type:'value',
            min:0,
            max:200,
            splitNumber:5,
            axisLine:{
              lineStyle:{
                color:'#ccc'
              }
            },
            splitLine:{
              lineStyle:{
                color:"#0b336b"
              }
            }
          }
        ],
        series: this.getDemandSeries()
      });
    }
  }
};
</script>
<style>
.content {
  width: 100%;
  height: 100%;
  background: #00244c;
  overflow: hidden;
}
.demandEcharts {
  height: 500px;
  width: 1000px;
}
</style>
