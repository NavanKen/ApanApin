import instance from "@/lib/axios/instance";

const mediaServices = {
  uploadFile: (formData) =>
    instance.post("/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deleteFile: (url) => instance.delete("/media", { data: { url } }),
};

export default mediaServices;
