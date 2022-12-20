<template>
  <div class="schema">
    <!-- Node -->
    <div v-if="model.type === 'node'" ref="node" class="node">
      <div class="container">
        <div v-if="model.name !== 'Start' && model.name !== 'End' && model.meta" :class="['job', model.meta.state]">
          <div class="actions">
            <Toggle v-model="model.meta.result" class="toggle"/>
          </div>
        </div>
        <label>{{ model.name }}</label>
      </div>
    </div>
    <!-- Sequential -->
    <div v-else-if="model.type === 'sequential'" class="chain sequential">
      <div v-for="child, in model.children" :key="child.name" class="child" :style="getChildStyle(child)">
        <Schema ref="sequential" :model="child"/>
      </div>
    </div>
    <!-- Parallel -->
    <div v-else class="chain parallel">
      <div v-for="child in model.children" :key="child.name" class="child">
        <Schema ref="parallel" :model="child"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  // Helpers
  import { defineComponent, PropType, ref } from 'vue';
  import { Step, connectElements, disconnectElements } from '../index';
  import { SchemaInstance, Node } from './schema';
  // Components
  import Toggle from './toggle.vue';
  
  export default defineComponent({
    name: 'Schema',
    components: {
      Toggle
    },
    props: {
      model: {
        type: Object as PropType<Step>,
        required: true
      }
    },
    setup () {
      const node = ref<HTMLDivElement>();
      const sequential = ref<SchemaInstance[]>();
      const parallel = ref<SchemaInstance[]>();
      return { node, sequential, parallel };
    },
    methods: {
      getRowLength (model: Step) {
        let length = 0;
        if (model.type === 'sequential') {
          if (model.children) {
            for (const child of model.children) {
              length += this.getRowLength(child);
            }
          }
        } else if (model.type === 'parallel') {
          let maximumLength = 0;
          if (model.children) {
            for (const child of model.children) {
              maximumLength = Math.max(maximumLength, this.getRowLength(child));
            }
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
      },
      getParentNodes (): HTMLDivElement[] {
        const nodes: HTMLDivElement[] = [];
        if (this.node) {
          nodes.push(this.node);
        }
        if (this.sequential && this.sequential.length) {
          nodes.push(...this.sequential[this.sequential.length - 1].getParentNodes());
        }
        if (this.parallel) {
          for (const child of this.parallel) {
            nodes.push(...child.getParentNodes());
          }
        }
        return nodes;
      },
      getNodes (parents: HTMLDivElement[] = []): Node[] {
        const nodes: Node[] = [];
        if (this.node) {
          nodes.push({
            element: this.node,
            parents
          });
        }
        if (this.sequential) {
          for (let i = 0; i < this.sequential.length; i++) {
            if (!this.sequential[i - 1]) {
              nodes.push(...this.sequential[i].getNodes(parents));
            } else {
              nodes.push(...this.sequential[i].getNodes(this.sequential[i - 1].getParentNodes()));
            }
          }
        }
        if (this.parallel) {
          for (let i = 0; i < this.parallel.length; i++) {
            nodes.push(...this.parallel[i].getNodes(parents));
          }
        }
        return nodes;
      },
      drawConnections () {
        if (this.$options !== this.$parent?.$options) {
          const nodes = this.getNodes();
          for (const node of nodes) {
            for (const parent of node.parents) {
              connectElements(this.$el, node.element, parent);
            }
          }
        }
      },
      updateConnections () {
        this.removeConnections();
        this.drawConnections();
      },
      removeConnections () {
        if (this.$options !== this.$parent?.$options) {
          disconnectElements(this.$el);
        }
      }
    },
    mounted () {
      this.drawConnections();
      window.addEventListener('resize', this.updateConnections);
    },
    updated () {
      this.updateConnections();
    },
    beforeUnmount () {
      this.removeConnections();
      window.removeEventListener('resize', this.updateConnections);
    }
  });
</script>

<style lang="scss" scoped>
  div.schema {
    position: relative;
    width: 100%;
    > div.node {
      position: relative;
      width: 75px;
      height: 75px;
      display: flex;
      justify-content: center;
      align-items: center;
      > div.container {
        border-radius: 50%;
        background: var(--madoc-grey-50);
        width: 15px;
        height: 15px;
        > div.job {
          position: absolute;
          inset: 24px;
          border: 2px solid var(--madoc-grey-100);
          border-radius: 50%;
          background: var(--madoc-grey-10);
          z-index: 1;
          transition: all .25s ease-in-out;
          &.in-progress {
            background: var(--madoc-yellow-60);
          }
          &.success {
            background: var(--madoc-green-60);
          }
          &.failure {
            background: var(--madoc-red-60);
          }
          > div.actions {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            margin-top: 5px;
            display: flex;
            justify-content: center;
            > .toggle {
              transform: scale(0.75);
            }
          }
        }
        > label {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          font-weight: bold;
        }
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
