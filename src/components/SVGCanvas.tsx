import React, { useEffect, useState } from 'react'

import Module, { PinLink } from './Module'

type SVGCanvasProps = {
  width: number
  height: number
}

type PinInfo = {
  name: string,
  mode: string,
  parentId: string
}

const MOCK_DATA = {
  modules: [
    {
      id: '001',
      title: 'CallFuntion',
      position: {
        x: 20,
        y: 100
      },
      leftPins: [
        '001',
        '005'
      ],
      rightPins: [
        '002',
        '008'
      ]
    },
    {
      id: '002',
      title: 'Condition',
      position: {
        x: 300,
        y: 200
      },
      leftPins: [
        '003'
      ],
      rightPins: [
        '004'
      ]
    },
    {
      id: '003',
      title: 'CallFunction2',
      position: {
        x: 350,
        y: 350
      },
      leftPins: [
        '006'
      ],
      rightPins: [
        '007'
      ]
    }
  ],
  pins: {
    '001': {
      name: 'left-pin',
      mode: 'left',
      parentId: '001'
    },
    '002': {
      name: 'right-pin',
      mode: 'right',
      parentId: '001'
    },
    '003': {
      name: 'left-pin',
      mode: 'left',
      parentId: '002'
    },
    '004': {
      name: 'right-pin',
      mode: 'right',
      parentId: '002'
    },
    '005': {
      name: 'left-pin2',
      mode: 'left',
      parentId: '001'
    },
    '006': {
      name: 'hello',
      mode: 'left',
      parentId: '003'
    },
    '007': {
      name: 'world',
      mode: 'right',
      parentId: '003'
    },
    '008': {
      name: 'to hello',
      mode: 'right',
      parentId: '001'
    }
  },
  links: [
    {
      start: '002',
      end: '003'
    },
    {
      start: '004',
      end: '006'
    },
    {
      start: '008',
      end: '006'
    }
  ]
}

function SVGCanvas(props: SVGCanvasProps) {
  const [modules, setModules] = useState(MOCK_DATA.modules)
  const [pins, setPins] = useState(MOCK_DATA.pins)
  const [links, setLinks] = useState(MOCK_DATA.links)

  const [viewBox, setViewBox] = useState<string | undefined>()

  const style = {
    border: '1px solid black',
  }

  useEffect(() => {
    const viewBox = [0, 0, 500, 500]
    setViewBox(viewBox.join(','))
  }, [])

  const handleDragModule = (data: any) => {
    const nextModules = [...modules] as any
    // console.log(nextm)
    nextModules.find((obj: any) => obj.id === data.id).position = { x: data.x, y: data.y }
    setModules(nextModules)
  }

  const renderModules = () => {
    return modules.map(item => (
      <Module
        id={item.id}
        key={item.id}
        title={item.title}
        leftPins={item.leftPins}
        rightPins={item.rightPins}
        defaultPositon={item.position}
        pins={pins}
        onDragModule={handleDragModule}
        isDraggable
      />
    ))
  }

  const renderPinLink = () => {
    return links.map(item => {
      const startPin = (pins as any)[item.start] as PinInfo
      const endPin = (pins as any)[item.end] as PinInfo
      const startModule = modules.find(m => m.id === startPin.parentId)
      const endModule = modules.find(m => m.id === endPin.parentId)
      const startIndex = startModule?.rightPins.findIndex(id => id === item.start) as number
      const endIndex = endModule?.leftPins.findIndex(id => id === item.end) as number

      const sx = startModule?.position.x as number + 200 - 8
      const sy = startModule?.position.y as number + 34 + (startIndex * 23)
      const ex = endModule?.position.x as number + 8
      const ey = endModule?.position.y as number + 34 + (endIndex * 23)

      return <PinLink
        key={`${item.start} -> ${item.end}`}
        sx={sx}
        sy={sy}
        ex={ex}
        ey={ey}
      />
    })
  }

  return (
    <svg
      id="SVGCanvas"
      preserveAspectRatio="xMaxYMax none"
      width={props.width}
      height={props.height}
      style={style}
      viewBox={viewBox}
    >
      {renderModules()}
      {renderPinLink()}
    </svg>
  )
}

export default SVGCanvas
