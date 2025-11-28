export interface AdsResponse {
  titulos_ads: string[];
  descricoes_ads: string[];
}

export interface FormData {
  keyword: string;
  numHeadlines: number;
  creativity: number;
  persuasiveness: number;
}