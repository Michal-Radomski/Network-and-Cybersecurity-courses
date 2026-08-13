import argparse

import PyPDF2  # type: ignore[import-not-found]


def decrypt(file_path):
    with open(file_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)

        metadata = reader.metadata
        for key in metadata:
            print(f"{key} : {metadata[key]}")


def encrypt(file_path, metadata_key_name, message, output_file_path):
    with open(file_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        writer = PyPDF2.PdfWriter()

        writer.append_pages_from_reader(reader)

        metadata = reader.metadata
        metadata.update({metadata_key_name: message})
        writer.add_metadata(metadata)

        with open(output_file_path, "wb") as output_file:
            writer.write(output_file)

            print("Message hidden successfully")


def main():
    parser = argparse.ArgumentParser(
        description="Script that appends user defined data to a .pdf's metadata or reads a .pdf metadata"
    )

    parser.add_argument("-d", action="store_true", help="Option decrypt")
    parser.add_argument("-e", action="store_true", help="Option encrypt")
    parser.add_argument("-f", required=True, type=str, help="File path")
    parser.add_argument("-o", required=False, type=str, help="Output file path")
    parser.add_argument("-mn", required=False, type=str, help="Metadata key name")
    parser.add_argument(
        "-m",
        required=False,
        type=str,
        help="The hidden message you want to hide in the PDF's metadata",
    )

    args = parser.parse_args()

    if not (args.d or args.e):
        parser.error("The script requires either a -d or -e flag")

    if args.d and args.f:
        decrypt(args.f)
    elif args.e and args.o and args.mn and args.m:
        encrypt(args.f, args.mn, args.m, args.o)


if __name__ == "__main__":
    main()
