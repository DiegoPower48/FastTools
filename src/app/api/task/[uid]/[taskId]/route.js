import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// --- SUBIR IMAGEN DE TAREA ---
export async function POST(req, { params }) {
  const { uid, taskId } = await params;

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "Missing file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Nombre del archivo: fasttools/uid/taskID/image
    const fileName = `fasttools/${uid}/task${taskId}/image`;

    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type || "image/jpeg",
    };

    // R2 sobrescribe automáticamente si la Key es la misma (overwrite: true)
    await s3Client.send(new PutObjectCommand(uploadParams));

    return Response.json(
      {
        secure_url: `${process.env.R2_PUBLIC_URL}/${fileName}`,
        public_id: fileName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading task image:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}

// --- BORRAR TODO LO RELACIONADO A UNA TAREA ---
export async function DELETE(req, { params }) {
  const { uid, taskId } = await params;
  const folderPath = `fasttools/${uid}/task${taskId}/`;

  try {
    // 1. Listar todos los archivos que empiezan con ese prefijo (imágenes de la tarea, notas, etc.)
    const listParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: folderPath,
    };

    const listedObjects = await s3Client.send(
      new ListObjectsV2Command(listParams)
    );

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      return Response.json(
        { message: "No files found to delete" },
        { status: 200 }
      );
    }

    // 2. Preparar el array de objetos a borrar
    const deleteParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Delete: {
        Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
      },
    };

    // 3. Borrar todos de golpe
    await s3Client.send(new DeleteObjectsCommand(deleteParams));

    // Nota: En R2, una vez borrados los archivos, la "carpeta" desaparece visualmente
    return Response.json(
      { message: "Task folder and files fully deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task folder:", error);
    return Response.json(
      { error: "Failed to delete task folder" },
      { status: 500 }
    );
  }
}
