window.onload = () => {
    const $ = (id) => document.getElementById(id);

    const fileList = $("file");

    // Event handler for file input change
    utils.addHandler(fileList, "change", (event) => {
        const files = utils.getTarget(event).files;
        if (files.length === 0 || !/image/.test(files[0].type)) {
            console.error("Please upload a valid image file");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(files[0]);

        reader.onerror = () => console.error("FileReader encountered an error");

        reader.onload = () => {
            const imgElement = $("img");
            imgElement.src = reader.result;

            imgElement.onload = () => {
                const { width, height } = imgElement;

                // Clear old canvas, if any
                const oldCanvas = $("canvas").querySelector("canvas");
                if (oldCanvas) oldCanvas.remove();

                // Create new canvas
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                $("canvas").appendChild(canvas);

                const context = canvas.getContext("2d");
                context.drawImage(imgElement, 0, 0);

                // Capture the original image data
                const originalImageData = context.getImageData(0, 0, width, height);

                const filter = new Filter({ img: imgElement, context, width, height, originalImageData });

                $("input").onchange = (event) => {
                    const n = parseInt(event.target.value);
                    $("input-value").textContent = n;
                    filter.applyTransparencyFilter(n);
                };
            };
        };
    });

    class Filter {
        constructor({ img, context, width, height, originalImageData }) {
            this.img = img;
            this.context = context;
            this.width = width;
            this.height = height;
            this.originalImageData = originalImageData; // Store the original image data
        }

        applyTransparencyFilter(threshold) {
            // Get a fresh copy of the original image data for each filter application
            const imageData = new ImageData(
                new Uint8ClampedArray(this.originalImageData.data), 
                this.originalImageData.width, 
                this.originalImageData.height
            );

            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                const average = (r + g + b) / 3;
                data[i + 3] = average > threshold ? 0 : data[i + 3]; // Adjust alpha based on threshold
            }

            // Update the canvas with the modified image data
            this.context.putImageData(imageData, 0, 0);
        }
    }
};