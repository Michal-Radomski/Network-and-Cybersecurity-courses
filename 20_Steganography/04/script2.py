from PIL import Image


def decode_image_to_text(image_path, output_text_path):
    img = Image.open(image_path)
    pixels = img.load()

    binary_data = ""
    for y in range(img.height):
        for x in range(img.width):
            r, g, b = pixels[x, y]
            binary_data += str(r & 1)
            binary_data += str(g & 1)
            binary_data += str(b & 1)

    # Convert binary back to characters
    all_bytes = [binary_data[i : i + 8] for i in range(0, len(binary_data), 8)]
    decoded_text = ""
    for byte in all_bytes:
        decoded_text += chr(int(byte, 2))
        # Check if delimiter is reached
        if "###END###" in decoded_text:
            decoded_text = decoded_text.split("###END###")[0]
            break

    # Save the extracted text
    with open(output_text_path, "w", encoding="utf-8") as f:
        f.write(decoded_text)
    print(f"Successfully decoded text into '{output_text_path}'")


# Example usage:
decode_image_to_text("output.png", "recovered_secret.txt")
