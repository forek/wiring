import { WiringCore } from './SVGCanvas'

export const MOCK_DATA: WiringCore.Data = {
  modules: [
    {
      id: 'm001',
      title: 'CallFuntion',
      type: 'BaseModule',
      position: {
        x: 20,
        y: 100
      },
      leftPins: [
        {
          id: '001',
          text: 'left-pin'
        },
        {
          id: '005',
          text: 'left-pin2'
        }
      ],
      rightPins: [
        {
          id: '002',
          text: 'right-pin'
        },
        {
          id: '008',
          text: 'right-pin-8'
        }
      ]
    },
    {
      id: 'm002',
      title: 'Condition',
      type: 'BaseModule',
      position: {
        x: 300,
        y: 200
      },
      leftPins: [
        {
          id: '003',
          text: 'left-pin'
        }
      ],
      rightPins: [
        {
          id: '004',
          text: 'left-pin'
        }
      ]
    },
    {
      id: 'm003',
      title: 'CallFunction2',
      type: 'BaseModule',
      position: {
        x: 350,
        y: 350
      },
      leftPins: [
        {
          id: '006',
          text: 'left-pin'
        }
      ],
      rightPins: [
        {
          id: '007',
          text: 'left-pin'
        }
      ]
    }
  ],
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
