type VersusFormType = {
  title?: string;
  description?: string;
};

type VersusFormTypeError = {
  title?: string;
  description?: string;
  expire_at?: string;
  image?: string;
};

type VersusType = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  image: string;
  created_at: string;
  expire_at: string;
  ClashItem: Array<VersusItem>;
  ClashComments: Array<VersusComment>;
};

type VersusItemForm = {
  image: File | null;
};

type VersusItem = {
  id: number;
  count: number;
  image: string;
};

type VersusComment = {
  id: number;
  comment: string;
  created_at: string;
};
