export interface BuryExpression {
  actionType: "CHANGE" | "CLICK" | "SEARCH" | "CHOOSE";
  actionName: string;
  position: string;
}
