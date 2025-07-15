import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/MyTabs";

interface Tab {
  value: string;
  content: React.ReactNode;
}

export function TabBar({
  tabs,
  defaultValue = "소개글",
}: {
  tabs: Tab[];
  defaultValue: string;
}) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full pt-[40px] pb-[40px]">
      <TabsList>
        {tabs.map(({ value }) => (
          <TabsTrigger key={value} value={value}>
            {value}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(({ value, content }) => (
        <TabsContent key={value} value={value}>
          {content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
