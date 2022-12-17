---
model:
  - name: Home
    path: /
  - name: Getting Started
    path: /getting-started
  - name: Playground
    path: /playground
  - name: Features
    path: /features/commands
    children:
      - name: Commands
        path: /features/commands
      - name: Chains
        path: /features/chains
        children:
          - name: Sequential
            path: /features/chains/sequential
          - name: Parallel
            path: /features/chains/parallel
---
