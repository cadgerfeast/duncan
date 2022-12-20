<template>
  <div :class="['shine-toggle', { active: s_value, focused }]" @click="onClick">
    <div class="slider">
      <div class="switch">
        <Icon v-show="s_value" src="/icons/checkmark.svg" size="12px"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  // Helpers
  import { defineComponent, PropType } from 'vue';

  export default defineComponent({
    name: 'ShineToggle',
    emits: ['update:modelValue', 'change'],
    props: {
      modelValue: {
        type: Boolean as PropType<boolean>,
        default: false
      }
    },
    data () {
      return {
        s_value: this.modelValue,
        focused: false,
        focusable: false
      };
    },
    computed: {
      tabindex () {
        return this.focusable ? '0' : '-1';
      }
    },
    watch: {
      modelValue () {
        this.s_value = this.modelValue;
      }
    },
    methods: {
      setValue (value: boolean) {
        this.s_value = value;
        this.$emit('update:modelValue', value);
        this.$emit('change', value);
      },
      focus () {
        this.focusable = true;
      },
      onClick () {
        this.setValue(!this.s_value);
      }
    }
  });
</script>

<style lang="scss" scoped>
  div.shine-toggle {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    user-select: none;
    > div.slider {
      position: relative;
      width: 30px;
      height: 16px;
      background-color: #6b7585;
      border-radius: 8px;
      transition: background-color 0.5s ease;
      > div.switch {
        position: absolute;
        top: 1px;
        bottom: 1px;
        left: 1px;
        content: '';
        display: flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
        background-color: #fdfdfd;
        border-radius: 50%;
        transition: right 0.5s ease;
      }
    }
    &.active {
      > div.slider {
        background-color: #2a60c8;
        > div.switch {
          color: #2a60c8;
          left: unset;
          right: 1px;
        }
      }
    }
  }
</style>