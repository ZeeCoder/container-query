// @flow
import type { ContainerSize } from "../flow/types";

export default function getContainerSize(
  container: HTMLElement
): ContainerSize {
  return {
    width: container.clientWidth,
    height: container.clientHeight
  };
}
