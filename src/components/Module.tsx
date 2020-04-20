import React from 'react'
import Draggable, { DraggableEventHandler, DraggableData } from 'react-draggable'
import { WiringCore } from './SVGCanvas'

const WIRING_CORE_PIN_COLOR = '#CCC'
const WIRING_BASE_MODULE_BG_STYPE = { fill: '#EEE', fillOpacity: 0.7 }

export interface WiringCorePosition {
  x: number;
  y: number;
}

type WiringBasePinMode = 'left' | 'right'

interface WiringBasePinProps extends WiringCorePosition {
  name?: string;
  mode?: WiringBasePinMode;
}

interface WiringBasePinLinkProps {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
}

export function WiringCorePinLink (props: WiringBasePinLinkProps) {
  const { sx, sy, ex, ey } = props
  return (
    <path
      d={`
        M ${sx} ${sy}
        C ${sx + 50} ${sy}, ${ex - 50} ${ey}, ${ex} ${ey}
      `}
      stroke={WIRING_CORE_PIN_COLOR}
      fill='transparent'
    />
  )
}

export function WiringBasePin (props: WiringBasePinProps) {
  const currMode: WiringBasePinMode = props.mode || 'left'
  switch (currMode) {
    case 'right': {
      return (
        <g>
          <circle cx={200 - props.x} cy={props.y} r={4} fill={WIRING_CORE_PIN_COLOR} />
          <text x={200 - props.x - 8} y={props.y + 5} fill='#777' textAnchor='end'>{props.name || ''}</text>
        </g>
      )
    }
    case 'left':
    default: {
      return (
        <g>
          <circle cx={props.x} cy={props.y} r={4} fill={WIRING_CORE_PIN_COLOR} />
          <text x={props.x + 8} y={props.y + 5} fill='#777'>{props.name || ''}</text>
        </g>
      )
    }
  }
}

export interface DraggableDataWithWiringId extends DraggableData {
  id: string
}

interface WiringBaseModuleProps {
  id: string;
  isDraggable?: boolean;
  leftPins: WiringCore.Pin[];
  rightPins: WiringCore.Pin[];
  defaultPositon: WiringCorePosition;
  title: string;
  pins: WiringCore.State['pinsIndex'];
  onDragModule(data: DraggableDataWithWiringId): void
}

function WiringBaseModule (props: WiringBaseModuleProps) {
  const currHeight = Math.max(props.leftPins.length, props.rightPins.length, 5) * 14 + 30
  const { pins } = props

  const renderLeftPins = () => props.leftPins.map((item, i) => (
    <WiringBasePin x={10} y={34 + i * 22} name={pins[item.id].text} key={item.id} />
  ))

  const renderRightPins = () => props.rightPins.map((item, i) => (
    <WiringBasePin x={10} y={34 + i * 22} name={pins[item.id].text} mode='right' key={item.id} />
  ))

  const render = () => (
    <g>
      <rect
        x={0} y={0}
        height={currHeight} width={200}
        style={WIRING_BASE_MODULE_BG_STYPE}
      />
      <text x={6} y={20}>{props.title}</text>
      {renderLeftPins()}
      {renderRightPins()}
    </g>
  )

  const handleDarg: DraggableEventHandler = (_, data) => {
    props.onDragModule({ ...data, id: props.id })
  }

  if (props.isDraggable) {
    return (
      <Draggable
        defaultPosition={props.defaultPositon}
        onDrag={handleDarg}
      >
        {render()}
      </Draggable>
    )
  }
  return render()
}

export default WiringBaseModule
