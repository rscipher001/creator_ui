export const DATABASE = {
  MYSQL: "MySQL",
  POSTGRESQL: "PostgreSQL",
};

export const MAILER = {
  MAILGUN: "Mailgun",
  SES: "SES",
  SMTP: "SMTP",
  SPARK_POST: "SparkPost",
};

export const PROJECT_TYPE = {
  API: "API",
  SSR: "SSR",
};

export const STORAGE = {
  LOCAL: "Local",
  S3: "S3",
  GCS: "GCS",
};

export const BACKEND = {
  ADONIS: "Adonis",
};

export const FRONTEND = {
  BUEFY: "Buefy",
};

export const RELATION_TYPE = {
  HAS_ONE: "HasOne",
  HAS_MANY: "HasMany",
  BELONGS_TO: "BelongsTo",
  MANY_TO_MANY: "ManyToMany",
};

export const REQUEST_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

export const API_INPUT_TYPE = {
  STRING: "String",
  DECIMAL: "Decimal",
  INTEGER: "Integer",
  DATE: "Date",
  BOOLEAN: "Boolean",
  FILE: "File",
};

export const UI_INPUT_TYPE = {
  INPUT: "Input",
  SELECT: "Select",
  RADIO: "Radio",
  CHECKBOX: "Checkbox",
};

export default {
  database: [DATABASE.MYSQL, DATABASE.POSTGRESQL],
  mailer: [MAILER.MAILGUN, MAILER.SES, MAILER.SMTP, MAILER.SPARK_POST],
  projectType: [PROJECT_TYPE.API, PROJECT_TYPE.SSR],
  storage: [STORAGE.LOCAL, STORAGE.S3, STORAGE.GCS],
  backend: [BACKEND.ADONIS],
  frontend: [FRONTEND.BUEFY],
  relationType: [
    RELATION_TYPE.HAS_ONE,
    RELATION_TYPE.HAS_MANY,
    RELATION_TYPE.BELONGS_TO,
    RELATION_TYPE.MANY_TO_MANY,
  ],
  requestMethod: [
    REQUEST_METHOD.GET,
    REQUEST_METHOD.POST,
    REQUEST_METHOD.PUT,
    REQUEST_METHOD.PATCH,
    REQUEST_METHOD.DELETE,
  ],

  topLevelInputType: [
    API_INPUT_TYPE.STRING,
    API_INPUT_TYPE.DECIMAL,
    API_INPUT_TYPE.INTEGER,
    API_INPUT_TYPE.DATE,
    API_INPUT_TYPE.BOOLEAN,
    API_INPUT_TYPE.FILE,
  ],
  uiInputType: [
    UI_INPUT_TYPE.INPUT,
    UI_INPUT_TYPE.SELECT,
    UI_INPUT_TYPE.RADIO,
    UI_INPUT_TYPE.CHECKBOX,
  ],
};
