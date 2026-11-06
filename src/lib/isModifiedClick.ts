import type { MouseEvent } from "react";

export default function isModifiedClick(event: MouseEvent<HTMLElement>) {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}
