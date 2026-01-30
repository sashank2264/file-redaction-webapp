import fitz  # PyMuPDF
import re

BLACK = (0, 0, 0)

def is_sensitive(text: str) -> bool:
    patterns = [
        r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",  # email
        r"\b\d{10}\b",                                   # phone
        r"\b\d{4,}\b",                                   # long numbers
        r"\b(Aadhaar|PAN|Account|ATM|Password|IFSC)\b",  # keywords
        r"\b[A-Z][a-z]+(?:\s[A-Z][a-z]+){0,2}\b",        # names
    ]

    for p in patterns:
        if re.search(p, text):
            return True
    return False


def redact_pdf(input_path, output_path):
    doc = fitz.open(input_path)

    for page in doc:
        text_dict = page.get_text("dict")

        for block in text_dict["blocks"]:
            if block["type"] != 0:  # not text
                continue

            for line in block["lines"]:
                for span in line["spans"]:
                    span_text = span["text"]

                    if is_sensitive(span_text):
                        rect = fitz.Rect(span["bbox"])
                        page.add_redact_annot(rect, fill=BLACK)

        page.apply_redactions()

    doc.save(output_path)
