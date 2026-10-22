// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

/**
 * A single process can end up with two copies of this package loaded at once: `dist/index.js`
 * (resolved through the `import` condition) and `dist/index.cjs` (resolved through `require`) are
 * separate module graphs, so a dependency that reaches the package with `require` gets a different
 * `AudioFrame` class than one that reaches it with `import`, even though only one copy is
 * installed on disk. Node calls this the dual package hazard.
 *
 * `instanceof` compares prototype identity, so a frame produced by one copy fails `instanceof`
 * in the other despite the two classes being compiled from the same source.
 *
 * For classes whose entire meaning is their fields we can key `instanceof` on a brand instead of
 * on prototype identity. `Symbol.for` looks up the global symbol registry, which is shared by
 * every copy of a module in the process, so the brand is the same symbol everywhere. This is the
 * same technique as `Symbol.for('react.element')`, `Symbol.for('nodejs.util.inspect.custom')` and
 * the existing `Symbol.for('lk.frame-processor')` in this package.
 */

/** Anything with a prototype we can hang a brand on. */
type DataClass = abstract new (...args: never[]) => object;

/**
 * Makes `instanceof ctor` succeed for instances built by another copy of this package.
 *
 * Only call this for value types -- objects whose whole contract is their public fields, such as
 * `AudioFrame`. Do **not** call it for classes that own an FFI handle or otherwise wrap a
 * live resource (`Room`, `AudioStream`, `AudioSource`, `AudioResampler`, participants, tracks,
 * ...). The brand only asserts "this was built by some copy of this class", which for a value type
 * is the whole story, but for a live resource says nothing about the things that actually have to
 * match: handle ownership and disposal, event wiring, and the internal state the other copy's
 * methods assume. Letting those cross the boundary would replace a loud `instanceof` failure with
 * a subtler one further downstream.
 *
 * @internal
 */
export const brandDataClass = (ctor: DataClass, brand: symbol): void => {
  Object.defineProperty(ctor.prototype, brand, {
    value: true,
    enumerable: false,
    writable: false,
    configurable: false,
  });

  Object.defineProperty(ctor, Symbol.hasInstance, {
    value: function (this: unknown, value: unknown): boolean {
      // Statics are inherited, so a subclass would otherwise match every branded instance of its
      // parent. Anything that isn't the branded class itself gets the default behaviour.
      if (this !== ctor) {
        return Function.prototype[Symbol.hasInstance].call(this, value);
      }
      return (
        value !== null &&
        typeof value === 'object' &&
        (value as Record<symbol, unknown>)[brand] === true
      );
    },
    enumerable: false,
    writable: false,
    configurable: false,
  });
};
