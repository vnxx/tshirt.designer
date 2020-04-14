import React from 'react'
import html2canvas from 'html2canvas'

export default function Editor({ tshirt, elStage, tshirtOnChange, setSelected, selected }) {
    const [fileUpload, setFileUpload] = React.useState({});
    const [dlImage, setDLimage] = React.useState(false)

    function changeColor(color) {
        tshirtOnChange({
            ...tshirt,
            color: color
        })
    }

    function chnageDirection(e) {
        tshirtOnChange({
            ...tshirt,
            direction: e.target.value
        })
    }

    function changeDesign(e) {
        const file = e.target.files[0]
        const input_name = e.target.name
        const acceptedImageTypes = ['image/jpeg', 'image/png']

        // check is file an image
        if (file && acceptedImageTypes.includes(file['type'])) {
            const design = URL.createObjectURL(file)

            // Get image width
            let img = new Image();
            img.src = design
            img.onload = function () {
                // console.log(canvas_width)
                // console.log(this.width + " " + this.height);
                setFileUpload({
                    stream: design,
                    direction: input_name,
                    width: this.width,
                    height: this.height
                })
            };
        } else {
            console.log('anajay bukan gambar')
            e.target.value = null
        }
    }

    React.useEffect(() => {
        function _calculate(type, originalWidth, originalHeight) {
            const canvas = Math.round(40 * elStage.current.clientWidth / 100)

            if (originalWidth >= canvas) {
                const maxWidth = canvas
                const maxHeight = Math.round(58 * elStage.current.clientWidth / 100)
                var ratio = 0;  // Used for aspect ratio
                var width = originalWidth;    // Current image width
                var height = originalHeight;  // Current image height

                let newWidth = maxWidth;
                let newHeight = maxWidth;

                if (width > maxWidth && width > height) {
                    ratio = width / height;
                    newHeight = maxWidth / ratio;
                    newWidth = maxWidth

                } else if (height > maxHeight && height > width) {
                    ratio = height / width;
                    newWidth = maxHeight / ratio
                    newHeight = maxHeight;
                }

                if (type === 'width') {
                    return newWidth
                } else {
                    return newHeight
                }
            }
            return originalWidth
        }

        if (Object.keys(fileUpload).length > 0) {
            tshirtOnChange({
                ...tshirt,
                designs: {
                    ...tshirt.designs,
                    [fileUpload.direction]: {
                        ...tshirt.designs[fileUpload.direction],
                        preview: fileUpload.stream,
                        positions: {
                            ...tshirt.designs[fileUpload.direction].positions,
                            width: _calculate('width', fileUpload.width, fileUpload.width),
                            height: _calculate('height', fileUpload.width, fileUpload.height)
                        }
                    }
                }
            })

            setFileUpload({})
        }
    }, [fileUpload, tshirt, tshirtOnChange, elStage])

    const downloadURI = (uri, name) => {
        const link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    React.useEffect(() => {
        if (dlImage && !selected) {
            saveImage()
            setDLimage(false)
        }

        function saveImage() {
            const element = document.getElementById("myDesign")
            html2canvas(element, {
                allowTaint: true,
                removeContainer: false,
                backgroundColor: null
            }).then(canvas => {
                downloadURI(canvas.toDataURL('image/png'), 'tes')
            })
        }

    }, [dlImage, setDLimage, selected])

    return (
        <div onClick={() => setSelected(false)} className="w-full pl-5">
            <div className="mb-5">
                <p className="mb-3">Color</p>
                <div className="flex -m-3">
                    <div onClick={() => changeColor('black')} className="rounded-full m-3 cursor-pointer border-solid border-2 border-black" style={{ width: '50px', height: '50px', background: 'black' }}></div>
                    <div onClick={() => changeColor('white')} className="rounded-full m-3 cursor-pointer border-solid border-2 border-black" style={{ width: '50px', height: '50px', background: 'white' }}></div>
                </div>
            </div>
            <div className="mb-5">
                <p className="mb-3">Direction</p>
                <select onChange={chnageDirection} className="w-full outline-none p-3" name="direction">
                    <option value="front">Front</option>
                    <option value="back">Back</option>
                </select>
            </div>
            <div className="mb-5">
                <p className="mb-3">Designs</p>
                <input onChange={changeDesign} className="w-full" type="file" name="front" />
                <input onChange={changeDesign} className="w-full" type="file" name="back" />
            </div>
            <div>
                <button onClick={() => setDLimage(true)}>Save Image</button>
            </div>
        </div>
    )
}