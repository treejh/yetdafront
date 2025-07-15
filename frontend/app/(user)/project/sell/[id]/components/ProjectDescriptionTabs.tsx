"use client";

import type { FAQ } from "@/types/project/faq";
import type { Review } from "@/types/project/review";
import type { Update } from "@/types/project/update";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Props {
  description: string;
  faqs: FAQ[];
  reviews: Review[];
  updates: Update[];
}

export default function ProjectDescriptionTabs({
  description,
  faqs = [],
  reviews = [],
  updates = [],
}: Props) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-4 gap-1 bg-gray-100 p-1 rounded-md mb-4">
        <TabsTrigger
          value="description"
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold rounded-md"
        >
          소개
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold rounded-md"
        >
          후기
        </TabsTrigger>
        <TabsTrigger
          value="faq"
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold rounded-md"
        >
          FAQ
        </TabsTrigger>

        <TabsTrigger
          value="updates"
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold rounded-md"
        >
          공지사항
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-4">
        <Card>
          <CardContent className="prose max-w-none text-gray-800">
            <div className="whitespace-pre-wrap">{description}</div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="faq" className="mt-4 space-y-4">
        {faqs.map((faq, i) => (
          <Card key={i}>
            <CardContent>
              <h4 className="font-semibold text-sky-600 mb-2">
                Q. {faq.question}
              </h4>
              <p className="text-gray-700">A. {faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="reviews" className="mt-4 space-y-4">
        {reviews.map((review, i) => (
          <Card key={i}>
            <CardContent>
              <div className="flex justify-between mb-2">
                <p className="font-medium">{review.user}</p>
                <span className="text-sm text-gray-400">{review.date}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.content}</p>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="updates" className="mt-4 space-y-4">
        {updates.map((update, i) => (
          <Card key={i}>
            <CardContent>
              <div className="flex justify-between mb-1">
                <h4 className="font-semibold">{update.title}</h4>
                <span className="text-sm text-gray-500">{update.date}</span>
              </div>
              <p className="text-gray-700 mt-2 leading-relaxed">
                {update.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
}
