import React, { useEffect, useState, useReducer, useMemo, useRef } from 'react'
import { WiringBase, PinLink as WiringCorePinLink } from './BaseModule'
import WiringModule from './NormalModule'
import { MOCK_DATA } from './MockData'

export declare namespace WiringCore {
  type PinId = string;
  type ModuleId = string;
  type ModuleType = string;

  export interface Pin {
    id: PinId;
    text?: string;
  }

  export interface Module {
    id: ModuleId;
    title?: string;
    type: ModuleType;
    position: WiringBase.Position;
    leftPins: Pin[];
    rightPins: Pin[];
  }

  export interface Data {
    modules: Module[]

    links: Array<{
      start: PinId;
      end: PinId;
    }>
  }

  interface IndexPin extends Pin, WiringBase.PinInfo {
    parentRef: Module;
    index: number;
  }

  export interface State {
    modules: Data['modules'];
    links: Data['links'];
    modulesIndex: {
      [id: string]: Module; // ModuleId
    };
    pinsIndex: {
      [id: string]: IndexPin; // PinId
    };
  }

  export namespace Actions {
    interface Base {
      type: ActionTypes;
      payload?: {};
    }

    interface DragModulePayload extends WiringBase.Position {
      id: ModuleId;
    }

    export interface DragModule extends Base {
      type: ActionTypes.DRAG_MODULE;
      payload: DragModulePayload;
    }

    export interface LinkModule {
      type: ActionTypes.LINK_MODULE;
      payload: {
        start: Pin;
        end: Pin;
      }
    }
  }

  export type Action = Actions.DragModule | Actions.LinkModule

  export interface TmpLink extends WiringBase.Position {
    active: boolean;
    start: Pin;
  }
}

function initPin (
  pins: WiringCore.Pin[],
  parentModule: WiringCore.Module,
  pinsIndex: WiringCore.State['pinsIndex']
): void {
  pins.forEach((p, i) => {
    const info = WiringModule.getPinInfo(p, parentModule)

    const obj = {
      ...info,
      ...p,
      parentRef: parentModule,
      index: i
    } as WiringCore.IndexPin

    pinsIndex[p.id] = obj
  })
}

function initState (data: WiringCore.Data): WiringCore.State {
  const modulesIndex: WiringCore.State['modulesIndex'] = {}
  const pinsIndex: WiringCore.State['pinsIndex'] = {}
  const modules = data.modules.map(m => {
    modulesIndex[m.id] = m
    if (m.leftPins.length) initPin(m.leftPins, m, pinsIndex)
    if (m.rightPins.length) initPin(m.rightPins, m, pinsIndex)
    return m
  })

  return {
    modules,
    links: [...data.links],
    modulesIndex,
    pinsIndex
  }
}

enum ActionTypes {
  DRAG_MODULE,
  LINK_MODULE
}

function reducer (state: WiringCore.State, action: WiringCore.Action): WiringCore.State {
  const nextState = { ...state }
  switch (action.type) {
    case ActionTypes.DRAG_MODULE: {
      const { payload: { id, x, y } } = action
      const module = nextState.modulesIndex[id]
      module.position = { x, y }
      const { leftPins, rightPins } = module

      if (leftPins.length) initPin(leftPins, module, nextState.pinsIndex)
      if (rightPins.length) initPin(rightPins, module, nextState.pinsIndex)

      nextState.links = [...state.links]
      return nextState
    }
    case ActionTypes.LINK_MODULE: {
      const { payload: { start, end } } = action
      const nextLinks = [...nextState.links]
      nextLinks.push({ start: start.id, end: end.id })
      nextState.links = nextLinks
      return nextState
    }
    default:
      throw new Error()
  }
}

interface SVGCanvasProps {
  width: number;
  height: number;
}

function SVGCanvas (props: SVGCanvasProps) {
  const initalState = useMemo(() => initState(MOCK_DATA), [MOCK_DATA])
  const [state, dispatch] = useReducer(reducer, initalState)
  const [tmpLink, setTmpLink] = useState({ active: false, x: 0, y: 0 } as WiringCore.TmpLink)
  const tmpLinkRef = useRef(null as null | WiringCore.TmpLink)

  const setTmpLinkWithRef = (value: WiringCore.TmpLink) => {
    setTmpLink(value)
    tmpLinkRef.current = value
  }

  const { modules, links, pinsIndex } = state

  const [viewBox, setViewBox] = useState<string | undefined>()

  const style = {
    border: '1px solid black'
  }

  useEffect(() => {
    const viewBox = [0, 0, 800, 500]
    setViewBox(viewBox.join(','))
    tmpLinkRef.current = tmpLink
  }, [])

  const handleDragModule = (data: WiringBase.DraggableData) => {
    const action = {
      type: ActionTypes.DRAG_MODULE,
      payload: {
        id: data.id,
        x: data.x,
        y: data.y
      }
    }

    dispatch(action as WiringCore.Actions.DragModule)
  }

  const handleClickPin = (pin: WiringCore.Pin, event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const tmpLink = tmpLinkRef.current
    if (!tmpLink) return
    if (tmpLink.active) {
      dispatch({
        type: ActionTypes.LINK_MODULE,
        payload: {
          start: tmpLink.start,
          end: pin
        }
      } as WiringCore.Actions.LinkModule)

      setTmpLinkWithRef({ ...tmpLink, active: false })
    } else {
      const nextTmpLink = { start: pin, active: true, x: event.clientX, y: event.clientY } as WiringCore.TmpLink
      setTmpLinkWithRef(nextTmpLink)
    }
  }

  const handleMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (tmpLink.active) setTmpLinkWithRef({ ...tmpLink, x: event.clientX, y: event.clientY })
  }

  const renderModules = () => {
    return modules.map(item => (
      <WiringModule
        id={item.id}
        key={item.id}
        title={item.title || ''}
        leftPins={item.leftPins}
        rightPins={item.rightPins}
        defaultPositon={item.position}
        pins={pinsIndex}
        onDragModule={handleDragModule}
        onClickPin={handleClickPin}
        isDraggable
      />
    ))
  }

  const renderPinLink = () => {
    return links.map(item => {
      const startPin = pinsIndex[item.start]
      const endPin = pinsIndex[item.end]
      return (
        <WiringCorePinLink
          key={`${item.start} -> ${item.end}`}
          startPoint={startPin.position}
          startVec={startPin.vec}
          endPoint={endPin.position}
          endVec={endPin.vec}
          className='link'
        />
      )
    })
  }

  const renderTmpLink = (): React.ReactElement | boolean => {
    if (!tmpLink.active) return false
    const startPin = pinsIndex[tmpLink.start.id]

    return (
      <WiringCorePinLink
        key='tmp.link'
        startPoint={startPin.position}
        startVec={startPin.vec}
        endPoint={tmpLink}
        endVec={{ x: 0, y: 0 }}
        className='tmp-link'
      />
    )
  }

  return (
    <svg
      id='SVGCanvas'
      preserveAspectRatio='xMaxYMax none'
      width={props.width}
      height={props.height}
      style={style}
      viewBox={viewBox}
      onMouseMove={handleMove}
    >
      {useMemo(() => renderModules(), [modules])}
      {useMemo(() => renderPinLink(), [links])}
      {useMemo(() => renderTmpLink(), [tmpLink])}
    </svg>
  )
}

export default SVGCanvas
