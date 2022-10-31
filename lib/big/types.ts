type BigSearchOptionalParams = {
  /**
   * Exacte vergelijking op de voorletters van de zorgverlener.
   * De zoekterm moet voldoen aan de volgende eisen:
   * - Minimaal 1 letter ([a-z] of [A-Z]);
   * - Daarnaast zijn toegestaan:
   *    - Punten.
   */
  initials?: string;
  /**
   * Exacte vergelijking op het voorvoegsels van de zorgverlener.
   * De zoekterm moet voldoen aan de volgende eisen:
   * - Minimaal 1 letter ([a-z] of [A-Z]);
   * - Daarnaast zijn toegestaan:
   *    - Apostrof (maximaal 1);
   *    - Spaties.
   */
  prefix?: string;
  // street?: string;
  gender?: "M" | "V" | "O";
  // houseNumber?: string;
  // postalcode?: string;
  city?: string;
  dateOfBirth?: string;
  /**
   * Exacte vergelijking op de code beroepsgroep van de
   * zorgverlener. De zoekterm moet bestaan uit 1 of 2 cijfers.
   */
  professionalGroup?: number;
  /**
   * Exacte vergelijking op de code specialisme van de
   * zorgverlener. De zoekterm mag uitsluitend cijfers
   * bevatten.
   */
  typeOfSpecialism?: number;
};

type BigSearchParamWithName = {
  /**
   * Zoeken op de aanschrijfnaam van de zorgverlener,
   * conform de aanduiding naamgebruik bij het GBA, zonder
   * voorletters (voorbeeld: “de Vries-Bakker”). De zoekterm
   * moet geheel of gedeeltelijke overeenkomen met de
   * aanschrijfnaam en is hoofdletter- en diakriet-ongevoelig
   *
   * (voorbeeld: “boh” matcht met “Von Böhm”).
   *
   * De zoekterm moet voldoen aan de volgende eisen:
   *
   * - Minimaal 2 letters ([a-z] of [A-Z]);
   * - Daarnaast zijn toegestaan:
   *    - Apostrof (maximaal 1);
   *    - Spaties;
   *    - Koppeltekens (geen onderstrepingstekens!).
   */
  name: string;
} & BigSearchOptionalParams;

type BigSearchParamWithRegistrationNumber = {
  /**
   * Exacte vergelijking op het BIG-nummer van de
   * zorgverlener. De zoekterm mag uitsluitend cijfers
   * bevatten.
   */
  registrationNumber: number;
} & BigSearchOptionalParams;

export type BigSearchParam = BigSearchParamWithName | BigSearchParamWithRegistrationNumber;

export type ArticleRegistration = {
  ArticleRegistrationNumber: number;
  ArticleRegistrationStartDate: string;
  ArticleRegistrationEndDate: string;
  ProfessionalGroupCode: number;
};

export type SoapReturnItem = {
  /**
   * Geboortenaam van de zorgverlener
   */
  BirthSurname: string;
  /**
   * Aanschrijfnaam van de zorgverlener (volgens GBA indien van toepassing)
   */
  MailingName: string;
  /**
   * Voorletters van de zorgverlener
   */
  Initial: string;
  /**
   * Geslacht van de zorgverlener
   */
  Gender: string;
  ArticleRegistration: {
    ArticleRegistrationExtApp: ArticleRegistration | ArticleRegistration[];
  };
  Specialism: unknown;
  Mention: unknown;
  JudgementProvision: unknown;
  Limitation: unknown;
};

export type GenericSoapReturn<T> = {
  xml: unknown;
  "soap:Envelope": {
    "soap:Body": T;
  };
};

export type SOAPReturnType = GenericSoapReturn<{
  ListHcpApprox4Result: {
    "@xmlns": "http://services.cibg.nl/ExternalUser";
    ListHcpApprox: {
      ListHcpApprox4: SoapReturnItem | SoapReturnItem[];
    };
  };
}>;

export type SpecialismItem = {
  "Code": number;
  "Description": string;
  "DescriptionEn"?: string | null;
  "TitleOfSpecialist": string;
  "TitleOfSpecialistEn"?: string | null;
  "Register": string;
  "EndDate": {
    "@xsi:nil": boolean;
    "#text": null | string;
  } | string;
  "ProfessionalGroupCode": number;
};

export type ProfessionalGroupItem = {
  "Code": number;
  "Description": string;
  "DescriptionEnglish": string;
  "Title": string;
  "Article3": boolean;
  "Article34": boolean;
  "BusinessOwner": number;
  "RequiredHoursForReregistration": number;
};
export type ReferenceData = {
  ProfessionalGroups: {
    ProfessionalGroup: Array<ProfessionalGroupItem>;
  };
  TypeOfSpecialisms: {
    TypeOfSpecialism: Array<SpecialismItem>;
  };
};

export type SOAPReferenceReturnType = GenericSoapReturn<{
  GetRibizReferenceDataResponse: {
    "@xmlns": "http://services.cibg.nl/ExternalUser";
    GetRibizReferenceDataResult: ReferenceData;
  };
}>;
