import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";

export function Step1() {
  return <>
    <form>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>第一步：匹配表头</FieldLegend>
          <FieldDescription>1</FieldDescription>
        </FieldSet>
      </FieldGroup>
    </form>
  </>
}
