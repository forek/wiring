import React from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'

interface BPCorePosition {
  x: number;
  y: number;
}

interface BPBaseModuleProps {
  id: string;
  isDraggable?: boolean;
  leftPins: string[];
  rightPins: string[];
  defaultPositon: BPCorePosition;
  title: string;
  pins: any;
  onDragModule: any
}

interface BPBasePinProps extends BPCorePosition {
  name?: string;
  mode?: BPBasePinMode;
}

interface BPBasePinLinkProps {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
}

type BPBasePinMode = 'left' | 'right'

const BP_CORE_PIN_COLOR = '#CCC'
const BP_BASE_MODULE_BG_STYPE = { fill: '#EEE', fillOpacity: 0.7 }

export function BPCorePinLink (props: BPBasePinLinkProps) {
  const { sx, sy, ex, ey } = props
  return (
    <path
      d={`
        M ${sx} ${sy}
        C ${sx + 50} ${sy}, ${ex - 50} ${ey}, ${ex} ${ey}
      `}
      stroke={BP_CORE_PIN_COLOR}
      fill='transparent'
    />
  )
}

export function BPBasePin (props: BPBasePinProps) {
  const currMode: BPBasePinMode = props.mode || 'left'
  switch (currMode) {
    case 'right': {
      return (
        <g>
          <circle cx={200 - props.x} cy={props.y}  r={4} fill={BP_CORE_PIN_COLOR}/>
          <text x={200 - props.x - 8} y={props.y + 5} fill='#777' textAnchor='end'>{props.name || ''}</text>
        </g>
      )
    }
    case 'left':
    default: {
      return (
        <g>
          <circle cx={props.x} cy={props.y}  r={4} fill={BP_CORE_PIN_COLOR}/>
          <text x={props.x + 8} y={props.y + 5} fill='#777'>{props.name || ''}</text>
        </g>
      )
    }
  }
}

function BPBaseModule (props: BPBaseModuleProps) {
  const currHeight = Math.max(props.leftPins.length, props.rightPins.length, 5) * 14 + 30
  const { pins } = props

  const renderLeftPins = () => props.leftPins.map((item, i) => (
    <BPBasePin x={10} y={34 + i * 22} name={pins[item].name} key={item}/>
  ))

  const renderRightPins = () => props.rightPins.map((item, i) => (
    <BPBasePin x={10} y={34 + i * 22} name={pins[item].name} mode='right' key={item}/>
  ))

  const render = () => (
    <g>
      <rect
        x={0} y={0}
        height={currHeight} width={200}
        style={BP_BASE_MODULE_BG_STYPE}
      />
      <text x={6} y={20}>{props.title}</text>
      {renderLeftPins()}
      {renderRightPins()}
    </g>
  )

  const handleDarg: DraggableEventHandler = (_, data) => {
    props.onDragModule({...data, id: props.id})
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

export default BPBaseModule