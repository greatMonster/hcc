<template>
  <div class="ruler">
    <div v-for="(item,i) in cm" :key="i" class="cm">
      <div v-for="(items,index) in mm" :key="index" class="mm" />
    </div>
    <div class="cm" />
  </div>
</template>

<script>
export default {
  name: 'SvgIcon',
  data() {
    return {
      cm: [1, 2, 3, 4, 5],
      mm: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  }
}
</script>

<style scoped>
.ruler {
 position: relative;
 width: 100%;
 height: 14px;
}
.ruler .cm,
.ruler .mm {
 position: absolute;
 border-left: 1px solid #555;
 height: 14px;
 width: 20%;
}
.ruler .cm:after {
 position: absolute;
 bottom: -15px;
 font: 11px/1 sans-serif;
}
.ruler .mm {
 height: 5px;
 bottom: 0;
}
.ruler .mm:nth-of-type(5) {
 height: 10px;
}
.ruler .cm:nth-of-type(1) {
 left: 0%;
}

.ruler .cm:nth-of-type(2) {
 left: 20%;
}

.ruler .cm:nth-of-type(3) {
 left: 40%;
}

.ruler .cm:nth-of-type(4) {
 left: 60%;
}

.ruler .cm:nth-of-type(5) {
 left: 80%;
}

.ruler .cm:nth-of-type(6) {
 left: 100%;
}

.ruler .cm:nth-of-type(7) {
 left: 60%;
}

.ruler .cm:nth-of-type(8) {
 left: 70%;
}

.ruler .cm:nth-of-type(9) {
 left: 80%;
}

.ruler .cm:nth-of-type(10) {
 left: 90%;
}

.ruler .cm:nth-of-type(11) {
 left: 100%;
}

.ruler .mm:nth-of-type(1) {
 left: 10%;
}
.ruler .mm:nth-of-type(2) {
 left: 20%;
}
.ruler .mm:nth-of-type(3) {
 left: 30%;
}
.ruler .mm:nth-of-type(4) {
 left: 40%;
}
.ruler .mm:nth-of-type(5) {
 left: 50%;
}
.ruler .mm:nth-of-type(6) {
 left: 60%;
}
.ruler .mm:nth-of-type(7) {
 left: 70%;
}
.ruler .mm:nth-of-type(8) {
 left: 80%;
}
.ruler .mm:nth-of-type(9) {
 left: 90%;
}
.ruler .mm:nth-of-type(10) {
 left: 100%;
}
</style>
