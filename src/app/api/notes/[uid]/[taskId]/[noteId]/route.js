import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// --- SUBIR IMAGEN DE NOTA ---
export async function POST(req, { params }) {
  const { uid, taskId, noteId } = await params;

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file received" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Estructura de carpeta: fasttools/uid/taskID/noteID/image
    const fileName = `fasttools/${uid}/task${taskId}/note${noteId}/image`;

    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type || "image/jpeg",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    return Response.json(
      {
        url: `${process.env.R2_PUBLIC_URL}/${fileName}`,
        publicId: fileName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("R2 Note Upload Error:", error);
    return Response.json(
      { error: "Error uploading note image" },
      { status: 500 }
    );
  }
}

// --- ELIMINAR IMAGEN DE NOTA ---
export async function DELETE(req, { params }) {
  // Nota: Es mejor sacar los params directamente de la URL si tu estructura de archivos lo permite
  const { uid, taskId, noteId } = await params;

  // El Key debe coincidir exactamente con el que usamos en el POST
  const fileName = `fasttools/${uid}/task${taskId}/note${noteId}/image`;

  try {
    const deleteParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    return Response.json(
      { message: "Note image deleted from R2" },
      { status: 200 }
    );
  } catch (error) {
    console.error("R2 Delete Error:", error);
    return Response.json(
      { error: "Error deleting note image from R2" },
      { status: 500 }
    );
  }
}
