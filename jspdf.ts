import { jsPDF, jsPDFAPI, jsPDFOptions } from "jspdf";
import fs from "fs";

import {
  AddTextParamas,
  Colors,
  HorizontalSection,
  HorizontalSectionData,
  TableHeader,
} from "./types";
import { jsPDFConstructor } from "jspdf-autotable";

export class PDF {
  doc: any;
  docWidth: number;
  docHeight: number;

  colors: Colors;
  // TableData
  header: TableHeader[];
  tdWidth: number;
  private currentHeight: number;
  pdfConfig: {
    headerTextSize: number;
    labelTextSize: number;
    fieldTextSize: number;
    lineHeight: number;
    subLineHeight: number;
    gap1: number;
    sectionWidth: number;
  };
  constructor(jspdfOptions: jsPDFOptions) {
    this.doc = new jsPDF(jspdfOptions);
    this.docWidth = this.doc.internal.pageSize.width;
    this.docHeight = this.doc.internal.pageSize.height;
    this.colors = {
      pink: "#ec187b",
      gray: "#585858",
      black: "#000000",
      white: "#FFFFFF",
    };
    this.currentHeight = 22;
    this.pdfConfig = {
      headerTextSize: 28,
      labelTextSize: 12,
      fieldTextSize: 10,
      lineHeight: 5.5,
      subLineHeight: 4.2,
      gap1: 10,
      sectionWidth: 52,
    };
    this.addText = this.addText.bind(this);
    this.addGap1 = this.addGap1.bind(this);
    this.addGap2 = this.addGap2.bind(this);
    this.addH1 = this.addH1.bind(this);
    this.addLine = this.addLine.bind(this);
    this.addFooter = this.addFooter.bind(this);
    this.addTableHeader = this.addTableHeader.bind(this);
    this.tableBody = this.tableBody.bind(this);
    this.addFixedWidthText = this.addFixedWidthText.bind(this);
    this.addTableBottomTotalBreakdownData =
      this.addTableBottomTotalBreakdownData.bind(this);
    this.addHorizontalSections = this.addHorizontalSections.bind(this);
  }

  save(fileName: string) {
    this.doc.save(fileName || "./invoice.pdf");
  }

  get height() {
    return this.currentHeight;
  }

  set setHeight(value: number) {
    this.currentHeight = value;
  }

  addGap1() {
    this.currentHeight += this.pdfConfig.subLineHeight;
  }

  addGap2() {
    this.currentHeight += this.pdfConfig.lineHeight * 2;
  }

  addText({
    textType,
    text,
    align = "left",
    x = 8,
    y,
    fontSize,
    fontStyle = {
      fontFamily: "Times",
      fontWeight: "normal",
    },
    leading,
  }: AddTextParamas) {
    if (textType === "primary") {
      this.doc.setTextColor(this.colors.pink);
    } else if (textType === "secondary") {
      this.doc.setTextColor(this.colors.gray);
    } else if (textType === "light") {
      this.doc.setTextColor(this.colors.white);
    } else {
      this.doc.setTextColor(this.colors.black);
    }
    if (fontSize === "xxl") {
      this.doc.setFontSize(this.pdfConfig.headerTextSize);
    } else {
      this.doc.setFontSize(this.pdfConfig.fieldTextSize);
    }
    if (leading === "xl") {
      this.currentHeight += this.pdfConfig.gap1;
    } else if (leading === "lg") {
      this.currentHeight += this.pdfConfig.lineHeight;
    } else if (leading === "base") {
      this.currentHeight += this.pdfConfig.subLineHeight;
    }

    this.doc.setFont(
      fontStyle.fontFamily || "Times",
      fontStyle.fontWeight || "normal"
    );

    this.doc.text(text, x, y ? y : this.currentHeight, {
      align: align,
    });
  }

  addH1({
    text,
    textType = "secondary",
  }: {
    text: string;
    textType?: AddTextParamas["textType"];
  }) {
    this.addText({
      textType: textType,
      text: text,
      align: "left",
      fontSize: "xxl",
      fontStyle: {
        fontWeight: "bold",
      },
    });
  }

  addLine(nogap?: any, topGap?: boolean) {
    !topGap && this.addGap1();
    this.doc.setDrawColor(this.colors.pink);
    this.doc.setLineWidth(0.3);
    this.doc.line(8, this.currentHeight, this.docWidth - 8, this.currentHeight);
    !nogap && this.addGap2();
  }

