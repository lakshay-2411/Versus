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
};
