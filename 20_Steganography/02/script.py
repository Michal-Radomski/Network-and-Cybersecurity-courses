from PIL import Image

image_path = "example.png"
image = Image.open(image_path)


# image.show()
width, height = image.size
print(width, height)
print(width * height)

print(image.getpixel((0, 0)))

new_image = Image.new("RGB", (width, height), (0, 0, 0))

for x in range(width):
    for y in range(height):
        pixel = image.getpixel((x, y))
        pixel = (255, pixel[1], pixel[2])
        new_image.putpixel((x, y), pixel)

new_image = new_image.rotate(-90)
# new_image.show()

output_path = "output_image.png"
new_image.save(output_path)
