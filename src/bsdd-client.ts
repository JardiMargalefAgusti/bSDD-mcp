import type {
  DictionaryListResponse,
  DictionaryClassesResponse,
  ClassDetail,
  ClassSearchResponse,
  ClassPropertiesResponse,
  ClassRelationsResponse,
  PropertyDetail,
  PropertyClassesResponse,
  TextSearchResponse,
} from "./types/bsdd.js";

const BASE_URL = "https://api.bsdd.buildingsmart.org";
const USER_AGENT = "bSDD-MCP/1.0";

export class BsddClient {
  private async request<T>(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(path, BASE_URL);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== "") {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
    });

    if (response.status === 429) {
      // Rate limited — wait and retry once
      await new Promise((r) => setTimeout(r, 2000));
      return this.request<T>(path, query);
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`bSDD API error ${response.status}: ${response.statusText}. ${body}`);
    }

    return response.json() as Promise<T>;
  }

  // ── Dictionaries ──

  async listDictionaries(options?: {
    offset?: number;
    limit?: number;
  }): Promise<DictionaryListResponse> {
    return this.request<DictionaryListResponse>("/api/Dictionary/v1", {
      Offset: options?.offset,
      Limit: options?.limit ?? 50,
    });
  }

  async getDictionaryClasses(
    uri: string,
    options?: {
      offset?: number;
      limit?: number;
      languageCode?: string;
    }
  ): Promise<DictionaryClassesResponse> {
    return this.request<DictionaryClassesResponse>("/api/Dictionary/v1/Classes", {
      Uri: uri,
      Offset: options?.offset,
      Limit: options?.limit ?? 100,
      LanguageCode: options?.languageCode,
    });
  }

  // ── Classes ──

  async getClass(
    uri: string,
    options?: {
      includeClassProperties?: boolean;
      includeClassRelations?: boolean;
      includeChildClassReferences?: boolean;
      languageCode?: string;
    }
  ): Promise<ClassDetail> {
    return this.request<ClassDetail>("/api/Class/v1", {
      Uri: uri,
      IncludeClassProperties: options?.includeClassProperties ?? true,
      IncludeClassRelations: options?.includeClassRelations ?? false,
      IncludeChildClassReferences: options?.includeChildClassReferences ?? false,
      LanguageCode: options?.languageCode,
    });
  }

  async searchClasses(
    searchText: string,
    options?: {
      dictionaryUri?: string;
      relatedIfcEntity?: string;
      offset?: number;
      limit?: number;
      languageCode?: string;
    }
  ): Promise<ClassSearchResponse> {
    return this.request<ClassSearchResponse>("/api/Class/Search/v1", {
      SearchText: searchText,
      DictionaryUri: options?.dictionaryUri,
      RelatedIfcEntity: options?.relatedIfcEntity,
      Offset: options?.offset,
      Limit: options?.limit ?? 25,
      LanguageCode: options?.languageCode,
    });
  }

  async getClassProperties(
    classUri: string,
    options?: {
      offset?: number;
      limit?: number;
      languageCode?: string;
    }
  ): Promise<ClassPropertiesResponse> {
    return this.request<ClassPropertiesResponse>("/api/Class/Properties/v1", {
      Uri: classUri,
      Offset: options?.offset,
      Limit: options?.limit ?? 100,
      LanguageCode: options?.languageCode,
    });
  }

  async getClassRelations(
    classUri: string,
    options?: {
      offset?: number;
      limit?: number;
    }
  ): Promise<ClassRelationsResponse> {
    return this.request<ClassRelationsResponse>("/api/Class/Relations/v1", {
      Uri: classUri,
      Offset: options?.offset,
      Limit: options?.limit ?? 50,
    });
  }

  // ── Properties ──

  async getProperty(
    uri: string,
    options?: { languageCode?: string }
  ): Promise<PropertyDetail> {
    return this.request<PropertyDetail>("/api/Property/v5", {
      Uri: uri,
      LanguageCode: options?.languageCode,
    });
  }

  async getPropertyClasses(
    propertyUri: string,
    options?: {
      offset?: number;
      limit?: number;
    }
  ): Promise<PropertyClassesResponse> {
    return this.request<PropertyClassesResponse>("/api/Property/Classes/v1", {
      Uri: propertyUri,
      Offset: options?.offset,
      Limit: options?.limit ?? 50,
    });
  }

  // ── Search ──

  async textSearch(
    searchText: string,
    options?: {
      dictionaryUris?: string[];
      filterByType?: string;
      offset?: number;
      limit?: number;
      languageCode?: string;
    }
  ): Promise<TextSearchResponse> {
    const query: Record<string, string | number | boolean | undefined> = {
      SearchText: searchText,
      Offset: options?.offset,
      Take: options?.limit ?? 25,
      LanguageCode: options?.languageCode,
    };
    // dictionaryUris are passed as repeated query params
    if (options?.dictionaryUris?.length) {
      query.DictionaryUris = options.dictionaryUris.join(",");
    }
    return this.request<TextSearchResponse>("/api/TextSearch/v2", query);
  }
}
