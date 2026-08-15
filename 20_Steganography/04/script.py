from PIL import Image


def text_to_bin(text):
    """Convert text to an 8-bit binary string with a delimiter."""
    # Convert each character to binary and add a unique delimiter at the end
    full_text = text + "###END###"
    return "".join(format(ord(char), "08b") for char in full_text)


def encode_text_to_image(image_path, text_file_path, output_path):
    # Read the text file
    with open(text_file_path, "r", encoding="utf-8") as f:
        secret_text = f.read()

    # Open the cover image
    img = Image.open(image_path)
    img = img.convert("RGB")
    encoded_img = img.copy()

    # Convert text to binary string
    binary_data = text_to_bin(secret_text)
    data_length = len(binary_data)

    # Check if the image has enough capacity
    max_capacity = img.width * img.height * 3
    if data_length > max_capacity:
        raise ValueError("Error: The text file is too large to fit in this image.")

    data_index = 0
    pixels = encoded_img.load()

    # Iterate through each pixel and modify the least significant bit
    for y in range(img.height):
        for x in range(img.width):
            if data_index < data_length:
                r, g, b = pixels[x, y]

                # Modify Red channel LSB
                if data_index < data_length:
                    r = (r & ~1) | int(binary_data[data_index])
                    data_index += 1

                # Modify Green channel LSB
                if data_index < data_length:
                    g = (g & ~1) | int(binary_data[data_index])
                    data_index += 1

                # Modify Blue channel LSB
                if data_index < data_length:
                    b = (b & ~1) | int(binary_data[data_index])
                    data_index += 1

                pixels[x, y] = (r, g, b)
            else:
                break
        if data_index >= data_length:
            break

    # Save as PNG to avoid lossy compression corruption
    encoded_img.save(output_path, "PNG")
    print(f"Successfully encoded '{text_file_path}' into '{output_path}'")


# Example usage:
encode_text_to_image("example.png", "secret.txt", "output.png")
