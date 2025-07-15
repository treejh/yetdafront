import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Plus, Check } from "lucide-react";

interface Follower {
  userId: number;
  name: string;
  image: string;
  introduce?: string;
}

export function Follower({
  user,
  following,
}: {
  user?: Follower[];
  following?: Follower[];
}) {
  if (!user) {
    return <div>팔로우한 사용자가 존재하지 않습니다</div>;
  }

  return (
    <>
      {user.map((person, index) => (
        <div
          key={`${person.userId}-${index}`}
          className="h-[132px] w-full grid grid-cols-2 justify-start items-center gap-4"
        >
          <div className="flex flex-row w-fit gap-5 items-center">
            <Image
              src={person.image || "/images/sample-image.jpg"}
              alt={person.name}
              width={100}
              height={100}
              className="rounded-full"
            />
            <div className="grid grid-rows-2 gap-2">
              <p className="font-bold">{person.name}</p>
              <p>{person.introduce}</p>
            </div>
          </div>
          <div className="flex justify-end">
            {following && following.some(f => f.userId === person.userId) ? (
              <Button
                variant="outline"
                className="bg-[#1f9eff] text-white w-[129px] h-[40px] hover:bg-[#0064ff]"
              >
                <Check /> 팔로잉
              </Button>
            ) : (
              <Button
                variant="outline"
                className="text-[#1f8ce6] w-[129px] h-[40px] hover:bg-[#0064ff] hover:text-white"
              >
                <Plus /> 팔로우
              </Button>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
