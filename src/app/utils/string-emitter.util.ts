import { EventEmitter } from '@angular/core';

export function createStringEmitter(emitter: EventEmitter<string>) {
  return (value: string | number | null) => {
    const stringValue = String(value);
    emitter.emit(stringValue);
  };
}
