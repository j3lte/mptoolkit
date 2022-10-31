import referenceData from "../reference-data-20221031.ts";
import { ReferenceData, SOAPReferenceReturnType } from "../types.ts";
import { doSOAPRequest } from "./soap.ts";

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

  const { data, statusCode } = await doSOAPRequest<SOAPReferenceReturnType>(xml);

  if (statusCode === 200 && data !== null) {
    return data["soap:Envelope"]["soap:Body"].GetRibizReferenceDataResponse
      .GetRibizReferenceDataResult;
  }

  return null;
};

export const getReferenceDataLocal = () => {
  return Promise.resolve(referenceData);
};

export const searchSpecialism = (code: number, data: ReferenceData | null) => {
  if (data === null) {
    return null;
  }
  return data.TypeOfSpecialisms.TypeOfSpecialism.find((item) => item.Code === code) || null;
};

export const searchProfessionalGroup = (code: number, data: ReferenceData | null) => {
  if (data === null) {
    return null;
  }
  return data.ProfessionalGroups.ProfessionalGroup.find((item) => item.Code === code) || null;
};
