<template>
  <div class="playground">
    <header>
      <select v-model="sample">
        <option v-for="sample in samples" :key="sample.name">{{ sample.name }}</option>
      </select>
    </header>
    <Schema :model="model"/>
  </div>
</template>

<script lang="ts">
  // Helpers
  import { defineComponent } from 'vue';
  import { Step } from './index';
  // Partials
  import Schema from './components/schema.vue';
  // Constants
  const samples = Object.values(import.meta.glob('./samples/*.json', { eager: true })).map((s: { default: Sample }) => s.default);
  // TODO links
  // TODO graph view like jenkins blue ocean
  // TODO each handler should have a on/off handler
  // TODO can activate debug mode (handlers are stopped and wait for click)

  export default defineComponent({
    name: 'Playground',
    components: {
      Schema
    },
    setup () {
      return { samples };
    },
    data () {
      return {
        sample: samples[0].name
      };
    },
    computed: {
      model () {
        const sample = samples.find((s) => s.name === this.sample) as Step;
        return {
          name: sample.name,
          type: 'sequential',
          children: [
            {
              name: 'Start'
            },
            sample,
            {
              name: 'End'
            }
          ]
        };
      }
    }
  });
</script>

<style lang="scss" scoped>
  div.playground {
    > header {
      padding: 20px 0;
      border-bottom: 1px solid var(--madoc-grey-60);
      > select {
        background-color: var(--madoc-grey-100);
        color: var(--madoc-navy);
        width: 120px;
        border: 1px solid #999;
        font-size: 14px;
        border-radius: 5px;
      }
    }
  }
</style>
