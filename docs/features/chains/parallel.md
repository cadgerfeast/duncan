---
title: Duncan - Features - Chains - Parallel
---
# Parallel

The `ParallelChain` extends the `Chain` class and executes the `handlers` in parallel.

``` typescript
interface Person {
  firstname: string;
  lastname: string;
}
const parallelChain = new Duncan.ParallelChain<Person>({
  name: 'Parallel Chain',
  handlers: [
    new Duncan.Command<Person>({
      name: 'Command 1',
      async handler (context) {
        // Do something with the Person object
        return context;
      }
    }),
    new Duncan.Command<Person>({
      name: 'Command 2',
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

## Options

Name | Description | Default
--- | --- | ---
`[validate(results)]` | An `async` function used to validate the `chain`. | Rejects the `chain` execution if one error occurs.
