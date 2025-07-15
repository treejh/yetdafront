import type { StateCreator } from "zustand";

export interface ExampleSlice {
  count: number;
  increase: () => void;
  decrease: () => void;
}

export const createExampleSlice: StateCreator<
  ExampleSlice,
  [],
  [],
  ExampleSlice
> = set => ({
  count: 0,
  increase: () => set(state => ({ count: state.count + 1 })),
  decrease: () => set(state => ({ count: state.count - 1 })),
});
