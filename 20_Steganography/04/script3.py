def file_to_binary_stream(file_path):
    """Reads a file in binary mode and converts it into a continuous string of bits."""
    try:
        with open(file_path, "rb") as file:
            byte_stream = file.read()

        # Convert each byte to an 8-bit binary string and join them together
        binary_string = "".join(format(byte, "08b") for byte in byte_stream)
        return binary_string
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return None


def binary_stream_to_file(binary_string, output_path):
    """Takes a continuous string of bits and writes it back into a file."""
    # Split the binary string into chunks of 8 bits (1 byte each)
    byte_chunks = [binary_string[i : i + 8] for i in range(0, len(binary_string), 8)]

    # Convert each 8-bit chunk back into an integer, filtering out incomplete bytes
    byte_array = bytearray(int(chunk, 2) for chunk in byte_chunks if len(chunk) == 8)

    # Write the byte array to the output file path
    with open(output_path, "wb") as file:
        file.write(byte_array)
    print(f"File successfully reconstructed and saved as '{output_path}'.")


# --- Example Usage ---
if __name__ == "__main__":
    # 1. Define your source file
    source_file = "secret.txt"
    restored_file = "restored_secret2.txt"

    # 2. Convert the file into a binary stream
    bits = file_to_binary_stream(source_file)
    print("bits:", bits)

    if bits:
        print("Original file converted successfully!")
        print(f"Total bits generated: {len(bits)}")
        print(f"First 64 bits: {bits[:64]}")

        # 3. Convert the binary stream back into a file to verify
        binary_stream_to_file(bits, restored_file)
