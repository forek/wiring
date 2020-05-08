import React from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'
import { WiringCore } from './SVGCanvas'
import { WiringBase } from './BaseModule'
import { WIRING_CORE_PIN_COLOR, WIRING_BASE_MODULE_BG_STYPE } from './constants'

type WiringBasePinMode = 'left' | 'right'

interface WiringPinProps extends WiringBase.Position {
  name?: string;
  mode?: WiringBasePinMode;
  onClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>): void;
}

export function WiringPin (props: WiringPinProps) {
  const currMode: WiringBasePinMode = props.mode || 'left'
  const textProps = { x: 0, textAnchor: 'start' }

  switch (currMode) {
    case 'right':
      textProps.x = props.x - 8
      textProps.textAnchor = 'end'
      break
    case 'left':
    default:
      textProps.x = props.x + 8
      break
  }

  return (
    <g className='wiring__base--pin' onClick={props.onClick}>
      <circle cx={props.x} cy={props.y} r={4} fill={WIRING_CORE_PIN_COLOR} />
      <text {...textProps} y={props.y + 5} fill='#777'>{props.name || ''}</text>
    </g>
  )
}

interface WiringModuleProps extends WiringBase.ModuleProps {
  leftPins: WiringCore.Pin[];
  rightPins: WiringCore.Pin[];
  title: string;
  pins: WiringCore.State['pinsIndex'];
}

function WiringModule (props: WiringModuleProps) {
  const currHeight = Math.max(props.leftPins.length, props.rightPins.length, 5) * 14 + 30
  const { pins } = props

  const getProps = (item: WiringCore.Pin) => ({
    x: pins[item.id].client.x,
    y: pins[item.id].client.y,
    name: pins[item.id].text,
    onClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => props.onClickPin(item, event)
  })

  const renderLeftPins = () => props.leftPins.map(item => (
    <WiringPin {...getProps(item)} key={item.id} />
  ))

  const renderRightPins = () => props.rightPins.map(item => (
    <WiringPin {...getProps(item)} key={item.id} mode='right' />
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
        cancel='.wiring__base--pin'
      >
        {render()}
      </Draggable>
    )
  }
  return render()
}

WiringModule.getPinInfo = (pin: WiringCore.Pin, module: WiringCore.Module) => {
  let position = { x: 0, y: 0 } as WiringBase.Position
  let client = { x: 0, y: 0 } as WiringBase.Position
  let vec = { x: 0, y: 0 } as WiringBase.Position

  const leftIndex = module.leftPins.findIndex(({ id }) => id === pin.id)
  if (leftIndex > -1) {
    client = { x: 10, y: 34 + leftIndex * 22 }
    position = { x: client.x + module.position.x, y: client.y + module.position.y }
    vec = { x: -0.7, y: 0 }
  } else {
    const rightIndex = module.rightPins.findIndex(({ id }) => id === pin.id)
    if (rightIndex > -1) {
      client = { x: 200 - 10, y: 34 + rightIndex * 22 }
      position = { x: client.x + module.position.x, y: client.y + module.position.y }
      vec = { x: 0.7, y: 0 }
    } else {
      throw new Error(`Can not find pin ${JSON.stringify(pin)}`)
    }
  }
  return { position, vec, client } as WiringBase.PinInfo
}

export default WiringModule as WiringBase.Module<WiringModuleProps>
