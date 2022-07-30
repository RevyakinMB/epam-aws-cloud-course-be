// used by autoswagger serverless plugin

// re-exporting from ./product doesn't seem to work for the plugin
export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
};

export type ProductRequestBody = {
  title: string;
  description: string;
  price: number;
};

export type ProductListResponse = {
  data: Product[];
  count: number;
};
