import { useHoldingInfo } from "@/app/(home)/holdings/[id]/_hooks/use-holding-info";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DataPage = ({
  onTabChange,
}: {
  onTabChange: (isSummary: boolean) => void;
}) => {
  const { id, data } = useHoldingInfo();

  return (
    <Tabs
      defaultValue={TabKey.Summary}
      className="w-full"
      onValueChange={(t) => onTabChange(t === TabKey.Summary)}
    >
      <div className={"flex justify-center"}>
        <TabsList>
          <TabsTrigger value={TabKey.Summary}>Account</TabsTrigger>
          <TabsTrigger value={TabKey.Table}>Password</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value={TabKey.Summary}>
        Make changes to your account here.
      </TabsContent>
      <TabsContent value={TabKey.Table}>Change your password here.</TabsContent>
    </Tabs>
  );
};

enum TabKey {
  Summary = "summary",
  Table = "table",
}
