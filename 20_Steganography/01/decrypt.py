import PyPDF2  # type: ignore[import-not-found]

# pdf_path = "./Boring_Data.pdf"
pdf_path = "./hidden.pdf"
with open(pdf_path, "rb") as file:
    reader = PyPDF2.PdfReader(file)

    metadata = reader.metadata
    for key in metadata:
        print(f"{key} : {metadata[key]}")
