import db from "@/lib/db";
import getSession from "@/lib/seeeion";
import { UserIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getStream(id: number) {
  const stream = await db.liveStream.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      stream_id: true,
      stream_key: true,
      userId: true,
      user: {
        select: {
          avater: true,
          username: true,
        },
      },
    },
  });
  return stream;
}

export default async function StreamDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const stream = await getStream(id);
  if (!stream) {
    return notFound;
  }
  const session = await getSession();
  return (
    <div className="p-10">
      <div className="relative aspect-video">
        <iframe
          src={`https://${process.env.CLOUDFLARE_DOMAIN}/6ee9218ef9ceb106044c55c0072395c0/iframe`}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          className="w-full h-full"
        ></iframe>
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {stream.user.avater !== null ? (
            <Image
              src={stream.user.avater}
              width={40}
              height={40}
              alt={stream.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
      </div>
      {stream.userId === session.id! ? (
        <div className="bg-yellow-200 p-5 text-black rounded-md">
          <div className="flex gap-2 flex-wrap">
            <span className="font-semibold">방송용 URL : </span>
            <span>rtmps://live.cloudflare.com:443/live/</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="font-semibold">방송용 Key : </span>
            <span>{stream.stream_key}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
