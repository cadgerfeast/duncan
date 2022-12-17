// Components
import Playground from './playground.vue';

export interface Step {
  name: string;
  type?: 'sequential'|'parallel';
  children: Step[];
}

export default [
  {
    components: [
      Playground
    ]
  }
];
