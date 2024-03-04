import { jsPDF } from "jspdf";
import { PDF } from "./jspdf.js";
import { HorizontalSection, HorizontalSectionData, TableHeader } from "./types";
import fs from "fs";
import { invoiceData } from "./data.js";
const OutputType = {
  Save: "save", //save pdf as a file
  DataUriString: "datauristring", //returns the data uri string
  DataUri: "datauri", //opens the data uri in current window
  DataUrlNewWindow: "dataurlnewwindow", //opens the data uri in new window
  Blob: "blob", //return blob format of the doc,
  ArrayBuffer: "arraybuffer", //return ArrayBuffer format
};

function generateInvoicePDF({ invoiceData, outputType, fileName }: any) {
  const {buyer, supplier} = invoiceData;
  const options = {
    compress: false,
  };

  const {
    doc,
    addText,
    addH1,
    colors,
    docWidth,
    docHeight,
    addGap1,
    addLine,
    addHorizontalSections,
    addFixedWidthText,
    addFooter,
    addTableHeader,
    tableBody,
    addTableBottomTotalBreakdownData,
  } = new PDF(options);

  const contents = [
    "Fullfilled By Watermelon (Watermelon LTD)",
    "Fullfilled By Watermelon (Watermelon LTD)",
    "Fullfilled By Watermelon (Watermelon LTD)",
  ];

  addH1({
    text: `TAX INVOICE #${invoiceData.invoice_number}`,
    textType: "primary",
  });
  addText({
    textType: "secondary",
    text: `${invoiceData.updated_at}`,
    align: "left",
    leading: "lg",
    fontStyle: {
      fontWeight: "bold",
    },
  });

  addText({
    textType: "primary",
    text: "Customer:",
    align: "left",
    leading: "xl",
    fontStyle: { fontWeight: "bold" },
  });

  addText({
    text: `${buyer.business_name}`,
    align: "left",
    leading: "lg",
    fontStyle: {
      fontWeight: "bold",
    },
  });

  addText({
    text: "TRN No: 100610020800003",
    align: "left",
    leading: "base",
    fontStyle: {
      fontWeight: "bold",
    },
  });

  addFixedWidthText(
    {
      text: "Al Quoz, 1 - Al Quoz, Al Quoz First, Dubai, United Arab EmiratesAl Quoz ",
      leading: "base",
    },
    80
  );

  addText({
    text: "United Arab Emirates",
    align: "left",
    leading: "base",
  });

  addText({
    text: "Phone: +971-558322780",
    align: "left",
    leading: "base",
  });

  addText({
    text: "Mobile: +971-558322780",
    align: "left",
    leading: "base",
  });
  addText({
    text: "Email: the.meat.master.butchery@gmail.com",
    align: "left",
    leading: "base",
  });
  addLine();

  const supplierdetailsArr: HorizontalSection[] = [
    {
      title: "Supplier:",
      width: 90,
      dataArr: [
        {
          text: "Fullfilled By Watermelon (Watermelon LTD)",
          leading: "base",
          fontStyle: {
            fontWeight: "bold",
          },
        },
        {
          text: "Email: the.meat.master.butchery@gmail.com",
          leading: "base",
          fontStyle: {
            fontWeight: "bold",
          },
        },
        {
          text: "Barsha Heights., Al Warsan Building., Office 706, Dubai, United Arab Emirates",
          leading: "base",
        },
        { text: "Phone: - +971-562474204", leading: "base" },
        { text: "Mobile: +971-562474204", leading: "base" },
        { text: "Email: john@watermelon.market", leading: "base" },
      ],
    },
    {
      title: "Deliver To:",
      width: 35,
      dataArr: [
        {
          text: "Al Quoz, 1 - Al Quoz,",
          leading: "base",
          fontStyle: {
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      title: "Deliver Date:",
      width: 30,

      dataArr: [
        {
          text: "7th, October 2023",
          leading: "base",
        },
      ],
    },
  ];

  addHorizontalSections(supplierdetailsArr);

  addFooter({
    height: 32,
  });

  addText({
    text: "Particulars (Note: Amounts are shown in currency: AED)",
    align: "left",
    leading: "xl",
    fontStyle: {
      fontWeight: "bold",
    },
  });

  const header: TableHeader[] = [
    {
      title: "#.",
      style: {
        width: 10,
      },
    },
    {
      title: "Code",
      style: {
        width: 30,
      },
    },
    {
      title: "Product",
      style: {
        width: 80,
      },
    },
    { title: "Sku" },
    { title: "Price" },
    { title: "Quantity" },
    { title: "Amount" },
  ];

  const data = [
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
    [
      1,
      "WM00010",
      "Perdix 10x1200g (Brand:",
      "carton (10 pc)",
      92.5,
      420,
      "38850.00",
    ],
  ];

  var tdWidth = (doc.getPageWidth() - 20) / header.length;

  addTableHeader(header);
  // #endregion
  // currentHeight += pdfConfig.lineHeight;
  // addTableHeader();
  const splitTextAndGetHeight = (text: string, size: number) => {
    var lines = doc.splitTextToSize(text, size);
    return {
      text: lines,
      height: doc.getTextDimensions(lines).h,
    };
  };
  var tableBodyLength = data.length;
  tableBody(data);

  addText({
    text: "Total 1 Item(s)",
    align: "left",
    leading: "xl",
    fontStyle: {
      fontWeight: "bold",
    },
  });
  addLine(true);
  addText({
    text: "Payment Status : UnPaid",
    align: "left",
    leading: "base",
    fontStyle: {
      fontWeight: "bold",
    },
  });
  addLine(true);
  addGap1();

  addText({
    text: "AED 38850.00",
    align: "right",
    x: docWidth - 15,
  });

  addText({
    text: "Subtotal",
    align: "right",
    x: docWidth - 65,
  });

  addTableBottomTotalBreakdownData();
  addGap1();

  addLine(true, true);
  addGap1();

  addText({
    text: "AED 40792.50",
    align: "right",
    x: docWidth - 15,
    fontStyle: {
      fontWeight: "bold",
    },
  });

  addText({
    text: "Total",
    align: "right",
    x: docWidth - 65,
    fontStyle: {
      fontWeight: "bold",
    },
  });
  let returnObj: any = {
    pagesNumber: doc.getNumberOfPages(),
  };

  // if (param.returnJsPDFDocObject) {
  //   returnObj = {
  //     ...returnObj,
  //     jsPDFDocObject: doc,
  //   };
  // }

  if (outputType === "save") doc.save(fileName);
  else if (outputType === "blob") {
    const blobOutput = doc.output("blob");
    returnObj = {
      ...returnObj,
      blob: blobOutput,
    };
  } else if (outputType === "datauristring") {
    returnObj = {
      ...returnObj,
      dataUriString: doc.output("datauristring", {
        filename: fileName,
      }),
    };
  } else if (outputType === "arraybuffer") {
    returnObj = {
      ...returnObj,
      arrayBuffer: doc.output("arraybuffer"),
    };
  } else
    doc.output(outputType, {
      filename: fileName,
    });

  return returnObj;
}

const data = generateInvoicePDF({
  invoiceData,
  outputType: "arraybuffer",
  fileName: "./invoice.pdf",
});

console.log(data)