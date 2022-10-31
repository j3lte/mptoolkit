import { parseXML, soapRequest } from "../../deps.ts";
import {
  BigSearchParam,
  SOAPReferenceReturnType,
  SoapReturnItem,
  SOAPReturnType,
} from "./types.ts";

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

const generateXML = (params: BigSearchParam) => {
  const xml =
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ext="http://services.cibg.nl/ExternalUser">
      <soapenv:Header/>
      <soapenv:Body>
        <ext:listHcpApproxRequest>
            <ext:WebSite>Ribiz</ext:WebSite>
            <ext:Name>${("name" in params) ? params.name : ""}</ext:Name>
            <ext:RegistrationNumber>${
      ("registrationNumber" in params) ? params.registrationNumber : ""
    }</ext:RegistrationNumber>
            <ext:Initials>${params.initials || ""}</ext:Initials>
            <ext:Prefix>${params.prefix || ""}</ext:Prefix>
            <ext:Gender>${params.gender || ""}</ext:Gender>
            <ext:DateOfBirth>${params.dateOfBirth || ""}</ext:DateOfBirth>
            <ext:ProfessionalGroup>${params.professionalGroup || ""}</ext:ProfessionalGroup>
            <ext:TypeOfSpecialism>${params.typeOfSpecialism || ""}</ext:TypeOfSpecialism>
        </ext:listHcpApproxRequest>
      </soapenv:Body>
    </soapenv:Envelope>`;
  return xml;
};

export const searchBIG = async (
  params: BigSearchParam,
  debug = false,
): Promise<
  { data: SoapReturnItem | SoapReturnItem[] | null; size: number; statusCode: number }
> => {
  const xml = generateXML(params);

  const { response } = await soapRequest({
    ...SOAP_OPTS,
    xml,
  });
  const { body, statusCode } = response;

  if (statusCode === 200) {
    const parsed = parseXML(body) as unknown as SOAPReturnType;
    const res = parsed["soap:Envelope"]["soap:Body"].ListHcpApprox4Result.ListHcpApprox;
    const data = res ? res.ListHcpApprox4 : null;
    return { data, statusCode, size: data === null ? 0 : Array.isArray(data) ? data.length : 1 };
  }

  if (debug) {
    console.log("ERROR", statusCode, xml);
  }
  return { data: null, size: 0, statusCode };
};

export const getReferenceData = async () => {
  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ext="http://services.cibg.nl/ExternalUser">
    <soapenv:Header/>
    <soapenv:Body>
      <ext:GetRibizReferenceData>
          <!--Optional:-->
          <ext:getCibgReferenceDataRequest/>
      </ext:GetRibizReferenceData>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

  const { response } = await soapRequest({
    ...SOAP_OPTS,
    xml,
  });
  const { body, statusCode } = response;

  if (statusCode === 200) {
    const parsed = parseXML(body) as unknown as SOAPReferenceReturnType;
    return parsed["soap:Envelope"]["soap:Body"].GetRibizReferenceDataResponse
      .GetRibizReferenceDataResult;
  }

  console.log("ERROR", statusCode, xml);
  return null;
};
