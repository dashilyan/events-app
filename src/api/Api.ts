/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface EventsListSerializer {
  /** ID события */
  id?: number;
  /** Название события */
  title?: string;
  /** Описание события */
  description?: string;
  /** Тип события */
  event_type?: string;
  /**
   * Дата и время начала события
   * @format date-time
   */
  start_date?: string;
  /**
   * Дата и время окончания события
   * @format date-time
   */
  end_date?: string;
  /** Место проведения события */
  location?: string;
  /** URL изображения события */
  image?: string;
  /** Данные о черновике визита */
  visit?: {
    /** ID визита */
    id?: number;
    /** ID пользователя */
    user_id?: number;
    /** Статус визита */
    status?: string;
    /**
     * Дата и время создания визита
     * @format date-time
     */
    created_at?: string;
  } | null;
  /** Количество событий в визите */
  events_count?: number;
}

export interface EventDetailSerializer {
  /** ID события */
  id?: number;
  /** Название события */
  title?: string;
  /** Описание события */
  description?: string;
  /** Тип события */
  event_type?: string;
  /**
   * Дата и время начала события
   * @format date-time
   */
  start_date?: string;
  /**
   * Дата и время окончания события
   * @format date-time
   */
  end_date?: string;
  /** Место проведения события */
  location?: string;
  /** URL изображения события */
  image?: string;
}

export interface EventVisitSerializer {
  /** ID события для добавления в визит */
  event_id?: number;
  /**
   * Дата визита
   * @format date-time
   */
  date?: string;
}

export interface AddImageSerializer {
  /** ID события для добавления изображения */
  event_id?: number;
  /**
   * Файл изображения
   * @format binary
   */
  pic?: File;
}

export interface VisitSerializer {
  /** ID визита */
  id?: number;
  /** ID пользователя */
  user_id?: number;
  /** Статус визита */
  status?: string;
  /**
   * Дата и время создания визита
   * @format date-time
   */
  created_at?: string;
  /**
   * Дата и время формирования визита
   * @format date-time
   */
  formed_at?: string | null;
}

export interface PutVisitSerializer {
  /** Статус визита */
  status?: string;
  /**
   * Дата и время формирования визита
   * @format date-time
   */
  formed_at?: string | null;
}

export interface VisitWithEventsSerializer {
  /** ID визита */
  id?: number;
  /** ID пользователя */
  user_id?: number;
  /** Статус визита */
  status?: string;
  /**
   * Дата и время создания визита
   * @format date-time
   */
  created_at?: string;
  /**
   * Дата и время формирования визита
   * @format date-time
   */
  formed_at?: string | null;
  /** Список событий в визите */
  events?: EventsInVisitSerializer[];
}

export interface EventsInVisitSerializer {
  /** ID события */
  id?: number;
  /** Название события */
  title?: string;
  /** Описание события */
  description?: string;
  /** Тип события */
  event_type?: string;
  /**
   * Дата и время начала события
   * @format date-time
   */
  start_date?: string;
  /**
   * Дата и время окончания события
   * @format date-time
   */
  end_date?: string;
  /** Место проведения события */
  location?: string;
  /** URL изображения события */
  image?: string;
}

export interface AcceptRequestSerializer {
  /** Принять или отклонить запрос */
  accept?: boolean;
}

export interface UserRegistrationSerializer {
  /** Имя пользователя */
  username?: string;
  /** Пароль пользователя */
  password?: string;
  /**
   * Email пользователя
   * @format email
   */
  email?: string;
}

export interface UserUpdateSerializer {
  /** Имя пользователя */
  username?: string;
  /**
   * Email пользователя
   * @format email
   */
  email?: string;
  /** Имя пользователя */
  first_name?: string;
  /** Фамилия пользователя */
  last_name?: string;
}

