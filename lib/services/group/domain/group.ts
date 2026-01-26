export interface GroupModel {
  id?: number;
  label: string;
  budget: number;
  group_holding: {
    holding_id: number;
  }[];
}
