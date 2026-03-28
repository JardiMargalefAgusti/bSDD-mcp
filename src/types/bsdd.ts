// ── bSDD API response types (camelCase as returned by the API) ──

// ── Dictionary ──

export interface DictionaryLanguage {
  code: string;
  name: string;
}

export interface DictionarySummary {
  uri: string;
  name: string;
  code: string;
  version: string;
  organizationCodeOwner: string;
  organizationNameOwner: string;
  defaultLanguageCode: string;
  isLatestVersion: boolean;
  isVerified: boolean;
  isPrivate: boolean;
  license: string;
  licenseUrl: string;
  status: string;
  moreInfoUrl: string;
  releaseDate: string;
  lastUpdatedUtc: string;
  availableLanguages: DictionaryLanguage[];
}

export interface DictionaryListResponse {
  dictionaries: DictionarySummary[];
  totalCount: number;
  offset: number;
  count: number;
}

// ── Dictionary Classes ──

export interface ClassReference {
  uri: string;
  name: string;
  code: string;
  classType?: string;
  referenceCode?: string;
  description?: string;
  parentClassReference?: ClassReference;
  children?: ClassReference[];
}

export interface DictionaryClassesResponse {
  uri: string;
  name: string;
  version: string;
  classes: ClassReference[];
  classesTotalCount: number;
  classesOffset: number;
  classesCount: number;
}

// ── Class ──

export interface ClassPropertyAllowedValue {
  uri: string;
  code: string;
  value: string;
  description?: string;
}

export interface ClassProperty {
  name: string;
  uri: string;
  description?: string;
  definition?: string;
  dataType?: string;
  propertyCode: string;
  propertyDictionaryName?: string;
  propertyDictionaryUri?: string;
  propertyUri: string;
  propertySet?: string;
  propertyStatus?: string;
  propertyValueKind?: string;
  unit?: string;
  allowedValues?: ClassPropertyAllowedValue[];
  isRequired?: boolean;
  isWritable?: boolean;
  minExclusive?: number;
  maxExclusive?: number;
  minInclusive?: number;
  maxInclusive?: number;
  pattern?: string;
}

export interface ClassRelation {
  uri: string;
  name: string;
  relationType: string;
  relatedClassName: string;
  relatedClassUri: string;
  fraction?: number;
}

export interface ClassDetail {
  uri: string;
  code: string;
  name: string;
  classType: string;
  referenceCode?: string;
  definition?: string;
  description?: string;
  dictionaryUri: string;
  parentClassReference?: ClassReference;
  relatedIfcEntityNames?: string[];
  synonyms?: string[];
  status?: string;
  activationDateUtc?: string;
  versionDateUtc?: string;
  countriesOfUse?: string[];
  classProperties?: ClassProperty[];
  classRelations?: ClassRelation[];
  childClassReferences?: ClassReference[];
}

// ── Class Search ──

export interface ClassSearchResult {
  dictionaryUri: string;
  name: string;
  code: string;
  referenceCode?: string;
  uri: string;
  classType: string;
  description?: string;
  relatedIfcEntityNames?: string[];
}

export interface ClassSearchResponse {
  classes: ClassSearchResult[];
  totalCount: number;
  offset: number;
  count: number;
}

// ── Class Properties (paginated) ──

export interface ClassPropertiesResponse {
  classProperties: ClassProperty[];
  classPropertiesTotalCount: number;
  classPropertiesOffset: number;
  classPropertiesCount: number;
}

// ── Class Relations (paginated) ──

export interface ClassRelationsResponse {
  classRelations: ClassRelation[];
  classRelationsTotalCount: number;
  classRelationsOffset: number;
  classRelationsCount: number;
}

// ── Property ──

export interface PropertyDetail {
  uri: string;
  code: string;
  name: string;
  definition?: string;
  description?: string;
  dataType?: string;
  propertyValueKind?: string;
  units?: string[];
  qudtCodes?: string[];
  dictionaryUri: string;
  status?: string;
  activationDateUtc?: string;
  versionDateUtc?: string;
  countriesOfUse?: string[];
  subdivisionsOfUse?: string[];
  connectedPropertyCodes?: string[];
  replacedObjectCodes?: string[];
  replacingObjectCodes?: string[];
  allowedValues?: ClassPropertyAllowedValue[];
  minExclusive?: number;
  maxExclusive?: number;
  minInclusive?: number;
  maxInclusive?: number;
  pattern?: string;
}

// ── Property Classes ──

export interface PropertyClassReference {
  uri: string;
  name: string;
  code: string;
  dictionaryUri: string;
  dictionaryName?: string;
}

export interface PropertyClassesResponse {
  propertyClasses: PropertyClassReference[];
  totalCount: number;
  offset: number;
  count: number;
}

// ── Text Search ──

export interface TextSearchDictionary {
  uri: string;
  name: string;
  code: string;
  version: string;
  organizationName?: string;
  status?: string;
  isLatestVersion: boolean;
  isVerified: boolean;
  languages?: { isoCode: string; name: string }[];
}

export interface TextSearchResponse {
  classes: ClassSearchResult[];
  properties: PropertyDetail[];
  dictionaries: TextSearchDictionary[];
  totalCount: number;
  offset: number;
  count: number;
}
