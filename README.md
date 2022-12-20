# duncan

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cadgerfeast_duncan&metric=alert_status)](https://sonarcloud.io/dashboard?id=cadgerfeast_duncan)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=cadgerfeast_duncan&metric=coverage)](https://sonarcloud.io/dashboard?id=cadgerfeast_duncan)
[![Version](https://badge.fury.io/js/duncan.svg)](https://www.npmjs.com/package/duncan)
[![Downloads](https://img.shields.io/npm/dt/duncan.svg)](https://www.npmjs.com/package/duncan)
[![License](https://img.shields.io/npm/l/duncan.svg)](https://github.com/cadgerfeast/duncan/blob/master/LICENSE)

> Great and Responsable TypeScript Chains

**Duncan** is a JavaScript library that allows to organize `asynchronous operations` under a set of commands to be executed `sequentially`, or `in parallel`.

The library is heavily inspired by the [Chain of Responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility) pattern, except it also allows to have chains in `parallel`.

In short, `Duncan` let's you organise `asynchronous operations` just like you would inside a `Pipeline`.

## Installation

``` bash
npm install duncan --save
```

## Usage

``` typescript
// Import the library
import * as Duncan from 'duncan';

// Define commands
const myFirstCommand = new Duncan.Command({
  name: 'My First Command',
  async handler (context) {
    // Do something awesome
    return context;
  }
});
const mySecondCommand = new Duncan.Command({
  name: 'My Second Command',
  async handler (context) {
    // Do something even more awesome
    return context;
  }
});
// Define a sequential chain
const mySequentialChain = new Duncan.SequentialChain({
  name: 'My Sequential Chain',
  handlers: [
    myFirstCommand,
    mySecondCommand
  ]
});
await mySequentialChain.execute();
// Define a parallel chain
const myParallelChain = new Duncan.ParallelChain({
  name: 'My Sequential Chain',
  handlers: [
    myFirstCommand,
    mySecondCommand
  ]
});
await myParallelChain.execute();
```

## Contributors

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/cadgerfeast" target="_blank">
          <img src="https://github.com/cadgerfeast.png?size=100" alt="cadgerfeast" width="100px" style="min-width: 100px">
          <br/>
          <span>cadgerfeast</span>
        </a>
      </td>
    </tr>
  </tbody>
</table>

## License

MIT
