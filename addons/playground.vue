<template>
  <div class="playground">
    <header>
      <label>Sample:</label>
      <select v-model="sample" @change="updateModel">
        <option v-for="sample in samples" :key="sample.name">{{ sample.name }}</option>
      </select>
      <div class="actions">
        <button @click="run" :disabled="running">
          <Icon :src="'/icons/play.svg'" size="18px" class="icon"/>
        </button>
      </div>
    </header>
    <Schema :model="schema"/>
  </div>
</template>

<script lang="ts">
  // Helpers
  import { defineComponent, reactive } from 'vue';
  import { Step, logger } from './index';
  import * as Duncan from '../src';
  // Partials
  import Schema from './components/schema.vue';
  // Types
  type Sample = { default: Step };
  // Constants
  const samples = Object.values<Sample>(import.meta.glob('./samples/*.json', { eager: true })).map((s) => s.default);

  export default defineComponent({
    name: 'Playground',
    components: {
      Schema
    },
    setup () {
      return { samples };
    },
    data () {
      const sample = samples[0].name;
      const model = samples.find((s) => s.name === sample) as Step;
      const schema = reactive(this.computeSchemaModel(model)) as Step;
      const duncan = this.computeDuncanModel(schema) as Duncan.Handler;
      return {
        running: false,
        sample,
        schema,
        duncan,
        context: {}
      };
    },
    methods: {
      computeSchemaModel (model: Step): Step {
        return {
          name: this.sample,
          type: 'sequential',
          children: [
            {
              name: 'Start',
              type: 'node',
              meta: {
                state: 'unknown',
                result: true,
                duration: 0
              }
            },
            model,
            {
              name: 'End',
              type: 'node',
              meta: {
                state: 'unknown',
                result: true,
                duration: 0
              }
            }
          ]
        };
      },
      computeDuncanHandler (model: Step) {
        switch (model.type) {
          case 'node': {
            return new Duncan.Command({
              name: model.name,
              async handler (context) {
                logger.debug(`"${this.name}" command started.`);
                if (model.meta) {
                  model.meta.state = 'in-progress';
                }
                await Duncan.delay(model.meta?.duration);
                if (!model.meta?.result) {
                  if (model.meta) {
                    model.meta.state = 'failure';
                  }
                  throw new Error(`"${this.name}" command failed.`);
                } else {
                  if (model.meta) {
                    model.meta.state = 'success';
                  }
                  logger.info(`"${this.name}" command succeeded.`);
                }
                return context;
              }
            });
          }
          case 'sequential': {
            const sequential = new Duncan.SequentialChain({
              name: model.name
            });
            if (model.children) {
              for (const child of model.children) {
                sequential.append(this.computeDuncanHandler(child));
              }
            }
            return sequential;
          }
          case 'parallel': {
            const parallel = new Duncan.ParallelChain({
              name: model.name
            });
            if (model.children) {
              for (const child of model.children) {
                parallel.append(this.computeDuncanHandler(child));
              }
            }
            return parallel;
          }
        }
      },
      computeDuncanModel (model: Step) {
        const chain = new Duncan.SequentialChain({
          name: this.sample
        });
        chain.append(new Duncan.Command({
          name: 'Start',
          async handler (context) {
            return context;
          }
        }));
        chain.append(this.computeDuncanHandler(model));
        chain.append(new Duncan.Command({
          name: 'End',
          async handler (context) {
            return context;
          }
        }));
        return chain;
      },
      updateModel () {
        const model = samples.find((s) => s.name === this.sample) as Step;
        this.schema = this.computeSchemaModel(model);
        this.duncan = this.computeDuncanModel(this.schema);
      },
      cleanupStates (model: Step) {
        if (model.meta) {
          model.meta.state = 'unknown';
        }
        if (model.children) {
          for (const child of model.children) {
            this.cleanupStates(child);
          }
        }
      },
      async run () {
        this.running = true;
        try {
          this.cleanupStates(this.schema);
          await this.duncan.execute(this.context);
        } catch (_err) {
          const err = _err as Error;
          logger.error(err.message);
        }
        this.running = false;
      }
    }
  });
</script>

<style lang="scss" scoped>
  div.playground {
    position: relative;
    z-index: 0;
    > header {
      display: flex;
      flex-direction: row;
      padding: 20px 0;
      border-bottom: 1px solid var(--madoc-grey-60);
      margin-bottom: 20px;
      > label {
        font-weight: bold;
        align-items: center;
        display: flex;
        margin-right: 5px;
        font-size: 14px;
      }
      > select {
        background-color: var(--madoc-grey-100);
        color: var(--madoc-navy);
        width: 120px;
        border: 1px solid #999;
        font-size: 14px;
        border-radius: 5px;
      }
      > div.actions {
        margin-left: auto;
        > button {
          background-color: var(--madoc-grey-100);
          border: 1px solid #999;
          font-size: 14px;
          border-radius: 5px;
          cursor: pointer;
          &[disabled] {
            cursor: default;
            opacity: .5;
          }
          > .icon {
            display: flex;
            align-items: center;
            color: var(--madoc-blue-60);
          }
        }
      }
    }
  }
</style>
