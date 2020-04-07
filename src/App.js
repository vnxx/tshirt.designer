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

  React.useEffect(() => {
    console.log(tshirt)
  }, [tshirt])

  // function tshirtOnChange({ isDragging, x, y, width, height }) {
  //   setTshirt({
  //     ...tshirt,
  //     designs: {
  //       ...tshirt.designs,
  //       [tshirt.direction]: {
  //         isDragging: isDragging,
  //         x: x,
  //         y: y,
  //         width: width,
  //         height: height
  //       }
  //     }
  //   })
  // }

  // React.useEffect(() => {
  //   const img = new window.Image();
  //   img.crossOrigin = "Anonymous";
  //   img.src = "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
  //   setImage(img);
  //   setPageLoaded(true)
  //   console.log(elStage.current.clientWidth)
  //   console.log(elStage.current.offsetHeight)
  // }, []);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="container w-4/5 flex justify-center items-center">
        <div className="flex w-full">
          <Designer tshirt={tshirt} tshirtOnChange={setTshirt} />
          <Editor tshirt={tshirt} tshirtOnChange={setTshirt} />
        </div>
      </div>
    </div>
  );
}

export default App;