  addFixedWidthText(data: AddTextParamas, width: number) {
    const splitTitle2 = this.doc.splitTextToSize(data.text, width);
    for (let c = 0, stlength = splitTitle2.length; c < stlength; c++) {
      this.addText({
        text: splitTitle2[c],
        align: "left",
        leading: "base",
        // fontStyle: line.weight,
      });
    }
  }
  addHorizontalSections(data: HorizontalSection[]) {
    let maxHeight = -Infinity;
    let y_start = this.currentHeight;
    let accumulatedWidth = 8;
    data.forEach((col, i) => {
      let h = this.currentHeight;
      let x_start: number = accumulatedWidth + (data[i - 1]?.width || 0);
      accumulatedWidth += x_start;

      this.addText({
        text: col.title,
        align: "left",
        leading: "lg",
        fontSize: "lg",
        textType: "primary",
        fontStyle: {
          fontWeight: "bold",
        },
        x: x_start,
        y: y_start,
      });

      col.dataArr.forEach((colText: HorizontalSectionData) => {
        const splitTitle2 = this.doc.splitTextToSize(colText.text, 90);
        for (let c = 0, stlength = splitTitle2.length; c < stlength; c++) {
          this.addText({ ...colText, text: splitTitle2[c], x: x_start });
        }
      });
      // h += this.currentHeight
      if (maxHeight < this.currentHeight) {
        maxHeight = this.currentHeight;
      }

      console.log();

      this.currentHeight = y_start;
    });

    this.currentHeight = maxHeight;
  }

  addFooter({ height, page }: { height: number; page?: number }) {
    // this.doc.setFillColor(this.colors.pink);
    // this.doc.setDrawColor(colorPink);
    this.doc.setFillColor(this.colors.pink);
    // const rectHeight =
    this.doc.rect(0, this.docHeight - height, this.docWidth, height, "F");
    this.addText({
      x: this.docWidth / 2,
      y: this.docHeight - (height / 2 - this.pdfConfig.lineHeight / 2),
      text: "",
      // align: "center",
    });
    this.doc.addImage(
      fs.readFileSync("./logo.png"),
      "PNG",
      8,
      this.docHeight - 15
    );
    this.addText({
      x: 8,
      y: this.docHeight - height + 10,
      text: "Powered By",
      textType: "light",
      // align: "center",
    });
    this.doc.text(
      "page" + `${page ? page : 1} / ${this.doc.getNumberOfPages()}`,
      this.docWidth - 20,
      this.docHeight - 10
    );
  }

  addTableHeader(headerList: TableHeader[]) {
    this.header = headerList;
    // if (headerBorder) addTableHeaderBorder();
    var tdWidth = (this.doc.getPageWidth() - 20) / headerList.length;
    this.tdWidth = tdWidth;
    this.addGap2();

    // this.doc.setTextColor(this.colors.black);
    // this.doc.setFontSize(this.pdfConfig.fieldTextSize);
    //border color
    // this.doc.setDrawColor(this.colors.gray);
    // this.currentHeight += 2;
    let startWidth = 0;
    this.doc.setFillColor(this.colors.pink);
    this.doc.rect(8, this.currentHeight - 5, this.docWidth - 16, 10, "F");

    headerList.forEach((row, index) => {
      // this.doc.setTextColor("#ffffff");

      if (index == 0)
        this.addText({
          text: row.title,
          x: 11,
          y: this.currentHeight + 1,
          textType: "light",
          fontStyle: {
            fontWeight: "bold",
          },
        });
      else {
        const currentTdWidth = row?.style?.width || tdWidth;
        const previousTdWidth = headerList[index - 1]?.style?.width || tdWidth;
        const widthToUse =
          currentTdWidth == previousTdWidth ? currentTdWidth : previousTdWidth;
        startWidth += widthToUse;
        this.addText({
          text: row.title,
          x: startWidth + 11,
          y: this.currentHeight + 1,
          textType: "light",
          fontStyle: {
            fontWeight: "bold",
          },
        });
      }
    });

    this.currentHeight += this.pdfConfig.subLineHeight - 1;
    this.doc.setTextColor(this.colors.gray);
  }

