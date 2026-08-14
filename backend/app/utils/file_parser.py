from pypdf import PdfReader


def extract_text(file_path: str, file_type: str):
    print("Extracting text from file-----------------------")

    if file_type in ("pdf", ".pdf"):
        reader = PdfReader(file_path)

        text = ""

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

        return text

    elif file_type in ("md", "txt", ".md", ".txt"):
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()

    else:
        raise ValueError(f"Unsupported file type: {file_type}")
