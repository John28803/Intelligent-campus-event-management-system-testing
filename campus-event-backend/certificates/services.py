from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet

def create_certificate_pdf(
    filepath,
    student_name,
    event_title,
    verification_hash
):

    doc = SimpleDocTemplate(
        filepath
    )

    styles = (
        getSampleStyleSheet()
    )

    content = [

        Paragraph(
            "CERTIFICATE OF PARTICIPATION",
            styles['Title']
        ),

        Spacer(1, 20),

        Paragraph(
            f"This certifies that "
            f"{student_name}",
            styles['Normal']
        ),

        Spacer(1, 10),

        Paragraph(
            f"successfully attended "
            f"{event_title}",
            styles['Normal']
        ),

        Spacer(1, 20),

        Paragraph(
            f"Verification Hash:",
            styles['Heading2']
        ),

        Paragraph(
            verification_hash,
            styles['Normal']
        )

    ]

    doc.build(content)