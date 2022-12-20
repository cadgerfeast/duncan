---
title: Duncan - Features - Chains
---
# Chains

A `Chain` is an `Abstract Class` and cannot be instantiated.

Duncan exports two `Chains`:
 
- <Anchor href="/features/chains/sequential">Sequential Chain</Anchor>
- <Anchor href="/features/chains/Parallel">Parallel Chain</Anchor>

Though you can create your custom class like so:

``` typescript
class InverseSequentialChain<Context = unknown> extends Duncan.Chain<Context> {
  public async execute (context: Context) {
    for (const handler of this.handlers.reverse()) {
      await handler.execute(context);
    }
    return context;
  }
}
```

## Options

Name | Description | Default
--- | --- | ---
`[handlers]` | A collection of handlers (`Chains` or `Commands`) that are added at startup. | `[]`

## Methods

Name | Description | Parameters
--- | --- | ---
`append` | Adds a handler at the end of the chain. | `handler`
`prepend` | Adds a handler at the beginning of the chain. | `handler`
`insertAfter` | Inserts a handler after another in the chain. | `handler`, `name`
`insertBefore` | Inserts a handler before another in the chain. | `handler`, `name`
