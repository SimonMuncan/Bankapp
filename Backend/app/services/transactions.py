from datetime import datetime
from zoneinfo import ZoneInfo
from fpdf import FPDF  # type: ignore


class PDF(FPDF):
    def header(self):
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, "Transaction Report", 0, 0, "C")
        current_x = self.get_x()
        current_y = self.get_y()
        self.chapter_date()
        self.set_xy(current_x, current_y)
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", 0, 0, "C")

    def chapter_title(self, title):
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, title, 0, 1, "L")
        self.ln(5)

    def chapter_date(self):
        date_to_display = datetime.now(ZoneInfo("Europe/Belgrade")).strftime(
            "%Y-%m-%d %H:%M:%S"
        )
        self.set_font("Arial", "I", 8)
        date_width = self.get_string_width(date_to_display) + 2

        page_width = self.w
        right_margin = self.r_margin
        x_position = page_width - right_margin - date_width
        self.set_x(x_position)
        self.cell(date_width, 10, date_to_display, 0, 0, "R")

    def chapter_body(self, data, headers, user_name: str):
        self.set_font("Arial", "", 10)
        col_widths = {
            "Sender": 22,
            "Receiver": 22,
            "Amount": 25,
            "Type": 22,
            "Date & Time": 40,
            "Status": 22,
            "Description": 35,
        }

        self.set_font("Arial", "B", 11)
        self.cell(0, 10, f"Transactions for: {user_name}", 0, 1, "L")
        self.ln(5)
        self.set_font("Arial", "", 10)

        self.set_fill_color(200, 220, 255)
        is_first_header = True
        for header in headers:
            self.cell(
                col_widths.get(header, 30), 7, header, 1, 0, "C", fill=is_first_header
            )


        for row in data:
            self.cell(col_widths.get("Sender", 30), 6, str(row.get("sender", "-")), 1)
            self.cell(
                col_widths.get("Receiver", 30), 6, str(row.get("receiver", "-")), 1
            )
            self.cell(
                col_widths.get("Amount", 25), 6, str(row.get("amount_display", "-")), 1
            )
            self.cell(col_widths.get("Type", 25), 6, str(row.get("type", "-")), 1)
            self.cell(
                col_widths.get("Date & Time", 40),
                6,
                str(row.get("timestamp_display", "-")),
                1,
            )
            self.cell(
                col_widths.get("Status", 25), 6, str(row.get("status_display", "-")), 1
            )
            self.cell(
                col_widths.get("Description", 40),
                6,
                str(row.get("description", "-")),
                1,
            )

            self.ln()
