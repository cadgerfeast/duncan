<template>
  <div class="schema">
    <!-- Node -->
    <div v-if="!model.type" class="node">
      <label>{{ model.name }}</label>
    </div>
    <!-- Sequential -->
    <div v-else-if="model.type === 'sequential'" class="chain sequential">
      <div v-for="child in model.children" :key="child.name" class="child" :style="getChildStyle(child)">
        <Schema :model="child"/>
      </div>
    </div>
    <!-- Parallel -->
    <div v-else class="chain parallel">
      <div v-for="child in model.children" :key="child.name" class="child">
        <Schema :model="child"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  // Helpers
  import { defineComponent, PropType } from 'vue';
  import { Step } from '../index';

  export default defineComponent({
    name: 'Schema',
    props: {
      model: {
        type: Object as PropType<Step>,
        required: true
      }
    },
    methods: {
      getRowLength (model: Step) {
        let length = 0;
        if (model.type === 'sequential') {
          for (const child of model.children) {
            length += this.getRowLength(child);
          }
        } else if (model.type === 'parallel') {
          let maximumLength = 0;
          for (const child of model.children) {
            maximumLength = Math.max(maximumLength, this.getRowLength(child));
          }
          length += maximumLength;
        } else {
          length++;
        }
        return length;
      },
      getChildStyle (model: Step) {
        const length = this.getRowLength(model);
        return {
          'flex-grow': length
        };
      }
    }
  });
</script>

<style lang="scss" scoped>
  div.schema {
    width: 100%;
    > div.node {
      position: relative;
      border-radius: 50%;
      background: #CCCCCC;
      width: 14px;
      height: 14px;
      display: flex;
      > label {
        position: absolute;
      }
    }
    > div.chain {
      display: flex;
      &.sequential {
        flex-direction: row;
        justify-content: space-between;
      }
      &.parallel {
        flex-direction: column;
      }
      > div.child {
        flex-grow: 1;
      }
    }
  }
</style>
