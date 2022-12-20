---
title: Duncan - Features - Commands
---
# Commands

A `Command` is only a wrapper around an `asynchronous operation` that should be executed with the `execute` method.

``` typescript
interface Person {
  firstname: string;
  lastname: string;
}
const greatCommand = new Duncan.Command<Person>({
  name: 'Great Command',
  async handler (context) {
    // Do something with the Person object
    return context;
  }
});
const person = {
  firstname: 'Melissa',
  lastname: 'Morel'
};
await greatCommand.execute(person);
```

## Options

Name | Description | Default
--- | --- | ---
`name` | A unique identifier. |
`handler(context)` | The actual function for your **asynchronous operation**. |

## Methods

Name | Description | Parameters
--- | --- | ---
`execute` | Executes the command `handler`. | `context`
