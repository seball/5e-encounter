import { EventEmitter } from '@angular/core';

export function createNumberEmitter(emitter: EventEmitter<number>) {
  return (value: string | number) => {
    const numValue = Number(value);
    emitter.emit(numValue);
  };
}
