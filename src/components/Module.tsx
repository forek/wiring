import React from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'

type Position = {
  x: number,
  y: number
}


type ModuleProps = {
  id: string,
  isDraggable?: boolean,
  leftPins: string[],
  rightPins: string[],
  defaultPositon: Position,
  title: string,
  pins: any,
  onDragModule: any
}

type PinProps = {
  name?: string,
  mode?: string,
  x: number,
  y: number
}

type PinLinkProps = {
  sx: number,
  sy: number,
  ex: number,
  ey: number
}

enum PinMode {
  Left = 'Left',
  Right = 'Right',
}

const PIN_COLOR = '#CCC'
const BG_STYPE = { fill: '#EEE', fillOpacity: 0.7 }

export function PinLink (props: PinLinkProps) {
  const { sx, sy, ex, ey } = props
  return (
    <path
      d={`
        M ${sx} ${sy}
        C ${sx + 50} ${sy}, ${ex - 50} ${ey}, ${ex} ${ey}
      `}
      stroke={PIN_COLOR}
      fill='transparent'
    />
  )
}

export function Pin (props: PinProps) {
  const currMode = props.mode || PinMode.Left
  switch (currMode) {
    case PinMode.Right: {
      return (
        <g>
          <circle cx={200 - props.x} cy={props.y}  r={4} fill={PIN_COLOR}/>
          <text x={200 - props.x - 8} y={props.y + 5} fill='#777' textAnchor='end'>{props.name || ''}</text>
        </g>
      )
    }
    case PinMode.Left:
    default: {
      return (
        <g>
          <circle cx={props.x} cy={props.y}  r={4} fill={PIN_COLOR}/>
          <text x={props.x + 8} y={props.y + 5} fill='#777'>{props.name || ''}</text>
        </g>
      )
    }
  }

}

function Module (props: ModuleProps) {
  const currHeight = Math.max(props.leftPins.length, props.rightPins.length, 5) * 14 + 30
  const { pins } = props

  const renderLeftPins = () => props.leftPins.map((item, i) => (
    <Pin x={10} y={34 + i * 22} name={pins[item].name} key={item}/>
  ))

  const renderRightPins = () => props.rightPins.map((item, i) => (
    <Pin x={10} y={34 + i * 22} name={pins[item].name} mode={PinMode.Right} key={item}/>
  ))

  const render = () => (
    <g>
      <rect
        x={0} y={0}
        height={currHeight} width={200}
        style={BG_STYPE}
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

export default Module