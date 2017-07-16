// @flow
import type { ContainerSize } from "../../common/src/types";

export default function getContainerSize(
  container: HTMLElement
): ContainerSize {
  return {
    width: container.clientWidth,
    height: container.clientHeight
  };
}
