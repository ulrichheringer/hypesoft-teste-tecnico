export type Category = {
  id: string;
  name: string;
};

export type CreateCategoryInput = {
  name: string;
};

export type UpdateCategoryInput = CreateCategoryInput;
