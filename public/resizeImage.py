from PIL import Image

from resizeimage import resizeimage


with open('../images/hungryLogo.jpg', 'r+b') as f:
    with Image.open(f) as image:
        cover = resizeimage.resize_cover(image, [180, 180])
        cover.save('test-hungryLogo.png', image.format)
