import { DOMParser, Element, HTMLDocument, initParser, NodeList } from "../../../deps.ts";

export const getHTMLDocument = async (body: string) => {
  await initParser();

  return new DOMParser().parseFromString(body, "text/html") as HTMLDocument;
};

export const nodeListEach = (
  list: unknown,
  cb: (el: Element, index: number) => void,
) => {
  const nodeList = list as NodeList;
  nodeList.forEach((node, index) => {
    const el = node as Element;
    cb(el, index);
  });
};

export const cleanString = (text = ""): string => {
  const re = new RegExp(String.fromCharCode(160), "g");
  return text.replace(re, " ").replace(/ +(?= )/g, "").trim();
};

export const cleanWhiteSpace = (text = ""): string => text.replace(/^\s*[\t\r\n]/gm, "");

export const cleanParagraphs = (text = ""): string[] => {
  const cleaned = cleanWhiteSpace(cleanString(text));
  return cleaned.split("\n").map((s) => cleanString(s));
};

export const useElementContent = (
  doc: HTMLDocument,
  selector: string,
  cb: (content: string) => void,
): void => {
  const element = doc.querySelector(selector);
  if (element) {
    const content = element.getAttribute("content");
    if (content) {
      cb(cleanString(content));
    }
  }
};
