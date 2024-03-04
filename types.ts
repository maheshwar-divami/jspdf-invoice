import { HTMLFontFace, TextOptionsLight } from "jspdf";

type options = {};

export interface AddTextParamas {
  textType?: "primary" | "secondary" | "light";
  text: string;
  align?: TextOptionsLight["align"];
  x?: number;
  y?: number;
  fontSize?: "sm" | "base" | "lg" | "xl" | "xxl";
  leading?: "sm" | "base" | "lg" | "xl";
  fontStyle?: {
    fontFamily?: "Times";
    fontWeight?: HTMLFontFace["weight"];
  };
}

export type Colors = {
  pink: string;
  gray: string;
  black: string;
  white: string;
};

export type HorizontalSectionData = AddTextParamas;

export interface HorizontalSection {
  title: string;
  width: number;
  dataArr: HorizontalSectionData[];
}

export interface TableHeader {
  title: string;
  style?: {
    width?: number;
  };
}
