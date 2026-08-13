import PyPDF2  # type: ignore[import-not-found]

pdf_path = "./Boring_Data.pdf"
with open(pdf_path, "rb") as file:
    reader = PyPDF2.PdfReader(file)
    writer = PyPDF2.PdfWriter()

    writer.append_pages_from_reader(reader)

    key = "/key"
    message = "This is a hidden message in the metadata"

    metadata = reader.metadata
    metadata.update({key: message})
    writer.add_metadata(metadata)

    with open("hidden.pdf", "wb") as output_file:
        writer.write(output_file)

        print("Message hidden successfully")
