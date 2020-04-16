import React from 'react'
import html2canvas from 'html2canvas'

export default function Editor({ tshirt, elStage, tshirtOnChange, setSelected, selected, setModal }) {
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

    function _designLabel(val, direction) {
        let setVal = val
        let dl_front = document.getElementById("dl_front")
        let dl_back = document.getElementById("dl_back")
        if (setVal === null) {
            if (direction === 'front') {
                setVal = "Front Design"
            } else {
                setVal = "Back Design"
            }
        }

        if (direction === 'front') {
            dl_front.innerHTML = setVal
        } else {
            dl_back.innerHTML = setVal
        }
    }

    function changeDesign(e) {
        const file = e.target.files[0]
        console.log(file.name)
        const input_name = e.target.name
        const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/jpg']

        // check is file an image
        if (file && acceptedImageTypes.includes(file['type'])) {
            const design = URL.createObjectURL(file)
            // set label image
            _designLabel(file.name, input_name)

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
            // console.log('anajay bukan gambar')
            setModal({
                isOpen: true,
                message: 'Please upload an image file (jpg, jpeg, png)'
            })
            e.target.value = null
        }
    }

    React.useEffect(() => {
        function _calculate_image_size(type, originalWidth, originalHeight) {
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
                            width: _calculate_image_size('width', fileUpload.width, fileUpload.width),
                            height: _calculate_image_size('height', fileUpload.width, fileUpload.height)
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
            let element = document.getElementById("myDesign")
            const windowW = window.innerWidth
            if (windowW < 1024) {
                element.style.position = "fixed"
                element.style.zIndex = 999
                element.style.left = 0
            }

            html2canvas(element, {
                allowTaint: true,
                removeContainer: false,
                backgroundColor: null
            }).then(canvas => {
                if (windowW < 1024) {
                    element.style.position = null
                    element.style.zIndex = null
                    element.style.left = null
                }
                downloadURI(canvas.toDataURL('image/png'), 'tes')
                // document.body.appendChild(canvas);
            })
        }

    }, [dlImage, setDLimage, selected])

    return (
        <div onClick={() => setSelected(false)} className="w-full py-10 lg:py-0 min-h-0 lg:min-h-screen flex items-center justify-center">
            <div className="w-full px-5 lg:px-10">
                <h1 className="mb-5 text-2xl lg:text-5xl font-bold text-gray-800">T-SHIRT DESIGNER</h1>
                <div className="mb-5">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Colors
                    </label>
                    <div className="flex -m-3">
                        <div onClick={() => changeColor('black')} className="rounded-full m-3 cursor-pointer border-solid border-2 border-gray-700" style={{ width: '50px', height: '50px', background: 'black' }}></div>
                        <div onClick={() => changeColor('white')} className="rounded-full m-3 cursor-pointer border-solid border-2 border-gray-700" style={{ width: '50px', height: '50px', background: 'white' }}></div>
                    </div>
                </div>
                <div className="mb-5">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Directon
                </label>
                    <div className="relative">
                        <select onChange={chnageDirection} className="appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="direction">
                            <option value="front">Front</option>
                            <option value="back">Back</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>
                <div className="mb-10">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Designs
                </label>
                    <label className="w-full block cursor-pointer mb-3 bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" htmlFor="d_front">
                        <span className="truncate block" id="dl_front">Front Design</span>
                        <input id="d_front" onChange={changeDesign} className="w-full hidden" type="file" name="front" />
                    </label>
                    <label className="w-full block cursor-pointer mb-3 bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" htmlFor="d_back">
                        <span className="truncate block" id="dl_back">Back Design</span>
                        <input id="d_back" onChange={changeDesign} className="w-full hidden" type="file" name="back" />
                    </label>
                </div>
                <div>
                    <button className="bg-primary w-full rounded-sm text-white p-2 outline-none" onClick={() => setDLimage(true)}>Save Image</button>
                </div>
                <a className="text-blue-700 underline text-center block mt-3 text-sm" href="https://bykevin.work/">App by @keevnx</a>
            </div>
        </div>
    )
}