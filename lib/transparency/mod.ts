import { urlcat } from "../../deps.ts";
import { getHTMLDocument } from "./util/html.ts";
import { generateToken } from "./util/transparency-token.ts";
import { cleanString, nodeListEach } from "./util/html.ts";

type TransparencyData = {
  person: { [key: string]: string };
  totals: { [key: string]: number };
  registrations: {
    title?: string;
    results?: { [key: string]: string }[];
  };
};

type SearchType = "big" | "kvk";

export const fetchTransparencyData = async (query: string, type: SearchType = "big") => {
  const token = generateToken();
  const url = urlcat("https://www.registratiecommissie.nl/TransparencyWeb/Results/", {
    "search_value": query,
    "search_type": type,
    "token": token,
  });

  const response = await fetch(url);
  const data = await response.text();
  const html = await getHTMLDocument(data);

  const personResults = html.querySelector(".searchResults");
  const payments = html.querySelector(".results");

  const result: TransparencyData = {
    person: {},
    totals: {},
    registrations: {},
  };

  if (personResults) {
    const rows = personResults.querySelectorAll(".searchRow");
    nodeListEach(rows, (row) => {
      const identifier = row.querySelector(".columnLeft");
      const value = row.querySelector(".columnRight");
      if (identifier && value) {
        result.person[cleanString(identifier.textContent)] = cleanString(value.textContent);
      }
    });
  }

  if (payments) {
    const resultsTitle = payments.querySelector("h2");
    if (resultsTitle) {
      result.registrations.title = cleanString(resultsTitle.textContent);
    }

    const results = payments.querySelectorAll("ol li");
    if (results.length > 0) {
      result.registrations.results = [];
    }
    nodeListEach(results, (el) => {
      const content = el.innerHTML.split("<br>").reduce<{ [key: string]: string }>((obj, s) => {
        const cleaned = cleanString(s);
        const arr = cleaned.split(":").map((s) => cleanString(s));
        obj[arr[0]] = arr[1];
        return obj;
      }, {});
      result.registrations.results?.push(content);
    });
  }

  if (result.registrations.results && result.registrations.results.length > 0) {
    const totals = result.registrations.results.reduce<{ [key: string]: number }>((obj, item) => {
      const jaar = item["Jaar"];
      const amount = parseFloat(item["Bedrag"].replace("€", "").replace(",", "."));
      if (jaar && amount && !isNaN(amount)) {
        if (!obj[jaar]) {
          obj[jaar] = 0;
        }
        obj[jaar] = obj[jaar] + amount;
      }
      return obj;
    }, {});
    result.totals = totals;
  }

  return result;
};
