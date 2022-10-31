import { parseXML, soapRequest } from "../../../deps.ts";

const END_POINT = "https://publicwebservices-dcr.cibg.nl:443/zorro/zksrv/4/zoeken-soap";

const SOAP_OPTS = {
  url: END_POINT,
  method: "POST",
  headers: {
    "user-agent": `Deno v${Deno.version.deno}`,
    "Content-Type": "text/xml;charset=UTF-8",
  },
  extraOpts: {},
};

export const doSOAPRequest = async <T>(
  xml: string,
): Promise<{ statusCode: number; data: T | null }> => {
  const { response } = await soapRequest({
    ...SOAP_OPTS,
    xml,
  });
  const { body, statusCode } = response;
  if (statusCode === 200) {
    return { statusCode, data: parseXML(body) as unknown as T };
  }
  return { statusCode, data: null };
};
