import { doSOAPRequest } from "./soap.ts";
import {
  ArticleRegistration,
  BigSearchParam,
  ReferenceData,
  SoapReturnItem,
  SOAPReturnType,
} from "../types.ts";
import { getReferenceData, getReferenceDataLocal, searchProfessionalGroup } from "./reference.ts";

const EMPTY_DATE = "0001-01-01T00:00:00";

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
            <ext:City>${params.city || ""}</ext:City>
            <ext:DateOfBirth>${params.dateOfBirth || ""}</ext:DateOfBirth>
            <ext:ProfessionalGroup>${params.professionalGroup || ""}</ext:ProfessionalGroup>
            <ext:TypeOfSpecialism>${params.typeOfSpecialism || ""}</ext:TypeOfSpecialism>
        </ext:listHcpApproxRequest>
      </soapenv:Body>
    </soapenv:Envelope>`;
  return xml;
};

type BigRegistration = {
  BIG: number;
  start: string;
  end: string | null;
  group: string | null;
  active: boolean;
};

type GenericBIGReturn = {
  birthSurname: string;
  mailingName: string;
  initial: string;
  gender: string;
  _raw: unknown;
};

type BigReturnSingle = GenericBIGReturn & BigRegistration;
type BigReturnMultiple = GenericBIGReturn & { registrations: BigRegistration[] };
type BIGReturn = BigReturnSingle | BigReturnMultiple;

const translateRegistration = (
  data: ArticleRegistration,
  referenceData: ReferenceData | null,
): BigRegistration => {
  const group = searchProfessionalGroup(data.ProfessionalGroupCode, referenceData);
  return {
    BIG: data.ArticleRegistrationNumber,
    start: data.ArticleRegistrationStartDate,
    end: data.ArticleRegistrationEndDate === EMPTY_DATE ? null : data.ArticleRegistrationEndDate,
    group: group ? group.Title : null,
    active: data.ArticleRegistrationEndDate === EMPTY_DATE,
  };
};

const translateBIG = (data: SoapReturnItem, referenceData: ReferenceData | null): BIGReturn => {
  const {
    BirthSurname: birthSurname,
    MailingName: mailingName,
    Initial: initial,
    Gender: gender,
    ArticleRegistration,
  } = data;
  const baseReturn = {
    birthSurname,
    mailingName,
    initial,
    gender,
  };

  const registrationData = ArticleRegistration.ArticleRegistrationExtApp;
  if (Array.isArray(registrationData)) {
    const registrations = registrationData.map((r) => translateRegistration(r, referenceData));
    return {
      ...baseReturn,
      registrations,
      _raw: data,
    };
  }

  const registration = translateRegistration(registrationData, referenceData);

  return {
    ...baseReturn,
    ...registration,
    _raw: data,
  };
};

export const searchBIG = async (
  params: BigSearchParam,
  optionalParams = {
    debug: false,
    remoteReferenceData: false,
  },
): Promise<
  { data: BIGReturn | BIGReturn[] | null; size: number; statusCode: number }
> => {
  const xml = generateXML(params);
  const { statusCode, data } = await doSOAPRequest<SOAPReturnType>(xml);

  if (statusCode === 200 && data !== null) {
    const res = data["soap:Envelope"]["soap:Body"].ListHcpApprox4Result.ListHcpApprox;
    const d = res ? res.ListHcpApprox4 : null;

    const referenceData = optionalParams.remoteReferenceData
      ? await getReferenceData()
      : await getReferenceDataLocal();
    const translatedData = d
      ? Array.isArray(d)
        ? d.map((item) => translateBIG(item, referenceData))
        : translateBIG(d, referenceData)
      : null;

    return {
      data: translatedData,
      statusCode,
      size: translatedData === null ? 0 : Array.isArray(translatedData) ? translatedData.length : 1,
    };
  }

  if (optionalParams.debug && statusCode !== 200) {
    console.log("ERROR", statusCode, xml);
  }

  return { data: null, size: 0, statusCode };
};
