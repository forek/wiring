import React from 'react'
import { DraggableData } from 'react-draggable'
import { WiringCore } from './SVGCanvas'
import { WIRING_CORE_PIN_COLOR, WIRING_BASE_PIN_LINK_RANGE } from './constants'

type ReactDraggableData = DraggableData

export declare namespace WiringBase {
  export interface DraggableData extends ReactDraggableData {
    id: string
  }

  export interface Position {
    x: number;
    y: number;
  }

  export interface ModuleProps {
    id: string;
    isDraggable?: boolean;
    defaultPositon: Position;
    onDragModule(data: DraggableData): void;
    onClickPin(pin: WiringCore.Pin, event: React.MouseEvent<SVGSVGElement, MouseEvent>): void;
  }

  export interface PinLinkProps {
    startPoint: Position;
    endPoint: Position;
    startVec: Position;
    endVec: Position;
    className?: string;
  }

  export interface PinInfo {
    position: Position;
    vec: Position;
    client: Position;
  }

  export interface Module<T extends ModuleProps> {
    (props: T): JSX.Element;
    getPinInfo(pin: WiringCore.Pin, module: WiringCore.Module): PinInfo;
  }
}

function getRange (start: number, end: number, value: number) {
  if (value < start) return start
  if (value > end) return end
  return value
}

export function PinLink (props: WiringBase.PinLinkProps) {
  const { startPoint, endPoint, startVec, endVec, className } = props

  const dx = Math.abs(startPoint.x - endPoint.x)
  const dy = Math.abs(startPoint.y - endPoint.y)

  const calcRange = (v: number) => getRange(WIRING_BASE_PIN_LINK_RANGE[0], WIRING_BASE_PIN_LINK_RANGE[1], v)

  const c = {
    sx: startPoint.x + startVec.x * calcRange(dx),
    sy: startPoint.y + startVec.y * calcRange(dy),
    ex: endPoint.x + endVec.x * calcRange(dx),
    ey: endPoint.y + endVec.y * calcRange(dy)
  }
  // console.log(startPoint, endPoint, startVec, endVec, c)
  return (
    <path
      className={className}
      d={`
        M ${startPoint.x} ${startPoint.y}
        C ${c.sx} ${c.sy}, ${c.ex} ${c.ey}, ${endPoint.x} ${endPoint.y}
      `}
      stroke={WIRING_CORE_PIN_COLOR}
      fill='transparent'
    />
  )
}
