import React from 'react';
import Designer from './componens/designer'
import Editor from './componens/editor'

const initial = {
  direction: 'front',
  color: 'black',
  size: 'm',
  designs: {
    front: {
      asset: 'https://konvajs.org/assets/lion.png',
      preview: 'https://konvajs.org/assets/lion.png',
      positions: {
        isDragging: false,
        width: 144,
        height: 139,
        x: 0,
        y: 0,
      }
    },
    back: {
      asset: 'https://drive.google.com/uc?id=0B3SuO1tTT9bxQzJmQ3Vrb2ZFbUE',
      preview: 'https://drive.google.com/uc?id=0B3SuO1tTT9bxQzJmQ3Vrb2ZFbUE',
      positions: {
        isDragging: false,
        width: 569 / 5,
        height: 481 / 5,
        x: 0,
        y: 0
      }
    }
  }
}

function App() {
  const [tshirt, setTshirt] = React.useState(initial);
  const [selected, setSelected] = React.useState(false);
  const elStage = React.useRef();

  React.useEffect(() => {
    // console.log(tshirt)
  }, [tshirt])

  const checkDeselect = e => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelected(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="container w-4/5 flex justify-center items-center">
        <div className="flex w-full">
          <Designer selected={selected} setSelected={setSelected} checkDeselect={checkDeselect} elStage={elStage} tshirt={tshirt} tshirtOnChange={setTshirt} />
          <Editor selected={selected} setSelected={setSelected} elStage={elStage} tshirt={tshirt} tshirtOnChange={setTshirt} />
        </div>
      </div>
    </div>
  );
}

export default App;
