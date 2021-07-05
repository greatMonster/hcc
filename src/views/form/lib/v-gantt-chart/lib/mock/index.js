import dayjs from "dayjs";
import Mock from "mockjs";
const colorList = ["(252, 105, 100)","(247, 167, 71)","(116, 202, 90)","(83, 186, 241)","(208, 142, 2231)"]
const nameList = "铁锤号,寿星号,星星号,罗曼斯卡,欲望号,霹雳雷电号,消防号,欧洲之星号".split(',')

const typeList ='🚅,🚈,'.split(',')

const Random = Mock.Random
var template = {
  'id': () => 'JHR'+Random.natural(100, 999)+Random.character('upper')+Random.character('upper'),
  'name':()=>Random.pick(nameList),
  'type':()=> Random.pick(typeList),
  'colorPair':()=>{
    let a = 'rgb'+Random.pick(colorList);
    return{
      dark:a.replace(')',',0.8)'),
      light:a.replace(')',',0.1)')
    }
},
  'speed': ()=>Random.natural(0, 200),
  'gtArray': () => {
    let temp = [];
    let i = 0;
    let j = Random.natural(1, 9);
    let tempStart = dayjs().subtract(12,'hour');
    let tempEnd = dayjs().subtract(12,'hour');

    while (i < j) {
      tempStart = tempEnd.add(Random.natural(1, 5), 'hour');
      tempEnd =  tempStart.add(Random.natural(1, 5), 'hour');
      temp.push({
        'id': 'D'+Random.natural(1000, 9999),
        'passenger':Random.natural(10, 200),
        'start':tempStart.toString(),
        'end': tempEnd.toString(),
      })
      
      i++;
    }
    return temp;
  },
  
}

function mockDatas(nums) {
  let datas = [];
  for (let i = 0,
      j = Random.natural(nums, nums); i < j; i++) {
    datas.push(Mock.mock(template))
  }
  return datas
}

export {
  mockDatas
}