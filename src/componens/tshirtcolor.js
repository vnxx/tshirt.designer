import React from 'react'
import white_front from '../assets/tshirt/white/front.png'
import white_back from '../assets/tshirt/white/back.png'
import black_front from '../assets/tshirt/black/front.png'
import black_back from '../assets/tshirt/black/back.png'

export default function TshirtView({ color, direction }) {
    switch (color) {
        case 'black':
            if (direction === 'front') {
                return <img src={black_front} alt="tshirt" />
            }
            return <img src={black_back} alt="tshirt" />
        default:
            if (direction === 'front') {
                return <img src={white_front} alt="tshirt" />
            }
            return <img src={white_back} alt="tshirt" />
    }
}

