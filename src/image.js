const makeImg = (url, height = '100', width = '100') => {
    const img = document.createElement('img');
    img.height = height;
    img.width = width;
    img.src = url;
    return img;
};

export default makeImg;