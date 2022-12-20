---
title: Duncan - Features - Chains - Sequential
---
# Sequential

The `SequentialChain` extends the `Chain` class and executes the `handlers` sequentially.

``` typescript
interface Person {
  firstname: string;
  lastname: string;
}
const sequentialChain = new Duncan.SequentialChain<Person>({
  name: 'Sequential Chain',
  handlers: [
    new Duncan.Command<Person>({
      name: 'First Command',
      async handler (context) {
        // Do something with the Person object
        return context;
      }
    }),
    new Duncan.Command<Person>({
      name: 'Second Command',
      async handler (context) {
        // Do something else with the Person object
        return context;
      }
    })
  ]
});
const person = {
  firstname: 'Melissa',
  lastname: 'Morel'
};
await sequentialChain.execute(person);
```
