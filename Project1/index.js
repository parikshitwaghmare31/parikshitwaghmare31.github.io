document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("asciiTableBody");

    // Standard ASCII Control Character Descriptions (0–31 and 127)
    const controlNames = {
        0: "NUL (Null)", 1: "SOH (Start of Heading)", 2: "STX (Start of Text)",
        3: "ETX (End of Text)", 4: "EOT (End of Trans.)", 5: "ENQ (Enquiry)",
        6: "ACK (Acknowledge)", 7: "BEL (Bell)", 8: "BS (Backspace)",
        9: "HT (Tab)", 10: "LF (Line Feed)", 11: "VT (Vertical Tab)",
        12: "FF (Form Feed)", 13: "CR (Carriage Return)", 14: "SO (Shift Out)",
        15: "SI (Shift In)", 16: "DLE (Data Link Escape)", 17: "DC1 (Device Control 1)",
        18: "DC2 (Device Control 2)", 19: "DC3 (Device Control 3)", 20: "DC4 (Device Control 4)",
        21: "NAK (Negative Ack)", 22: "SYN (Synchronous Idle)", 23: "ETB (End of Block)",
        24: "CAN (Cancel)", 25: "EM (End of Medium)", 26: "SUB (Substitute)",
        27: "ESC (Escape)", 28: "FS (File Separator)", 29: "GS (Group Separator)",
        30: "RS (Record Separator)", 31: "US (Unit Separator)", 32: "SPC (Space)",
        127: "DEL (Delete)"
    };

    // Common named HTML Entities
    const htmlEntityNames = {
        34: "&quot;",
        38: "&amp;",
        39: "&apos;",
        60: "&lt;",
        62: "&gt;",
        160: "&nbsp;",
        161: "&iexcl;",
        162: "&cent;",
        163: "&pound;",
        164: "&curren;",
        165: "&yen;",
        166: "&brvbar;",
        167: "&sect;",
        168: "&uml;",
        169: "&copy;",
        170: "&ordf;",
        171: "&laquo;",
        172: "&not;",
        173: "&shy;",
        174: "&reg;",
        175: "&macr;",
        176: "&deg;",
        177: "&plusmn;",
        178: "&sup2;",
        179: "&sup3;",
        180: "&acute;",
        181: "&micro;",
        182: "&para;",
        183: "&middot;",
        184: "&cedil;",
        185: "&sup1;",
        186: "&ordm;",
        187: "&raquo;",
        188: "&frac14;",
        189: "&frac12;",
        190: "&frac34;",
        191: "&iquest;",
        215: "&times;",
        247: "&divide;"
    };

    for (let i = 0; i < 256; i++) {
        const decimal = i;
        const octal = i.toString(8).padStart(3, "0");
        const hex = i.toString(16).toUpperCase().padStart(2, "0");
        const binary = i.toString(2).padStart(8, "0");

        // Symbol column (handles control chars)
        let symbol;
        if (controlNames[i]) {
            symbol = controlNames[i];
        } else if (i >= 128 && i <= 159) {
            symbol = "Control / Unassigned";
        } else {
            symbol = String.fromCharCode(i);
        }

        // HTML Code column (e.g. &#38;)
        const htmlCode = `&#${i};`;

        // HTML Name column (e.g. &amp; or N/A)
        const htmlName = htmlEntityNames[i] || "-";

        const row = document.createElement("tr");

        // Array matching exact 6 columns: Decimal | Octal | Hex | Binary | Symbol | HTML Code | HTML Name
        const rowData = [
            decimal,
            octal,
            hex,
            binary,
            symbol,
            htmlCode,
            htmlName
        ];

        rowData.forEach(text => {
            const td = document.createElement("td");
            td.textContent = text; // Safe text insertion prevents HTML breaking
            row.appendChild(td);
        });

        tableBody.appendChild(row);
    }
});