import { Client } from "@s3";
import { walk } from "@std/fs";
import type { S3Mutable, S3ObjectInfo, S3Props } from "../types/s3.types.ts";

export const getS3 = ({
  endpoint,
  bucket,
  secretKey,
  accessKey,
  region,
}: S3Props): S3Mutable => {
  const client = new Client({
    endPoint: endpoint,
    useSSL: true,
    accessKey,
    secretKey,
    region,
  });

  const checkBucket = async (bucket: string) => {
    const bucketExists = await client.bucketExists(bucket);
    if (!bucketExists) client.makeBucket(bucket);
  };

  const getFiles = (): Promise<S3ObjectInfo[]> =>
    new Promise<S3ObjectInfo[]>((resolve, reject) => {
      const stream = client.listObjects(bucket);
      const data: S3ObjectInfo[] = [];
      stream.on("data", (obj: S3ObjectInfo) => {
        data.push(obj);
      });
      stream.on("end", () => {
        resolve(data);
      });
      stream.on("error", (err) => {
        reject(err);
      });
    });

  const removeFiles = async (...name: string[]) => {
    const objectsList = (await getFiles()).filter((file) =>
      name.includes(file.name),
    );
    await removeObjects(objectsList);
  };

  const removeObjects = async (objects: S3ObjectInfo[]) => {
    await client.removeObjects(bucket, objects);
  };

  const syncPath = async (
    path: string,
    deleteLocalFiles: boolean = false,
  ): Promise<void> => {
    await checkBucket(bucket);

    const files = walk(path, {
      includeDirs: false,
    });

    for await (const entry of files) {
      if (!entry.isFile) continue;

      await client.fPutObject(bucket, entry.name, entry.path);
      if (deleteLocalFiles) await Deno.remove(entry.path);
    }
  };

  return {
    syncPath,

    getFiles,
    removeFiles,

    removeObjects,
  };
};