  tableBody(data: any) {
    const splitTextAndGetHeight = (text: string, size: number) => {
      var lines = this.doc.splitTextToSize(text, size);
      return {
        text: lines,
        height: this.doc.getTextDimensions(lines).h,
      };
    };
    var tableBodyLength = data.length;

    data.forEach((row, index) => {
      index == 0 && this.addGap1();
      index !== 0 &&
        this.doc.line(
          10,
          this.currentHeight,
          this.docWidth - 10,
          this.currentHeight
        );

      //get nax height for the current row
      var getRowsHeight = () => {
        let rowsHeight = [];
        row.forEach((rr, index) => {
          const widthToUse = this.header[index]?.style?.width || this.tdWidth;

          let item = splitTextAndGetHeight(rr.toString(), widthToUse - 1); //minus 1, to fix the padding issue between borders
          rowsHeight.push(item.height);
        });

        return rowsHeight;
      };

      var maxHeight = Math.max(...getRowsHeight());

      //body borders
      // if (param.invoice.tableBodyBorder) addTableBodyBorder(maxHeight + 1);

      let startWidth = 0;
      row.forEach((rr, ind) => {
        const widthToUse = this.header[ind]?.style?.width || this.tdWidth;
        let item = splitTextAndGetHeight(rr.toString(), widthToUse - 1); //minus 1, to fix the padding issue between borders

        if (ind == 0)
          this.addText({
            text: String(index + 1),
            x: 11,
            y: this.currentHeight + 4,
            textType: "secondary",
            fontStyle: {
              fontWeight: "bold",
            },
          });
        else {
          const currentTdWidth = rr?.style?.width || this.tdWidth;
          const previousTdWidth =
            this.header[ind - 1]?.style?.width || this.tdWidth;
          const widthToUse =
            currentTdWidth == previousTdWidth
              ? currentTdWidth
              : previousTdWidth;
          startWidth += widthToUse;
          this.addText({
            text: item.text,
            x: 11 + startWidth,
            y: this.currentHeight + 4,
            textType: "secondary",
            fontStyle: {
              fontWeight: "bold",
            },
          });
        }
      });

      this.currentHeight += maxHeight - 4;

      //td border height
      this.currentHeight += 5;

      //pre-increase currentHeight to check the height based on next row
      if (index + 1 < tableBodyLength) this.currentHeight += maxHeight;

      // if (
      //   param.orientationLandscape &&
      //   (currentHeight > 185 ||
      //     (currentHeight > 178 && doc.getNumberOfPages() > 1))
      // ) {
      //   doc.addPage();
      //   currentHeight = 10;
      //   if (index + 1 < tableBodyLength) addTableHeader();
      // }

      if (
        //   !param.orientationLandscape &&
        this.currentHeight > 255 ||
        (this.currentHeight > 255 && this.doc.getNumberOfPages() > 1)
      ) {
        this.doc.addPage();
        this.currentHeight = 10;
        if (index + 1 < tableBodyLength) {
          this.addTableHeader(this.header);
          this.addGap1();
        }
        //else
        //currentHeight += pdfConfig.subLineHeight + 2 + pdfConfig.subLineHeight - 1; //same as in addtableHeader
      }

      //reset the height that was increased to check the next row
      // if (index + 1 < tableBodyLength && currentHeight > 30)
      // check if new page
      //   currentHeight -= maxHeight;
    });

    if (this.doc.getNumberOfPages() > 1) {
      for (let i = 1; i <= this.doc.getNumberOfPages(); i++) {
        // this.doc.setFontSize(this.pdfConfig.fieldTextSize - 2);
        // this.doc.setTextColor(this.colors.gray);

        // if (true) {
        //   this.doc.setFillColor(this.colors.pink);
        //   this.doc.rect(0, this.docHeight - 25, this.docWidth, 25, "F");
        //   this.doc.text(
        //     this.docWidth / 2,
        //     this.docHeight - 10,
        //     "hello",
        //     "center"
        //   );
        //   this.doc.setPage(i);
        //   this.doc.text(
        //     "page" + " " + i + " / " + this.doc.getNumberOfPages(),
        //     this.docWidth - 20,
        //     this.doc.internal.pageSize.height - 6
        //   );
        // }

        this.addFooter({
          height: 32,
          page: i,
        });

        //   checkAndAddPageNotLandscape(183);
        //   checkAndAddPageLandscape();
        //   addStamp();
      }
    }
  }

  addTableBottomTotalBreakdownData() {
    const data = [
      {
        label: "VAT (5%)",
        value: "AED 1942.50",
      },
      {
        label: "VAT (5%)",
        value: "AED 1942.50",
      },
      {
        label: "VAT (5%)",
        value: "AED 1942.50",
      },
    ];

    data.forEach((row: any) => {
      this.addGap1();
      this.addGap1();
      this.addText({
        text: row.label,
        align: "right",
        x: this.docWidth - (65),
      });
      this.addText({
        text: row.value,
        align: "right",
        x: this.docWidth - (15 ),
      });
    });
  }
}