export interface AuthTokenSerializer {
  /** Имя пользователя */
  username?: string;
  /** Пароль пользователя */
  password?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Events API
 * @version 1.0.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  events = {
    /**
     * @description Получение списка событий (можно фильтровать по типу события через параметр 'event_type')
     *
     * @name EventsList
     * @summary Получение списка событий
     * @request GET:/events/
     */
    eventsList: (
      query?: {
        /** Фильтр по типу события (частичное совпадение) */
        event_type?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EventsListSerializer[], any>({
        path: `/events/`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создание нового события (только для персонала)
     *
     * @name EventCreate
     * @summary Создание нового события
     * @request POST:/events/
     * @secure
     */
    eventCreate: (data: EventDetailSerializer, params: RequestParams = {}) =>
      this.request<EventDetailSerializer, void>({
        path: `/events/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получение детальной информации о событии по ID
     *
     * @name EventDetail
     * @summary Получение детальной информации о событии
     * @request GET:/events/{pk}/
     */
    eventDetail: (pk: number, params: RequestParams = {}) =>
      this.request<EventDetailSerializer, any>({
        path: `/events/${pk}/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Удаление события по ID (только для персонала)
     *
     * @name EventDelete
     * @summary Удаление события
     * @request DELETE:/events/{pk}/
     * @secure
     */
    eventDelete: (pk: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/events/${pk}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Обновление события (частично) по ID (только для персонала)
     *
     * @name EventUpdate
     * @summary Обновление события
     * @request PUT:/events/{pk}/
     * @secure
     */
    eventUpdate: (pk: number, data: EventDetailSerializer, params: RequestParams = {}) =>
      this.request<EventDetailSerializer, void>({
        path: `/events/${pk}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Adds a specific event to a user's draft visit. If no draft visit exists, a new visit is created.
     *
     * @name SignupCreate
     * @summary Add an event to a user's draft visit
     * @request POST:events/signup/{pk}/
     */
    signupCreate: (
      pk: number,
      data: {
        /**
         * The date of event visit
         * @format date
         * @example "2024-03-15"
         */
        date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `events/signup/${pk}/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Загрузка изображения для события (только для персонала)
     *
     * @name AddImage
     * @summary Загрузка изображения для события
     * @request POST:/events/image/
     * @secure
     */
    addImage: (data: AddImageSerializer, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/events/image/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),
  };
  listVisits = {
    /**
     * @description Получение списка всех визитов, кроме черновиков. Доступно как для персонала, так и для обычных пользователей. Персонал видит все визиты, а обычные пользователи - только свои.
     *
     * @name ListVisitsByUsername
     * @summary Получение списка всех визитов, кроме черновиков
     * @request GET:/list-visits/
     * @secure
     */
    listVisitsByUsername: (
      query?: {
        /**
         * Фильтр по дате создания визита (формат ГГГГ-ММ-ДД)
         * @format date
         */
        date?: string;
        /** Фильтр по статусу визита */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<VisitSerializer[], any>({
        path: `/list-visits/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  visit = {
    /**
     * @description Получение деталей визита по ID (требуется аутентификация)
     *
     * @name GetVisitById
     * @summary Получение деталей визита по ID
     * @request GET:/visit/{pk}/
     * @secure
     */
    getVisitById: (pk: number, params: RequestParams = {}) =>
      this.request<VisitWithEventsSerializer, any>({
        path: `/visit/${pk}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновление визита по ID (требуется аутентификация)
     *
     * @name PutVisitById
     * @summary Обновление визита
     * @request PUT:/visit/{pk}/
     * @secure
     */
    putVisitById: (pk: number, data: PutVisitSerializer, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/visit/${pk}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  formVisit = {
    /**
     * @description Формирование чернового визита (только для владельца визита)
     *
     * @name FormVisitById
     * @summary Формирование чернового визита
     * @request PUT:/form-visit/{pk}/
     * @secure
     */
    formVisitById: (pk: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/form-visit/${pk}/`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
  moderateVisit = {
    /**
     * @description Модерация визита (принятие/отклонение) (только для персонала)
     *
     * @name ModerateVisitById
     * @summary Модерация визита (принятие/отклонение)
     * @request PUT:/moderate-visit/{pk}/
     * @secure
     */
    moderateVisitById: (pk: number, data: AcceptRequestSerializer, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/moderate-visit/${pk}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Удаление визита (только для персонала)
     *
     * @name DeleteVisitById
     * @summary Удаление визита
     * @request DELETE:/moderate-visit/{pk}/
     * @secure
     */
    deleteVisitById: (pk: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/moderate-visit/${pk}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  editEventVisit = {
    /**
     * @description Изменение даты или удаление события из визита (только для персонала)
     *
     * @name EditEventInVisit
     * @summary Изменение даты или удаление события из визита
     * @request PUT:/edit-event-visit/{pk}/
     * @secure
     */
    editEventInVisit: (
      pk: number,
      data: {
        /** ID события в визите */
        event_id?: number;
        /**
         * Новая дата для события в визите
         * @format date
         */
        date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/edit-event-visit/${pk}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Удаление события из визита (только для персонала)
     *
     * @name DeleteEventFromVisit
     * @summary Удаление события из визита
     * @request DELETE:/edit-event-visit/{pk}/
     * @secure
     */
    deleteEventFromVisit: (
      pk: number,
      data: {
        /** ID события для удаления из визита */
        event_id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/edit-event-visit/${pk}/`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  register = {
    /**
     * @description Регистрация нового пользователя
     *
     * @name Register
     * @summary Регистрация нового пользователя
     * @request POST:/register/
     */
    register: (data: UserRegistrationSerializer, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/register/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  profile = {
    /**
     * @description Обновление данных текущего пользователя (требуется аутентификация)
     *
     * @name Profile
     * @summary Обновление данных пользователя
     * @request PUT:/profile/
     * @secure
     */
    profile: (data: UserUpdateSerializer, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/profile/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  login = {
    /**
     * @description Вход пользователя
     *
     * @name Login
     * @summary Вход пользователя
     * @request POST:/login/
     */
    login: (data: AuthTokenSerializer, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/login/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  logout = {
    /**
     * @description Выход пользователя (требуется аутентификация)
     *
     * @name Logout
     * @summary Выход пользователя
     * @request POST:/logout/
     * @secure
     */
    logout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
}
