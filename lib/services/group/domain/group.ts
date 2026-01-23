export interface GroupModel {
  id?: number;
  label: string;
  budget: number;
  group_holding: {
    id?: number;
    holding_id: number;
  }[];
}
